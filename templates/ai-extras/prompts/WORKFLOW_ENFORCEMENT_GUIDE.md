# AI Agent 工作流程强制执行指南

## ⚠️ 重要提示

本指南是 AI Agent 的**强制执行规范**，不是可选建议。AI Agent 必须在每个关键节点自动执行相应检查，无需等待用户请求。

> 完整 11 阶段流程速查：`.ai/workflow/examples/quick-reference-guide.md`

---

## 自动化触发点

### 触发点 1：对话开始
**时机**：用户开始新对话或首次提出需求
**自动执行**：
1. 读取所有项目配置文件（含 `.ai/lessons-learned.md`、`.ai/anti-patterns.md`，如存在）
2. 向用户确认已加载规范
3. 询问用户的需求

### 触发点 2：需求接收
**时机**：用户描述开发任务
**自动执行**（以下步骤**全部必须执行**，Superpowers 技能与项目技能**并列强制**，不可互相替代）：
1. 调用 `superpowers:brainstorming` 探索需求意图和设计方案（已安装 Superpowers 时必须调用）
2. 调用 `task-prompt-generator` 生成标准化提示词（**必须执行，不得被 brainstorming 替代**）
3. 展示提示词给用户确认
4. 准备创建提示词文件（`.ai/prompts/prompt-{type}-{YYYYMMDD}.md`）

> ⚠️ **禁止行为**：执行完 `superpowers:brainstorming` 后直接进入开发，跳过 `task-prompt-generator`。两个步骤必须都执行。

### 触发点 3：开发准备
**时机**：用户确认提示词，准备开始开发
**自动执行**：
1. 创建提示词文件
2. 调用 `project-init` 加载项目配置
3. 调用 `superpowers:writing-plans` 生成结构化分步实现计划（如已集成 Superpowers）

### 触发点 4：测试编写（Red 阶段）
**时机**：准备编写测试
**自动执行**：
1. 标记当前 Agent 角色：`[Agent A - 测试编写]`
2. 使用 `[TEST_SKILL_NAME]` 技能 + `superpowers:test-driven-development`（如已集成）编写测试
3. 运行 `[TEST_CMD]` 确认测试失败（预期行为）

### 触发点 5：代码实现（Green + Refactor 阶段）
**时机**：准备实现功能代码
**自动执行**：
1. 标记当前 Agent 角色：`[Agent B - 代码实现]`
2. 按实现计划编写最小化代码，运行 `[TEST_CMD]` 确认通过
3. 重构阶段调用 `superpowers:simplify`（如已集成）审查代码质量，确认测试仍通过

### 触发点 6：多智能体验证
**时机**：功能实现完成，准备提交前验证
**自动执行**：
1. 标记当前 Agent 角色：`[Agent C - Debug 验证]`
2. 调用 `superpowers:dispatching-parallel-agents` 并行执行（如已集成）：
   - 任务1：`[TEST_CMD]` + `[TEST_COVERAGE_CMD]`
   - 任务2：`[LINT_CMD]` + `[BUILD_CMD]`
3. 遇到 Bug 时调用 `superpowers:systematic-debugging`（如已集成）

### 触发点 7：提交准备
**时机**：准备提交代码
**自动执行**（以下步骤**全部必须执行**，缺一不可）：
1. 调用 `superpowers:verification-before-completion`（已安装 Superpowers 时必须调用）或手动实际运行以下命令并确认输出通过（**禁止仅凭记忆或之前的运行结果声称已通过**）：
   - `[TEST_CMD]`
   - `[TEST_COVERAGE_CMD]`（行覆盖率 ≥ 80%）
   - `[LINT_CMD]`
   - `[BUILD_CMD]`
2. 工具链全部通过后，**必须**使用 `code-review-validation` 技能触发 Reviewer Agent（**不得被 superpowers:verification-before-completion 替代，两步必须都执行**）：
   - 传入今天的 prompt 文件、`git diff --staged`、变更的测试文件、`.ai/anti-patterns.md`（如存在）
   - Reviewer Agent 角色定义见 `.ai/agents/roles/code-reviewer.md`
   - 报告保存到 `.ai/reviews/review-{type}-{YYYYMMDD}.md`
3. 审查结论为 `Needs Revision` 时停止，返回触发点 5 修复
4. 审查结论为 `Pass` 时，若本次包含 **Bug 修复**，必须执行**经验沉淀**（规则 6）：
   - 在 `.ai/lessons-learned.md` 新增 LL 记录（症状→根因→正确做法）
   - 评估是否需要在 `.ai/anti-patterns.md` 新增 AP 记录
5. 更新 `.ai/changelog/ai-modifications.md`
6. 调用 `superpowers:requesting-code-review`（如已集成）整理审查要点

> ⚠️ **禁止行为**：跳过 `code-review-validation` 直接提交代码；或仅凭记忆、之前会话的运行结果声称工具链已通过。

---

## 📋 阶段检查清单

