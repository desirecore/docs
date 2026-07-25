---
title: 代码助手
description: 使用代码助手智能体完成需求澄清、架构设计、代码实现、测试和迭代修改。
keywords: [代码助手, 项目开发, 全栈开发, 代码生成, 架构设计]
image: /img/use-cases/covers/cover-code-assistant.jpg
---

# 代码助手

> 周三早上站会，产品经理说"这个功能周五要上线"。你看了看需求文档——接口要新增 3 个，测试要补 20 个用例，还有个没人记得的老模块要改。

## 真实工作流

代码场景的重点不是“描述一句话让 AI 写完整项目”，而是把明确需求落到现有代码库的结构、规范和测试里。

| 维度 | 真实情况 |
|------|----------|
| 触发点 | 新增业务模块、修复缺陷、补测试、迁移脚本、内部工具开发 |
| 现有材料 | 需求说明、现有代码、团队规范、接口约定、数据库结构、测试命令 |
| 卡点 | 代码要符合现有架构，边界条件要补测试，改动不能破坏旧逻辑 |
| DesireCore 介入 | 代码助手先读上下文和规范，再给设计方案、改代码、补测试、运行验证 |
| 验收结果 | 工程师拿到可 review 的 diff、测试结果和需要人工确认的设计点 |

## 使用前后对比

| 环节 | 使用前（人工） | 使用后（DesireCore） |
|------|---------------|---------------------|
| 需求理解 | 反复问产品确认边界条件，沟通 1-2 小时 | 提供需求文档后自动列出待确认点和技术约束 |
| 方案设计 | 翻旧代码理解架构，再画方案 | 读取现有代码结构后给出符合架构的设计建议 |
| 代码实现 | 手写样板代码和 CRUD，重复劳动 | 生成符合规范的实现代码，只需关注核心逻辑 |
| 测试补全 | 赶工期时先跳过测试 | 自动生成边界条件和异常路径的测试用例 |
| Code Review | 等同事有空 review，阻塞 1-2 天 | 先做自动审查，标出潜在问题，减少人工 review 轮次 |

## 推荐智能体

**代码助手** -- 适合处理架构设计、代码实现、重构、测试补充、错误排查和部署脚本等研发任务。

## 前期教学：让智能体掌握你的技术栈和规范

> 先教清楚技术栈、目录结构、代码风格和测试要求，后续生成的代码才更接近团队规范。

### 教规则

```
你: 教你我们团队的技术栈和开发规范：
    [上传 team-dev-guide.md]
    重点几条：
    1. 后端用 Python + FastAPI，数据库用 PostgreSQL + SQLAlchemy（强制）
    2. 前端用 React + TypeScript + TailwindCSS（强制）
    3. 项目结构：按功能模块划分，不要按技术层划分
       比如 modules/user/、modules/order/，每个模块自带 router、service、model（强制）
    4. API 统一返回格式：{"code": 0, "data": {}, "message": "ok"}（强制）
    5. 所有函数都要加类型注解，Python 用 type hints，前端用 TypeScript strict mode（偏好）

代码助手: 📝 学到了新内容
          来源：team-dev-guide.md + 本次补充说明
          类型：规则（技术栈与开发规范）
          层级：强制 × 4 项，偏好 × 1 项

          我的理解：
          后端 FastAPI + PostgreSQL + SQLAlchemy，前端 React + TS + Tailwind。
          项目按功能模块组织（modules/xxx/），每个模块包含 router、service、
          model。API 统一响应格式 {"code", "data", "message"}。全面使用
          类型注解。

          [✓ 正确]  [✎ 修改]  [✗ 撤销]

你: [✓ 正确]
```

### 给示例

```
你: 给你看我们现有的用户模块代码结构，新功能照这个模式来。
    [粘贴 modules/user/ 目录下的 router.py、service.py、model.py 示例]

代码助手: 📝 学到了新内容
          类型：示例（模块代码结构）
          Router 层只做路由和参数校验，业务逻辑全部在 Service 层，
          Model 层用 SQLAlchemy 声明式基类。Service 之间通过依赖注入互相调用。

          [✓ 正确]  [✎ 修改]  [✗ 撤销]

你: [✓ 正确]
```

教学完成后，代码助手已掌握你的技术栈和项目规范。之后描述需求时，它会按这套规范生成方案和代码变更。

## 完整对话示例

