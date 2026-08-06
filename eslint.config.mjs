import next from 'eslint-config-next'

const eslintConfig = [
  ...next,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'src/generated/**',
      // Claude Code session worktrees carry their own .next/ at a nested path
      '.claude/worktrees/**',
    ],
  },
]

export default eslintConfig
