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
- Creates `.ai/skills/` with 6 skills:
  - `project-init` — auto-load context on session start
  - `task-prompt-generator` — standardize task prompts
  - `workflow-enforcer` — enforce TDD workflow
  - `code-review-validation` — trigger code review agent
  - `code-style-constraints` — universal code style rules
  - `unit-test-generation-java` — Java/Spring Boot TDD
- Creates `.ai/agents/roles/` (test-writer, code-implementer, debugger, code-reviewer)
- Creates `.ai/prompts/`, `.ai/workflow/`, `.ai/architect/` and more
- Creates `.githooks/` (pre-commit, pre-push, commit-msg, post-merge)

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

**Invocation examples:**

```
# Natural language
帮我初始化 AI 开发规范

# Direct tool call (auto-detects tech stack)
使用 init_project 工具初始化当前项目

# With explicit parameters
调用 init_project，参数：techStack=go, teamName=backend-team

# Full parameter override
调用 init_project，参数：
  projectName=myapp
  techStack=java
  buildCmd=mvn clean install
  testCmd=mvn test
  lintCmd=mvn checkstyle:check
  teamName=后端组
```

### `validate_setup`

Checks completeness of AI standards configuration:

```
✅ CLAUDE.md                                      存在
✅ AGENTS.md                                      存在
✅ .ai/skills/task-prompt-generator/skill.md      存在
❌ .githooks/pre-commit                           缺失

发现 1 项问题，建议重新运行 init_project 修复。
```

**Invocation examples:**

```
# Natural language
检查当前项目的 AI 开发规范是否完整

# Direct tool call
调用 validate_setup 工具检查规范完整性

# With explicit directory
调用 validate_setup，参数：projectDir=/path/to/project
```

## How it works

Templates are bundled inside this npm package. When you run `npx -y @zherphy/ai-standards-mcp`, npm always fetches the latest version — so your templates stay up to date automatically.

## License

MIT
