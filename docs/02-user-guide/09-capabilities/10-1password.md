---
title: 连接 1Password
description: 使用只读 Service Account 将专用 1Password 保险库接入 DesireCore。
---

# 连接 1Password

连接 1Password 后，可以在 DesireCore 中关联保险库条目，并为每条凭据设置智能体的取用授权。关联会保存条目名称和字段等信息，授权通过后才按需从 1Password 读取值。

开始前，在运行 DesireCore 服务的设备上安装 [1Password CLI](https://www.1password.dev/cli/get-started) 2.18.0 或更高版本，并确认你有权限在 1Password 创建服务帐户。准备一个专用保险库，只放需要提供给 DesireCore 的条目。截图中的 `DesireCore-Verify` 是示例保险库。

## 在 1Password 创建只读服务帐户

1. 登录 1Password 网页版，打开 **开发者 → 新服务帐户**。输入一个便于识别的名称，点击 **下一步**。也可直接使用 [1Password 服务帐户创建向导](https://start.1password.com/developer-tools/infrastructure-secrets/serviceaccount/?source=dev-portal)。

   ![填写服务帐户名称](/img/user-guide/1password/1password-service-account-name.jpg)

2. 在 **保险库访问** 中只勾选专用保险库。保持 **允许创建新保险库** 关闭。点击该保险库右侧的齿轮，确认仅 **读取项目** 被勾选。写入和共享权限保持关闭。

   ![专用保险库已勾选，访问权限为读取](/img/user-guide/1password/1password-service-account-vault.jpg)

   ![权限菜单中仅读取项目被勾选](/img/user-guide/1password/1password-service-account-permissions.jpg)

3. 点击 **下一步**。在 **环境访问** 中保持所有环境未选中，再点击 **创建帐户**。权限在创建后固定，修改范围时需要创建新的服务帐户。

   ![环境访问页面显示未授权任何环境](/img/user-guide/1password/1password-service-account-environment.jpg)

4. 创建后复制服务帐户令牌。页面只显示一次令牌，请把它当作密码保管。 [1Password 服务帐户说明](https://www.1password.dev/service-accounts/get-started)

## 在 DesireCore 连接并关联条目

1. 打开 **资源管理器 → 账号**，在凭据源中选择 **1Password**。
2. 在 **连接 1Password** 表单粘贴服务帐户令牌，输入专用保险库的准确名称，再点击 **连接**。
3. 看到 **连接正常** 后，浏览保险库条目，对需要使用的条目点击 **关联**。在账号详情中，核对条目的取用授权，按需设置为询问、允许或拒绝。

如果连接提示保险库不在授权范围，先检查名称是否与 1Password 完全一致，再核对创建时选中的保险库。如果令牌已失效，请创建新的只读服务帐户并使用新的令牌连接。

停止使用时，在 DesireCore 选择 **断开连接**，并在 1Password 网页撤销对应服务帐户。断开后智能体无法再读取关联条目，DesireCore 会保留条目的授权记录。
