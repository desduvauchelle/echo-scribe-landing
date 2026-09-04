#!/usr/bin/env bash
set -euo pipefail

# Usage: bash tools/screenshots/extract-video.sh /path/to/recording.mp4
# Selected from rec-1788479257159.cleaned.mp4. Local processing only.
video="${1:?Pass the source recording path}"
out_dir="$(cd "$(dirname "$0")/../.." && pwd)/public/screenshots/recorded"
command -v ffmpeg >/dev/null
mkdir -p "$out_dir"

extract() {
  ffmpeg -hide_banner -loglevel error -ss "$1" -i "$video" \
    -map 0:v:0 -frames:v 1 -an -map_metadata -1 -vf "${3:-null}" \
    -c:v png -compression_level 9 -y "$out_dir/$2.png"
}

# Product views only. Crops exclude desktop/sidebar clutter and private share URLs.
extract 240 meeting-library 'crop=868:552:232:48'
extract 400 chat-answer 'crop=660:552:440:48'
extract 400 chat-workspace
extract 300 meeting-summary 'crop=480:470:620:64'
extract 280 coaching-feedback 'crop=460:376:630:104'
extract 460 recording-preview 'crop=560:428:540:0'
