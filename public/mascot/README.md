# Tucky mascot poses

Asset: `tucky-poses.png` (1920 × 819). Three evenly spaced poses: listening, collecting notes, waving with a laptop. Used through Next.js Image and CSS framing; no runtime image generation.

Created with the built-in imagegen tool using `public/tucky.jpeg` as the identity reference. The original icon is unchanged. The final sheet has an ivory background, not transparency.

## Generation prompt

Create a production website illustration sprite sheet based on the exact squirrel/chipmunk mascot reference. Preserve caramel brown fur, dark brown head stripes, friendly dark eyes, cream cheeks, tiny nose, green vest, thick warm dark-brown outlines, and the simple hand-drawn cartoon style. Three separate full-body poses, left to right in equal-width cells, with padding and aligned feet: (1) headphones and microphone, listening; (2) collecting cream paper notes and an acorn in a green satchel; (3) waving with a closed green laptop. Same character scale, no overlap, words, letters, logos, numbers, frames, or background scenery. Crisp outlines for use at 150px and 400px. Request transparent background.

## Background correction prompt

Change only the background. Remove every baked-in checkerboard square and replace with uniform warm ivory #fbf6ea. No pattern, gradient, or added shadows. Preserve the three characters, outlines, poses, colors, scale, equal-thirds spacing, and 1920 × 819 composition. Do not add text.

## Interaction

Hero toggles listening and waving on click or keyboard activation. Each mascot plays one short arrival animation when visible. Reduced-motion CSS disables these animations. The greeting label is translated in all eight site dictionaries.
