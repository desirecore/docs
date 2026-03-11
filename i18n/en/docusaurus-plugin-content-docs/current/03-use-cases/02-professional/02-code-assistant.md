---
title: Code Assistant
description: Use the Code Assistant agent to build complete projects through conversation, from architecture design to code implementation, testing, and deployment.
keywords: [Code Assistant, Project Development, Full-Stack Development, Code Generation, Architecture Design]
---

# Code Assistant

## Scenario Description

You have a new project to build — maybe an internal tool, an API service, or a mini-program. The traditional way requires writing every line from scratch, and if you're unfamiliar with the tech stack, you're constantly switching between docs and code.

The Code Assistant agent can help you build entire projects through conversation: describe your requirements, and it designs the architecture; confirm the plan, and it writes the code; report issues, and it iterates. It's like pair programming with a full-stack engineer.

## Recommended Agent

**Code Assistant** -- Proficient in Python, TypeScript, Go, Rust, and other mainstream languages, capable of handling the full development lifecycle from architecture design to code implementation, testing, and deployment.

## Teaching First: Setting Your Tech Stack and Standards

> Teach your project conventions once, and every feature it builds will follow your tech stack and team practices — no matter what you're developing.

### Teach Rules

```
You: Let me teach you our team's tech stack and development standards:
     [Upload team-dev-guide.md]
     Key points:
     1. Backend: Python + FastAPI, database: PostgreSQL + SQLAlchemy (mandatory)
     2. Frontend: React + TypeScript + TailwindCSS (mandatory)
     3. Project structure: organize by feature module, not by technical layer
        e.g., modules/user/, modules/order/, each module has its own router, service, model (mandatory)
     4. Unified API response format: {"code": 0, "data": {}, "message": "ok"} (mandatory)
     5. All functions must have type annotations — Python type hints, frontend TypeScript strict mode (preference)

Code Assistant: 📝 New learning recorded
               Source: team-dev-guide.md + supplementary notes
               Type: Rule (Tech stack and development standards)
               Level: Mandatory × 4, Preference × 1

               My understanding:
               Backend: FastAPI + PostgreSQL + SQLAlchemy. Frontend: React + TS +
               Tailwind. Project organized by feature modules (modules/xxx/), each
               containing router, service, model. Unified API response format
               {"code", "data", "message"}. Full type annotations throughout.

               [✓ Correct]  [✎ Modify]  [✗ Undo]

You: [✓ Correct]
```

### Provide Examples

```
You: Here's our existing user module code structure. Follow this pattern for new features.
     [Paste modules/user/ directory: router.py, service.py, model.py examples]

Code Assistant: 📝 New learning recorded
               Type: Example (Module code structure)
               Router layer handles routing and parameter validation only. All business
               logic lives in the Service layer. Model layer uses SQLAlchemy declarative
               base. Services call each other through dependency injection.

               [✓ Correct]  [✎ Modify]  [✗ Undo]

You: [✓ Correct]
```

Once teaching is complete, the Code Assistant knows your tech stack and project conventions. From now on, just describe what you need and it will write code that fits your team's style.

## Complete Conversation Example

```
You: I need to build a "coupon system" — create coupons, let users claim them,
     and redeem at checkout. Start with the architecture design.

Code Assistant: Got it. Let me design the architecture for the coupon system.

        Module Structure (following your project conventions)
        modules/coupon/
        ├── router.py      # API routes: create, claim, redeem, query
        ├── service.py     # Business logic: inventory control, rule validation
        ├── model.py       # Data models: Coupon, UserCoupon
        ├── schema.py      # Pydantic request/response models
        └── tests/
            ├── test_service.py
            └── test_router.py

        Database Design
        coupons table: id, name, type (fixed_amount/percentage/flat_off),
                       threshold, discount, total_qty, used_qty,
                       start_time, end_time, status
        user_coupons table: id, user_id, coupon_id, status (unused/
                           used/expired), received_at, used_at

        Core APIs
        POST   /api/coupons             Create coupon (admin)
        GET    /api/coupons             List coupons
        POST   /api/coupons/{id}/claim  User claims coupon
        POST   /api/coupons/verify      Redeem at checkout
        GET    /api/users/me/coupons    View my coupons

        Key Design Considerations
        1. Add distributed lock on claim to prevent over-issuing
        2. Redemption must be within the order transaction — auto-refund on payment failure
        3. Expired coupons handled by scheduled batch job

        Shall I proceed with the code?

You: Design looks good. Start with the backend model and service.

Code Assistant: Generated the following files:

        modules/coupon/model.py (Data Models)
        - Coupon model: type enum, inventory fields, time range
        - UserCoupon model: links users to coupons, tracks status changes

        modules/coupon/service.py (Core Business Logic)
        - create_coupon(): create coupon with parameter validation
        - claim_coupon(): claim with SELECT FOR UPDATE to prevent over-issuing
        - verify_coupon(): redeem with rule checks (minimum spend threshold,
          validity period, already-used check)
        - expire_coupons(): batch expiration processing

        modules/coupon/schema.py (Request/Response Models)
        - CouponCreate, CouponResponse, ClaimResponse, VerifyRequest

        All code follows your standards:
        ✓ FastAPI + SQLAlchemy
        ✓ Modular structure
        ✓ Full type annotations
        ✓ Unified response format {"code", "data", "message"}

        Want me to continue with the router and tests?

You: Yes, write the router and tests together.

Code Assistant: Generated:

        modules/coupon/router.py
        - 5 API endpoints with Pydantic parameter validation
        - CouponService injected via dependency injection
        - Unified exception handling

        modules/coupon/tests/test_service.py
        - test_create_coupon_success
        - test_claim_coupon_stock_limit (inventory boundary test)
        - test_verify_coupon_expired (expired coupon redemption test)
        - test_verify_coupon_threshold (minimum spend threshold test)
        8 test cases total, 92% coverage

        modules/coupon/tests/test_router.py
        - API integration tests using TestClient
        5 test cases total

        Test results: 13 passed, 0 failed ✅

        📋 Receipt Summary
        Rules applied: FastAPI tech stack · Modular structure · Unified response format · Type annotations
        Example referenced: User module code structure
        All from your teaching (last week) ✓
```

## Key Steps

1. **Describe Requirements** -- Tell the agent what feature you need in natural language
2. **Confirm Architecture** -- The agent generates an architecture design for your review
3. **Iterative Development** -- The agent generates code module by module, you confirm step by step
4. **Test and Verify** -- The agent auto-generates tests and runs them to ensure code quality

## Final Deliverable

A complete feature module with data models, business logic, API routes, and test cases — all following your team's conventions, ready to integrate into your project.

:::tip Best Practices
- Teach the Code Assistant your tech stack and project structure first — that way the code it writes can be used directly without major refactoring
- When building new features, have it design the architecture first, confirm, then write code — avoids costly rework from going in the wrong direction
- For unfamiliar tech (e.g., WebSocket, message queues), just describe the business requirement and the Code Assistant will choose the right technical approach and implement it
- **Develop multiple features in parallel**: When you have several features to build, describe them all at once — the Code Assistant will generate architecture designs and code for each in parallel, all following the same standards you taught it
:::