### 开发前
- [ ] 调用 `superpowers:brainstorming` 探索需求（**必须**，已安装时）
- [ ] 使用 `task-prompt-generator` 生成并归档提示词（**必须**，不得被 brainstorming 替代）
- [ ] 调用 `project-init` 加载项目上下文
- [ ] 调用 `superpowers:writing-plans` 生成实现计划（已安装时必须；未安装则手动规划）
- [ ] 已读取 `.ai/architect/project-architecture-overview.md`
- [ ] 已读取 `.ai/changelog/ai-modifications.md`

### 开发中（TDD）
- [ ] [Agent A] 使用 `[TEST_SKILL_NAME]` 编写测试
- [ ] `[TEST_CMD]` → 测试失败（Red，预期行为）
- [ ] [Agent B] 按实现计划写最小化代码（Green）
- [ ] `[TEST_CMD]` → 所有测试通过
- [ ] [Agent B] 重构，调用 `superpowers:simplify`（Refactor）
- [ ] `[TEST_CMD]` → 测试仍通过

### 提交前（Agent 负责）
- [ ] 调用 `superpowers:dispatching-parallel-agents` 并行验证（或手动逐一执行）
- [ ] 调用 `superpowers:verification-before-completion`（实际运行以下命令并确认输出）：
  - [ ] `[TEST_CMD]` 通过
  - [ ] `[TEST_COVERAGE_CMD]` 行覆盖率 ≥ 80%
  - [ ] `[LINT_CMD]` 通过
- [ ] 工具链通过后，**必须**使用 `code-review-validation` 触发 Reviewer Agent 独立审查（不得跳过）
- [ ] 审查报告结论为 Pass（或仅 Warning）才继续提交
- [ ] 审查报告已保存至 `.ai/reviews/review-{type}-{YYYYMMDD}.md`
- [ ] **若当次含 Bug 修复**：`.ai/lessons-learned.md` 已新增 LL 记录（规则 6）
- [ ] 修改记录已更新（`.ai/changelog/ai-modifications.md` 含今天日期）
- [ ] 提示词已归档（`.ai/prompts/prompt-{type}-YYYYMMDD.md`）

### 推送前（Git Hook 自动执行）
- [ ] `[TEST_CMD]` 通过
- [ ] `[BUILD_CMD]` 构建成功

### PR 创建后（GitHub Actions 自动执行）
- [ ] 测试通过（`[TEST_CMD]`）
- [ ] 代码风格（`[LINT_CMD]`）
- [ ] 构建成功（`[BUILD_CMD]`）

---

## 🧪 TDD 流程

### Red → Green → Refactor

**Red**：
```bash
# 编写测试后运行，确认失败
[TEST_CMD]
```

**Green**：
```bash
# 实现代码后运行，确认通过
[TEST_CMD]
```

**Refactor**：
```bash
# 重构后运行，确认测试仍通过
[TEST_CMD]
# simplify 技能审查代码质量（如已集成 Superpowers）
```

---

## 📝 修改记录格式

```markdown
### YYYY-MM-DD
- [💻 Code]：任务描述
    - 修改项1
    - 修改项2
```

模式标签：`[💻 Code]`、`[🏗️ Architect]`、`[📝 docs]`、`[🐛 fix]`、`[🔧 chore]`

---

## 🔍 Git Hooks 自动执行的检查

| Hook | 触发时机 | 检查内容 |
|---|---|---|
| `pre-commit` | `git commit` | 提示词归档、修改记录、代码风格 |
| `commit-msg` | `git commit` | 提交信息格式（Conventional Commits）|
| `pre-push` | `git push` | 测试通过、构建成功 |
| `post-merge` | `git merge` | 自动同步 Skills 配置 |

---

## 📊 检查失败处理

### 提示词未归档
```bash
touch .ai/prompts/prompt-{type}-$(date +%Y%m%d).md
git add .ai/prompts/prompt-{type}-$(date +%Y%m%d).md
```

### 修改记录未更新
在 `.ai/changelog/ai-modifications.md` 中添加今天的记录，格式见上方。

### 测试覆盖率不足
```bash
[TEST_COVERAGE_CMD]
# 查看覆盖率报告，定位未覆盖代码
[TEST_CMD]
```

### 遇到 Bug
调用 `superpowers:systematic-debugging`（如已集成），或系统化定位根因，不要反复重试同一命令。
**Bug 修复完成后**，必须执行经验沉淀（规则 6）：在 `.ai/lessons-learned.md` 新增 LL 记录，评估更新 `.ai/anti-patterns.md`。

### Reviewer Agent 返回 Needs Revision
停止提交，按审查报告中的具体问题（含文件:行号定位）返回触发点 5 修复，修复后重新走触发点 7。

---

## 📚 相关文档

- **完整 11 阶段流程**：`.ai/workflow/examples/quick-reference-guide.md`
- **项目架构**：`.ai/architect/project-architecture-overview.md`
- **编码规范**：`.ai/skills/[CODE_STYLE_SKILL_NAME]/skill.md`
- **技能索引**：`AGENTS.md`
- **Reviewer Agent 角色定义**：`.ai/agents/roles/code-reviewer.md`
- **审查报告目录**：`.ai/reviews/`

---

**最后更新**：[LAST_UPDATED]
**维护者**：AI Assistant
**状态**：🟢 生产就绪
