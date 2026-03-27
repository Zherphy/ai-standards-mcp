# 开发前准备检查清单

本清单用于确保开始开发前已做好充分准备。

---

## 文档阅读

- [ ] 已读取 `.ai/prompts/WORKFLOW_ENFORCEMENT_GUIDE.md`（工作流规范）
- [ ] 已读取 `.ai/architect/project-architecture-overview.md`（项目架构）
- [ ] 已读取 `.ai/changelog/ai-modifications.md`（最近 30 天的修改记录）
- [ ] 已读取 `.ai/skills/[CODE_STYLE_SKILL_NAME]/skill.md`（编码规范）

---

## 需求理解

- [ ] 已明确功能需求（输入、输出、约束）
- [ ] 已识别受影响的模块（Controller / Service / DAO）
- [ ] 已确认与已有功能的关系（是新功能还是修改现有功能）
- [ ] 已生成并归档任务提示词（`.ai/prompts/prompt-{type}-{YYYYMMDD}.md`）

---

## 架构理解

- [ ] 了解本次任务涉及的层级（Controller / Service / DAO）
- [ ] 确认遵循分层架构规则（Controller 不直接调用 DAO）
- [ ] 确认使用构造函数注入依赖
- [ ] 确认异常处理方式（使用标准 Result<T> 返回）

---

## 开发环境

- [ ] 项目可以正常编译：`[BUILD_CMD]`
- [ ] 已有测试可以全部通过：`[TEST_CMD]`

---

## TDD 准备

- [ ] 已确定测试类的位置（`src/test/` 对应目录）
- [ ] 已确认可用的测试框架和 Mock 工具
- [ ] 准备好遵循 Given-When-Then 测试模式

---

**最后更新**：[LAST_UPDATED]
**状态**：生产就绪