```
你: 我需要开发一个"优惠券系统"，支持创建优惠券、用户领取、
    下单时核销。先帮我做架构设计。

代码助手: 好的，我来为优惠券系统做架构设计。

        模块结构（按你的项目规范）
        modules/coupon/
        ├── router.py      # API 路由：创建、领取、核销、查询
        ├── service.py     # 业务逻辑：库存控制、使用规则校验
        ├── model.py       # 数据模型：Coupon、UserCoupon
        ├── schema.py      # Pydantic 请求/响应模型
        └── tests/
            ├── test_service.py
            └── test_router.py

        数据库设计
        coupons 表：id, name, type(满减/折扣/立减), threshold,
                    discount, total_qty, used_qty, start_time,
                    end_time, status
        user_coupons 表：id, user_id, coupon_id, status(未使用/
                        已使用/已过期), received_at, used_at

        核心 API
        POST   /api/coupons          创建优惠券（管理端）
        GET    /api/coupons          查询优惠券列表
        POST   /api/coupons/{id}/claim  用户领取
        POST   /api/coupons/verify    下单时核销
        GET    /api/users/me/coupons  查看我的优惠券

        需要注意的设计点
        1. 领取时要加分布式锁，防止超领
        2. 核销要在订单事务里，支付失败自动退回
        3. 过期优惠券用定时任务批量更新状态

        确认后我开始写代码？

你: 设计没问题，先写后端的 model 和 service。

代码助手: 已生成以下文件：

        modules/coupon/model.py（数据模型）
        - Coupon 模型：包含类型枚举、库存字段、时间范围
        - UserCoupon 模型：关联用户和优惠券，记录状态变更

        modules/coupon/service.py（核心业务逻辑）
        - create_coupon()：创建优惠券，校验参数合理性
        - claim_coupon()：领取优惠券，带 SELECT FOR UPDATE 防超领
        - verify_coupon()：核销优惠券，校验使用条件（满减门槛、
          有效期、是否已用）
        - expire_coupons()：批量过期处理

        modules/coupon/schema.py（请求/响应模型）
        - CouponCreate、CouponResponse、ClaimResponse、VerifyRequest

        所有代码已按你的规范：
        ✓ FastAPI + SQLAlchemy
        ✓ 模块化结构
        ✓ 完整类型注解
        ✓ 统一返回格式 {"code", "data", "message"}

        需要我继续写 router 和测试吗？

你: 继续，router 和测试一起写。

代码助手: 已生成：

        modules/coupon/router.py
        - 5 个 API 端点，参数校验用 Pydantic
        - 依赖注入 CouponService
        - 统一异常处理

        modules/coupon/tests/test_service.py
        - test_create_coupon_success
        - test_claim_coupon_stock_limit（测试库存边界）
        - test_verify_coupon_expired（测试过期券核销）
        - test_verify_coupon_threshold（测试满减门槛）
        共 8 个测试用例，覆盖率 92%

        modules/coupon/tests/test_router.py
        - API 集成测试，使用 TestClient
        共 5 个测试用例

        运行测试结果：13 passed, 0 failed ✅

        📋 回执摘要
        引用的规则：FastAPI 技术栈 · 模块化结构 · 统一返回格式 · 类型注解
        引用的示例：用户模块代码结构
        均来自你的教学（上周）✓
```

## 关键步骤

1. **锁定需求边界** -- 明确用户故事、接口范围、数据模型、权限规则和不做什么
2. **读取现有上下文** -- 让代码助手先看目录结构、相邻模块、测试方式和团队规范
3. **先出设计再改代码** -- 确认数据表、API、服务边界、异常处理和兼容性方案
4. **分小步实现** -- 按 model、service、router、测试等拆成可 review 的小变更
5. **运行验证闭环** -- 执行测试、lint、构建或本地启动，把失败原因和修复过程留下来

## 最终成果

一套可审阅的功能模块代码，通常包含数据模型、业务逻辑、API 路由和测试用例。合入前仍建议做代码审查、测试运行和安全检查。

## 会用到的 DesireCore 能力

- **本地文件系统读写**：直接在你的工作区读取项目结构、修改文件、保留 diff
- **命令执行与测试验证**：运行测试、构建、lint，把失败原因和修复过程记录下来
- **AgentFS 记忆**：团队技术栈、目录结构、代码风格和测试命令可以沉淀为长期规则

:::tip 最佳实践
- 先教会代码助手你的技术栈和项目结构，减少后续返工
- 开发新功能时先让它做架构设计，确认后再写代码，避免方向走偏后返工
- 遇到不熟悉的技术（比如 WebSocket、消息队列），直接告诉代码助手业务需求，它会选择合适的技术方案并实现
- 多个功能并行开发时，先明确优先级和依赖关系，再让代码助手分别生成方案和变更
- 不要一次让它“做完整项目”。真实开发更适合小步提交、测试验证和代码审查
:::
