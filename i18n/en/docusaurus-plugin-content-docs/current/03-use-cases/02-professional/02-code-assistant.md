---
title: Code Assistant
description: Use the Code Assistant agent for code review, bug diagnosis, refactoring suggestions, and automated test generation.
keywords: [Code Assistant, Code Review, Bug Fixing, Refactoring, Test Generation]
---

# Code Assistant

## Scenario Description

Your colleague submitted some code ready to merge, and you need to do a Code Review. Or a bug suddenly appeared online with only one line of stack trace in the log, and you need to quickly locate the problem.

The Code Assistant agent is proficient in multiple programming languages, can discover security vulnerabilities, performance issues, and logic errors in code, and can quickly locate the root cause of bugs based on error logs and provide fixes.

## Recommended Agent

**Code Assistant** -- Proficient in mainstream languages including Python, TypeScript, Go, and Rust, providing one-stop service for code review, refactoring suggestions, and bug diagnosis.

## Complete Conversation Example

```
You: Help me review this code and see if there are any issues.

    async function getUserData(userId: string) {
      const user = await db.query(
        `SELECT * FROM users WHERE id = ${userId}`
      );
      const orders = await db.query(
        'SELECT * FROM orders WHERE user_id = ' + userId
      );
      for (let order of orders) {
        const items = await db.query(
          `SELECT * FROM items WHERE order_id = ${order.id}`
        );
        order.items = items;
      }
      return { user, orders };
    }

Code Assistant: Found multiple serious issues, please prioritize fixes:

        Critical -- SQL Injection Risk
        Issue: Direct SQL string concatenation, SQL injection vulnerability present
        Location: Lines 2, 5, 9
        Fix: Use parameterized queries
        const user = await db.query(
          'SELECT * FROM users WHERE id = ?', [userId]
        );

        Critical -- N+1 Query Problem
        Issue: Querying database in loop, extremely poor performance
        Location: Lines 7-11
        Impact: If user has 100 orders, will execute 102 queries
        Fix: Use JOIN query to get all data at once

        Warning -- Missing Type Definition
        Issue: Function return value missing type declaration

        Warning -- No Error Handling
        Issue: Database query failures will cause unhandled exceptions

        Code Score
        Security: 2/10
        Performance: 3/10
        Maintainability: 5/10
        Overall: 3.3/10 -- Not recommended for merge

        Need me to provide the complete fixed code?

You: Please provide the complete fixed code.

Code Assistant: [Generates complete fixed code with parameterized queries,
         JOIN optimization, type definitions, and error handling]
```

## Key Steps

1. **Paste Code** -- Provide the code snippet needing review or diagnosis
2. **Get Review Report** -- The agent lists all issues by severity
3. **View Fix Solutions** -- Each issue has specific fix code
4. **Generate Tests** -- Optionally generate unit tests for the fixed code

## Final Deliverable

A detailed code review report, flagging security vulnerabilities, performance issues, and improvement suggestions, with ready-to-use fix code.

:::tip Best Practices
- When submitting code for review, also explain the business context (e.g., "this is the core logic of the payment module"), and the agent will pay more attention to security checks
- When encountering bugs, try to provide complete error logs and relevant code; the more complete the context, the more accurate the location
- You can have the agent automatically generate test cases after review to ensure fixes don't introduce new issues
:::
