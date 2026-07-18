---
sidebar_position: 4
---

# Privacy Policy

Last Updated: July 16, 2026

## 1. Data Collection Scope

DesireCore follows a "local-first" data-storage principle. Data processed by the app may include account information (such as username and email), user-created agent configurations, conversation history, generated files, and app-usage statistics. Except for the connected scenarios described below, core data is stored on the user's local device by default.

Except for necessary account verification and software update checks, all core data is stored locally on the user's device by default. We will not upload user data to the cloud without explicit consent.

To improve the product and track installation counts, DesireCore sends anonymous installation statistics to our update server on each launch. This information only includes: an anonymous device identifier generated from hardware information (SHA-256 hash, irreversible), client version number, operating system platform, and CPU architecture. We do not collect any personally identifiable information, and this device identifier cannot be associated with your personal identity. This data is used solely for counting unique installations and platform distribution.

We do not proactively collect or review agent content that remains only on the local device. When a user chooses to use account services, update checks, remote connections, third-party models, or other connected features, the data required to provide that feature is sent to the relevant service. Users should review the transmission scope and provider policies before use.

## 2. AgentFS Privacy Architecture

DesireCore uses the self-developed AgentFS file system architecture to ensure complete isolation and privacy protection of user data.

User profile data is stored in independent user domains under `users/<user_id>/`, with each user's data completely isolated from other users. Relationship data (such as interaction patterns between AI assistants and users) belongs to the user domain and is not shared with "companions" (i.e., other AI assistants or users).

This architecture provides logical isolation between user domains and agent workspaces. By default, an agent may access local files to carry out delegated tasks, while sensitive paths (such as SSH private keys and `.env` credential files) always remain blocked by system controls and write operations still go through tool approval; you can also enable "restrict to work directories" in an agent's configuration to confine that agent's file access to its authorized workspace. When explicitly requested by the user and approved, an agent may perform audited cross-agent AgentFS operations. This isolation should not be treated as an absolute physical-security boundary if device-account or filesystem permissions are bypassed, or when the user authorizes export or cross-domain operations.

## 3. Local Storage Principle

By default, all user data is stored only on the local device. This includes: conversation records, AI assistant configurations, user preference settings, and generated files.

The baseline protection for local data comes from the operating-system account, file permissions, and device security settings. DesireCore restricts Agents from directly reading the local secrets store. Users should still enable full-disk encryption, screen lock, and account access controls, and should protect devices and backup media.

An in-app regular backup does not directly include the original local secrets store and should not be understood as a package that is encrypted in its entirety. With **Migrate to New Device**, users may explicitly place eligible user-managed compute API keys into a separate encrypted payload. A migration passphrase is processed with scrypt, and the payload is authenticated and encrypted with AES-256-GCM. Account sessions, official cloud credentials, and credentials managed by OAuth, a CLI, or another external sign-in flow are outside this scope.

DesireCore does not save or recover the migration passphrase. Even when a migration package contains encrypted keys, users should store the package separately from the passphrase, restrict access, and avoid importing files from an untrusted source or with questionable integrity. A raw copy of the local data directory is different from in-app export and may also copy the local secrets store; users must protect such copies as sensitive credential data.

## 4. Data Security

We adopt multi-layer security measures to protect DesireCore application user data:

- Transmission Security: DesireCore uses HTTPS/TLS when connecting to supported online services and third-party APIs; final transport security also depends on endpoints configured by the user
- Storage Security: Local data is protected by operating-system account and file permissions; optional migrated compute API keys use a separate AES-256-GCM encrypted payload
- Access Control: Users should protect local data with OS screen lock, account permissions, full-disk encryption, and backup access controls
- Code Security: Publicly released source code and third-party components may be reviewed under their respective licenses

While we are committed to protecting data security, no system is absolutely secure. Users should take reasonable measures to protect their devices and account credentials.

It should be specifically noted that: we cannot perform any security monitoring or content review on user-created agents and their interactions with third-party APIs. Data transmitted by users through agents to third-party services is outside our control or protection scope, and related security responsibilities are shared between the user and the third-party service provider.

## 5. User Rights

Users have complete control over their data:

- Right to Access: Users can view all their stored data at any time
- Right to Export: Supports exporting data in portable format for backup or migration
- Right to Deletion: Users can permanently delete their account and all related data
- Right to Correction: Users can modify their personal profile and preference settings at any time
- Right to Restrict Processing: Users can choose to disable specific data collection features (such as usage statistics)

## 6. User-Created Agents

DesireCore allows users to create and configure personalized AI agents. These agents are entirely defined by users in terms of behavior, personality traits, and functional settings.

We cannot regulate user-created agents or their use. All behaviors, content, and interactions generated by user-created agents are controlled and responsible by the user. Users should ensure that their created agents and usage behavior comply with applicable laws and regulations, and do not generate or disseminate any illegal, harmful, or infringing content.

Users bear full responsibility for their created agents, including but not limited to: agent behavior settings, generated content, and interactions with other users or systems. We do not assume any direct or indirect liability arising from user-created agents.

## 7. Third-Party API Configuration

DesireCore can connect to third-party AI services, including user-configured APIs, supported cloud services, and account connection methods. Some connections may use a provider's official SDK, but use of an official SDK does not mean that the provider has authorized DesireCore for every account type, credential, or usage scenario.

When users configure and use a third-party service, prompts, context, attachments, tool results, account identifiers, and diagnostic information needed to generate a response or perform a task may be transmitted to servers selected by the user or required by the feature. The exact data depends on the user's actions, model provider, and enabled features. Data received by a third party is governed by that provider's privacy policy and service terms.

Before connecting any third-party service, users should read and understand the provider's privacy policy and service terms, confirm that their account, subscription, and credentials are permitted for that connection method, and protect API keys, login tokens, and other credentials.

## 8. Data Retention

User data is retained only while the user has an active account. After a user deletes their account, all related data will be permanently deleted from our systems within 30 days (subject to technical and legal requirements).

Locally stored data retention is entirely controlled by the user. Uninstalling the app does not automatically delete local data files; users need to manually clear them or use the in-app data deletion feature.

## 9. Children's Privacy

DesireCore does not provide services to children under 13 years of age. If we discover that we have collected personal information from a child under 13, we will immediately delete that information.

Parents or guardians who believe their child has provided us with personal information, please contact us immediately and we will assist in deleting the relevant data.

## 10. Policy Updates

We may update this Privacy Policy from time to time. Significant changes will be communicated to users through in-app notifications.

Continued use of our services constitutes acceptance of the revised Privacy Policy. We encourage users to periodically review this policy for the latest information.

## 11. Contact Us

If you have any questions or suggestions about this Privacy Policy, or wish to exercise your data rights, please contact us through:

Email: [ceo@solar-corona.com](mailto:ceo@solar-corona.com)

We commit to responding to your request within 30 days of receipt.
