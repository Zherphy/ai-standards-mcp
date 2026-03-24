# @zherphy/ai-standards-mcp

MCP server for initializing AI development standards in any project. Provides `init_project` and `validate_setup` tools for Claude Code agents.

## Installation

Add to Claude Code once, use in any project:

```bash
claude mcp add ai-standards -- npx -y @zherphy/ai-standards-mcp
```

## Tools

### `init_project`

Initializes AI development standards in the current project:

- Creates `CLAUDE.md` (AI agent behavior guide)
- Creates `AGENTS.md` (skills documentation)
- Creates `.ai/skills/` with 3 core skills:
  - `task-prompt-generator` — standardize task prompts
  - `workflow-enforcer` — enforce TDD workflow
  - `code-review-validation` — trigger code review agent
- Creates `.githooks/` (pre-commit, pre-push, commit-msg)

**Parameters** (all optional, auto-detected from project files):

| Parameter | Description |
|-----------|-------------|
| `projectDir` | Target directory (default: current working directory) |
| `projectName` | Project name (auto-detected from go.mod/package.json) |
| `techStack` | `go` / `node` / `java` / `python` |
| `buildCmd` | Build command |
| `testCmd` | Test command |
| `lintCmd` | Lint command |
| `teamName` | Team name (default: "项目开发组") |

**Example:** Tell your Claude Code agent:
> "帮我初始化 AI 开发规范"

### `validate_setup`

Checks completeness of AI standards configuration:

```
✅ CLAUDE.md                                      存在
✅ AGENTS.md                                      存在
✅ .ai/skills/task-prompt-generator/skill.md      存在
❌ .githooks/pre-commit                           缺失

发现 1 项问题，建议重新运行 init_project 修复。
```

## How it works

Templates are bundled inside this npm package. When you run `npx -y @zherphy/ai-standards-mcp`, npm always fetches the latest version — so your templates stay up to date automatically.

## License

MIT
