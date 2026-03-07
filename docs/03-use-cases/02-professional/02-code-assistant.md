---
title: 代码助手
description: 使用代码助手智能体进行代码审查、Bug 诊断、重构建议和自动化测试生成。
keywords: [代码助手, 代码审查, Bug 修复, 重构, 测试生成]
---

# 代码助手

## 场景描述

你的同事提交了一段代码准备合并，你需要做 Code Review。或者线上突然报了一个 Bug，日志里只有一行堆栈信息，你需要快速定位问题。

代码助手（Code Assistant）智能体精通多种编程语言，能发现代码中的安全漏洞、性能问题和逻辑错误，还能根据错误日志快速定位 Bug 根因并提供修复方案。

## 推荐智能体

**代码助手** -- 精通 Python、TypeScript、Go、Rust 等主流语言，提供代码审查、重构建议、Bug 诊断一站式服务。

## 完整对话示例

```
你: 帮我审查这段代码，看看有什么问题。

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

代码助手: 发现多处严重问题，请优先修复：

        严重 -- SQL 注入风险
        问题：直接拼接 SQL 字符串，存在 SQL 注入漏洞
        位置：第 2、5、9 行
        修复：使用参数化查询
        const user = await db.query(
          'SELECT * FROM users WHERE id = ?', [userId]
        );

        严重 -- N+1 查询问题
        问题：循环中查询数据库，性能极差
        位置：第 7-11 行
        影响：如果用户有 100 个订单，将执行 102 次查询
        修复：使用 JOIN 查询一次获取所有数据

        警告 -- 缺少类型定义
        问题：函数返回值缺少类型声明

        警告 -- 无错误处理
        问题：数据库查询失败会导致未处理的异常

        代码评分
        安全性：2/10
        性能：3/10
        可维护性：5/10
        综合：3.3/10 -- 不建议合并

        需要我提供完整的修复代码吗？

你: 请提供修复后的完整代码。

代码助手: [生成修复后的完整代码，包含参数化查询、
         JOIN 优化、类型定义和错误处理]
```

## 关键步骤

1. **粘贴代码** -- 提供需要审查或诊断的代码片段
2. **获取审查报告** -- 智能体按严重程度列出所有问题
3. **查看修复方案** -- 每个问题都有具体的修复代码
4. **生成测试** -- 可选择为修复后的代码生成单元测试

## 最终成果

一份详细的代码审查报告，标注了安全漏洞、性能问题和改进建议，附带可直接使用的修复代码。

:::tip 最佳实践
- 提交代码审查时一并说明代码的业务背景（如"这是支付模块的核心逻辑"），智能体会更加注重安全性检查
- 遇到 Bug 时，尽量提供完整的错误日志和相关代码，上下文越完整，定位越准确
- 可以让智能体在审查后自动生成测试用例，确保修复不引入新问题
:::
