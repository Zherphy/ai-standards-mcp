---
id: code-style-constraints
name: 代码风格与安全约束
description: 项目代码风格和安全约束规范，定义编码标准、安全最佳实践和开发约束（通用版，部署时按项目定制）
version: 1.0.0
license: MIT
author: AI Assistant
namespace: universal.governance
keywords:
  - code-style
  - security
  - constraints
  - governance
  - quality
categories:
  - governance
  - quality-assurance
modes:
  - code
  - orchestrator
tags:
  - code-style
  - security
  - naming-convention
priority: 15
enabled: true
allowed-tools:
  - read
  - write
  - edit
dependencies:
  skills:
    - workflow-enforcer
---

# 代码风格与安全约束

## 📋 技能描述

本技能定义项目的代码风格规范和安全约束，确保 AI Agent 生成的代码符合项目标准。

> **注意**：本文件为通用版本模板。部署到具体项目时，请将 `[PLACEHOLDER]` 替换为项目实际值，并将此技能重命名为符合项目的名称（如 `my-project-code-style`）。

---

## 1. 命名约定

### 类名（PascalCase）
```
✅ UserService / OrderController / PaymentDao
❌ userService / order_controller / payment_dao
```

### 方法名（camelCase）
```
✅ getUserById() / createOrder() / validateToken()
❌ GetUserById() / create_order() / ValidateToken()
```

### 常量（UPPER_SNAKE_CASE）
```
✅ MAX_RETRY_COUNT / DEFAULT_TIMEOUT_MS
❌ maxRetryCount / defaultTimeoutMs
```

### 包名（全小写，点分隔）
```
✅ [BASE_PACKAGE].controller / [BASE_PACKAGE].service.impl
❌ [BASE_PACKAGE].Controller / [BASE_PACKAGE].ServiceImpl
```

---

## 2. 代码格式要求

### 缩进与格式
- 使用 4 个空格缩进（不使用 Tab）
- 行长度不超过 120 字符
- 每个文件末尾保留一个空行

### 方法复杂度
- 单个方法不超过 30 行（建议值）
- 方法圈复杂度不超过 10
- 嵌套层级不超过 4 层

### 代码工具配置
```bash
# 运行代码风格检查
[LINT_CMD]

# 运行完整质量验证
[VERIFY_CMD]
```

---

## 3. 安全约束

### 3.1 敏感信息处理

**禁止**在代码中硬编码以下信息：
- API 密钥、Token、密码
- 数据库连接字符串
- 私钥、证书内容

**正确做法**：通过配置文件或环境变量注入
```
✅ @Value("${api.key}") private String apiKey;
❌ private String apiKey = "sk-abc123xyz";
```

### 3.2 输入验证

所有外部输入必须在 Controller 层验证：
```
✅ 使用 @Valid + Bean Validation 注解
✅ 验证参数长度、格式、范围
❌ 直接将用户输入传递给数据库查询或系统命令
```

### 3.3 异常处理

使用标准响应包装器处理异常：
```
✅ return Result.failed("错误描述") 或抛出自定义业务异常
❌ 将异常堆栈直接返回给客户端
❌ 捕获异常后静默忽略（catch(Exception e) {}）
```

### 3.4 日志记录

```
✅ 记录关键业务操作和安全事件
✅ 脱敏处理后记录用户数据（隐藏手机号中间几位等）
❌ 在日志中记录密码、Token 等敏感信息
```

---

## 4. 架构规则

### 4.1 分层架构（严格执行）

```
Controller → Service → DAO → External Service
```

**约束**：
- Controller 不可直接调用 DAO
- Service 不可依赖 Controller
- DAO 只封装外部 API 调用，不含业务逻辑

### 4.2 依赖注入

**强制使用构造函数注入**：
```java
// ✅ 正确：构造函数注入
public class UserService {
    private final UserDao userDao;

    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }
}

// ❌ 错误：字段注入
public class UserService {
    @Autowired
    private UserDao userDao;
}
```

### 4.3 接口设计

对于服务层，建议定义接口后再实现：
```
✅ 接口：UserService（在 service/inter/ 目录）
✅ 实现：UserServiceImpl（在 service/ 目录）
```

---

## 5. TDD 约束

- **禁止**：在没有对应测试的情况下提交业务逻辑代码
- **要求**：核心业务逻辑测试覆盖率 ≥ 90%
- **要求**：整体测试覆盖率 ≥ 80%
- **格式**：测试使用 Given-When-Then 模式

---

## 6. 常见违规示例与修复

### 违规示例 1：Controller 直接调用 DAO
```java
// ❌ 错误
@RestController
public class UserController {
    @Autowired
    private UserDao userDao; // 直接依赖 DAO

    @GetMapping("/user/{id}")
    public User getUser(@PathVariable String id) {
        return userDao.findById(id); // 跳过 Service 层
    }
}

// ✅ 正确
@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user/{id}")
    public Result<User> getUser(@PathVariable String id) {
        return Result.success(userService.getUserById(id));
    }
}
```

### 违规示例 2：硬编码敏感信息
```java
// ❌ 错误
private static final String API_KEY = "sk-abc123xyz456";

// ✅ 正确
@Value("${external.api.key}")
private String apiKey;
```

---

**版本**：1.0.0
**状态**：生产就绪（需按项目定制）
