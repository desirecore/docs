---
title: Connect 1Password
description: Connect a dedicated 1Password vault to DesireCore with a read-only service account.
---

# Connect 1Password

Connect 1Password to link vault items in DesireCore and set an access grant for each credential. Linking saves item details such as names and fields. DesireCore fetches values from 1Password when needed after access is granted.

Install [1Password CLI](https://www.1password.dev/cli/get-started) 2.18.0 or later on the device running the DesireCore service. You also need permission to create 1Password service accounts. Prepare a dedicated vault containing the items you want to make available to DesireCore. The screenshots show the example vault `DesireCore-Verify` in the Chinese interface.

## Create a read-only service account in 1Password

1. Sign in to 1Password in your browser and open **Developer → New Service Account**. Enter a recognizable name and select **Next**. You can also open the [1Password service account wizard](https://start.1password.com/developer-tools/infrastructure-secrets/serviceaccount/?source=dev-portal) directly.

   ![Entering a name for the service account](/img/user-guide/1password/1password-service-account-name.jpg)

2. Under **Vault Access**, select only your dedicated vault. Leave the option to create new vaults off. Select the gear next to your vault and confirm that only **Read items** is checked. Leave write and share permissions off.

   ![The dedicated vault is selected with read access](/img/user-guide/1password/1password-service-account-vault.jpg)

   ![Only Read items is checked in the permissions menu](/img/user-guide/1password/1password-service-account-permissions.jpg)

3. Select **Next**. Under **Environment Access**, leave all environments unselected, then select **Create Account**. Permissions are fixed at creation. Create a new service account if you need a different scope.

   ![The Environment Access page shows that no environments are granted](/img/user-guide/1password/1password-service-account-environment.jpg)

4. Copy the service account token after creation. The page shows the token once. Treat it as you would a password. [1Password service account guide](https://www.1password.dev/service-accounts/get-started)

## Connect in DesireCore and link items

1. Open **Resource Manager → Accounts** in DesireCore and select **1Password** among the credential sources.
2. In **Connect 1Password**, paste the service account token, enter the exact name of your dedicated vault, and select **Connect**.
3. Once the source shows **Connected**, browse the vault and select **Link** for the items you want to use. In each account's details, review its access grant and choose whether to prompt, allow, or deny access.

If DesireCore reports that the vault is outside the authorized scope, check that its name matches 1Password exactly and confirm that the service account was created with access to that vault. If the token has expired or been revoked, create a new read-only service account and connect with the new token.

To stop using the connection, select **Disconnect** in DesireCore and revoke the service account in 1Password. Disconnecting stops access to linked items. DesireCore retains their grant records.
