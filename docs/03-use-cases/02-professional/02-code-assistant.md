---
title: 代码助手
description: 使用代码助手智能体通过对话完成完整项目开发，从架构设计到代码实现、测试和部署。
keywords: [代码助手, 项目开发, 全栈开发, 代码生成, 架构设计]
---

# 代码助手

## 场景描述

你有一个新项目需要开发——比如一个内部工具、一个 API 服务、或者一个小程序。传统方式需要你从零开始写每一行代码，遇到不熟悉的技术栈还得边查文档边摸索。

代码助手（Code Assistant）智能体可以通过对话帮你完成整个项目的开发：你描述需求，它做架构设计；你确认方案，它写代码实现；你反馈问题，它迭代修改。就像和一个全栈工程师搭档结对编程。

## 推荐智能体

**代码助手** -- 精通 Python、TypeScript、Go、Rust 等主流语言，能完成从架构设计、代码实现到测试部署的全流程开发。

## 前期教学：让智能体掌握你的技术栈和规范

> 教一次你的项目规范，之后不管开发什么功能，它写出来的代码都符合你的技术栈和团队习惯。

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

教学完成后，代码助手已掌握你的技术栈和项目规范。之后直接描述需求，它就能写出符合你团队风格的代码。

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

1. **描述需求** -- 用自然语言说明你要开发什么功能
2. **确认架构** -- 智能体生成架构设计，你确认或调整
3. **迭代开发** -- 智能体按模块生成代码，你逐步确认
4. **测试验证** -- 智能体自动生成测试并运行，确保代码质量

## 最终成果

一套完整的功能模块代码，包含数据模型、业务逻辑、API 路由和测试用例，符合你的团队规范，可以直接集成到项目中。

:::tip 最佳实践
- 先教会代码助手你的技术栈和项目结构，它写出来的代码才能直接用，不需要大幅改动
- 开发新功能时先让它做架构设计，确认后再写代码，避免方向走偏后返工
- 遇到不熟悉的技术（比如 WebSocket、消息队列），直接告诉代码助手业务需求，它会选择合适的技术方案并实现
- **并行开发多个功能**：同时有多个功能要开发时，一次告诉代码助手，它会并行为每个功能生成架构设计和代码，全部遵循你教过的同一套规范
:::
