---
title: Code Assistant
description: Use the Code Assistant agent for requirements clarification, architecture design, code implementation, testing, and iterative modifications.
keywords: [Code Assistant, Project Development, Full-Stack Development, Code Generation, Architecture Design]
---

# Code Assistant

## Real Workflow

The focus of coding scenarios is not "describe one sentence and let AI build the entire project" — it's about translating clear requirements into changes that fit the existing codebase's structure, standards, and tests.

| Dimension | Real Situation |
|-----------|----------------|
| Trigger Point | New business modules, bug fixes, test coverage, migration scripts, internal tool development |
| Existing Materials | Requirements spec, existing code, team standards, API contracts, database schema, test commands |
| Pain Point | Code must follow existing architecture, edge cases need tests, changes must not break existing logic |
| DesireCore Intervention | Code Assistant reads context and standards first, then proposes design, writes code, adds tests, and runs verification |
| Acceptance Result | Engineer receives reviewable diffs, test results, and design decisions that need human confirmation |

## Recommended Agent

**Code Assistant** — Suited for architecture design, code implementation, refactoring, test coverage, debugging, and deployment scripts.

## Teaching First: Teaching the Agent Your Tech Stack and Standards

> Teach your tech stack, directory structure, code style, and test requirements first — the generated code will then be much closer to team standards.

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

Once teaching is complete, the Code Assistant knows your tech stack and project conventions. From now on, describe what you need and it will generate designs and code changes according to these standards.

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

1. **Lock Down Requirement Boundaries** — Clarify user stories, API scope, data model, permission rules, and what NOT to do
2. **Read Existing Context** — Have the Code Assistant review directory structure, adjacent modules, test patterns, and team standards first
3. **Design Before Coding** — Confirm database tables, API contracts, service boundaries, error handling, and compatibility plans before writing code
4. **Implement in Small Steps** — Split into model, service, router, tests as reviewable small changes
5. **Run Verification Loop** — Execute tests, lint, build, or local startup; preserve failure logs and fix history

## Final Deliverable

A reviewable set of feature module code, typically including data models, business logic, API routes, and test cases. Code review, test execution, and security checks are still recommended before merging.

## DesireCore Capabilities Used

- **Local File System Read/Write**: Directly read project structure, modify files, and preserve diffs in your workspace
- **Command Execution & Test Verification**: Run tests, builds, lint; preserve failure logs and fix history
- **AgentFS Memory**: Team tech stack, directory structure, code style, and test commands can be persisted as long-term rules

:::tip Best Practices
- Teach the Code Assistant your tech stack and project structure first — that way generated code will be much closer to team standards
- When developing new features, have it do architecture design first, confirm, then write code — avoids costly rework from going in the wrong direction
- For unfamiliar tech (e.g., WebSocket, message queues), just describe the business requirement and the Code Assistant will choose the right technical approach and implement it
- When multiple features are developed in parallel, first clarify priorities and dependencies, then have the Code Assistant generate designs and changes separately
- Don't ask it to "build the entire project at once." Real development works better with small commits, test verification, and code review
:::
