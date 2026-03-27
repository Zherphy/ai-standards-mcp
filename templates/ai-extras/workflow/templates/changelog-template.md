# AI 修改记录模板

本模板用于规范化记录 AI 辅助的代码修改历史。

---

## 基础格式

```markdown
## [YYYY-MM-DD] [模式]：任务简述

- **模式**：feat | fix | refactor | test | docs
- **修改意图**：[Why - 解释为什么要做这个修改，解决了什么问题]
- **归档提示词**：`.ai/prompts/prompt-[type]-[YYYYMMDD].md`
- **核心改动**：
  - `path/to/file.java`：[具体修改内容描述]
  - `path/to/test/file.java`：[测试修改描述]
- **自验证**：
  - 测试：`[TEST_CMD]` → ✅ X 个测试全部通过
  - 代码风格：`[LINT_CMD]` → ✅ 无违规
```

---

## 按模式的详细示例

### feat（新功能）

```markdown
## [YYYY-MM-DD] feat：新增用户头像上传功能

- **模式**：feat
- **修改意图**：支持用户自定义头像，提升用户体验；产品需求 #123
- **归档提示词**：`.ai/prompts/prompt-development-[YYYYMMDD].md`
- **核心改动**：
  - `src/main/java/.../controller/UserController.java`：新增 `/upload-avatar` POST 端点
  - `src/main/java/.../service/UserService.java`：新增头像上传业务逻辑
  - `src/main/java/.../dao/StorageDao.java`：新增文件存储 API 调用
  - `src/test/java/.../service/UserServiceTest.java`：新增头像上传测试（5 个用例）
- **自验证**：
  - 测试：`[TEST_CMD]` → ✅ 全部通过
  - 代码风格：`[LINT_CMD]` → ✅ 无违规
```

### fix（Bug 修复）

```markdown
## [YYYY-MM-DD] fix：修复手机号验证码超时不清除的问题

- **模式**：fix
- **修改意图**：验证码超时后缓存键未删除，导致重新发送验证码失败；Issue #456
- **归档提示词**：`.ai/prompts/prompt-bugfix-[YYYYMMDD].md`
- **核心改动**：
  - `src/main/java/.../service/SmsService.java`：修复超时清理逻辑，第 89 行添加缓存删除
  - `src/test/java/.../service/SmsServiceTest.java`：新增超时场景测试
- **自验证**：
  - 测试：`[TEST_CMD]` → ✅ 全部通过（含新增 Bug 复现测试）
  - 代码风格：`[LINT_CMD]` → ✅ 无违规
```

### refactor（重构）

```markdown
## [YYYY-MM-DD] refactor：将用户验证逻辑提取为独立服务

- **模式**：refactor
- **修改意图**：UserController 中验证逻辑与业务逻辑混合，违反单一职责原则
- **归档提示词**：`.ai/prompts/prompt-refactor-[YYYYMMDD].md`
- **核心改动**：
  - `src/main/java/.../service/UserValidationService.java`：新建，提取验证逻辑
  - `src/main/java/.../controller/UserController.java`：改为调用 UserValidationService
  - `src/test/java/.../service/UserValidationServiceTest.java`：新增独立测试
- **自验证**：
  - 测试：`[TEST_CMD]` → ✅ 所有已有测试通过，无行为变化
  - 代码风格：`[LINT_CMD]` → ✅ 无违规
```

### test（补充测试）

```markdown
## [YYYY-MM-DD] test：补充登录功能测试覆盖

- **模式**：test
- **修改意图**：登录模块测试覆盖率仅 65%，低于 80% 基线要求
- **归档提示词**：`.ai/prompts/prompt-testing-[YYYYMMDD].md`
- **核心改动**：
  - `src/test/java/.../service/AuthServiceTest.java`：新增 12 个测试用例（边界+异常场景）
- **自验证**：
  - 测试：`[TEST_CMD]` → ✅ 全部通过
  - 覆盖率：登录模块达到 92%，整体 83%
```

---

## 常见错误示例（勿模仿）

```markdown
## ❌ 错误示例 1 - 记录内容过于模糊
## 2026-03-01 feat：修改了代码
- 改了一些文件
```

```markdown
## ❌ 错误示例 2 - 缺少"为什么"
## 2026-03-01 fix：修复问题
- **核心改动**：
  - `UserService.java`：修复了一个 bug
```

---

## 验证清单

修改记录创建后检查：
- [ ] 包含日期（`YYYY-MM-DD` 格式）
- [ ] 包含模式标签（feat / fix / refactor / test / docs）
- [ ] **修改意图**清楚说明"为什么"
- [ ] 关联了提示词文件路径
- [ ] 列出了具体修改的文件
- [ ] 包含自验证结果（测试通过 + 代码风格检查）

---

**最后更新**：[LAST_UPDATED]
**状态**：生产就绪
