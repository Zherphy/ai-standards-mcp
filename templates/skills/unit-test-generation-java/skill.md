# Skill: Java Unit Test Generation (Deep TDD)

## 1. 职责
参考 OM-Webserver 的 Spring Boot 3 + JUnit 5 实践，为 Java 服务生成高质量测试。

## 2. 核心要求
- **Given-When-Then**: 测试用例必须使用此结构。
- **Mocking**: 优先使用 Mockito 隔离外部服务（如 Redis, Authing）。
- **覆盖率**: 强制要求核心业务分支覆盖率达到 90% 以上。

## 3. 跨项目适配
- 如果识别到 `pom.xml`，自动使用 Maven 运行测试。
- 如果识别到 `build.gradle`，自动切换为 Gradle。
