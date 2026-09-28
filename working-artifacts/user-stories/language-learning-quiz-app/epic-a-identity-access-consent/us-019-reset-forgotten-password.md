# US-019 — Reset a forgotten password

| Field | Value |
| --- | --- |
| Story ID | US-019 |
| Epic / Feature | Epic A — Identity, Access & Consent / **F-24 (new — not yet in Vision & Scope, see Traceability gap)** |
| Priority | **Must** — no self-service recovery path exists today for email/password accounts; every locked-out user currently needs manual DB intervention |
| Status | Draft — **new capability, not sourced from Vision & Scope; needs Product Owner/Sponsor confirmation it is in Phase 1 scope** |
| Source | Gap identified during development; extends [US-001](us-001-sign-up-and-sign-in.md) (email/password identity provider, DEC-10) |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.8](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** registered user who signed up with an email and password,
> **I want to** reset my password from the login screen using my registered email,
> **so that** I can regain access to my account without contacting support when I forget my password.

## Preconditions

- The user has an existing account created via the email/password (Credentials) flow ([US-001](us-001-sign-up-and-sign-in.md)). Accounts created via an OAuth provider only (e.g. GitHub/Google) have no password on file.
- A "Forgot password?" entry point exists on the login screen.
- **Dependency (new, not yet resolved):** a transactional email-sending service (e.g. Resend, SES, SendGrid) is integrated. No such integration exists in the codebase today — this story cannot ship without it.

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-019.1 | Reset is via a single-use, time-limited link emailed to the registered address (industry-standard pattern); exact token TTL is **TBD** | If a code/OTP flow is preferred instead of a link, the UI and delivery mechanism change |
| AS-019.2 | To prevent account enumeration (OWASP), the system shows the **same generic confirmation message** whether or not the email matches an account, and whether the account is password-based or OAuth-only | If the business wants explicit "no account found" or "use GitHub sign-in instead" messaging, this trades security for user convenience and needs an explicit decision |
| AS-019.3 | New password must satisfy the same password policy enforced at sign-up | If a stronger/different policy is wanted specifically for resets, validation rules diverge from sign-up |
| AS-019.4 | On successful reset, all other active sessions for the account are invalidated | If sessions should persist, a compromised-password scenario is not fully remediated by a reset alone |
| AS-019.5 | Repeated reset requests for the same email are rate-limited to reduce abuse/email-bombing; exact threshold is **TBD** | Without a limit, the feature can be used to spam a user's inbox |

## Workflow notes

- **Main flow:** user on the login screen selects "Forgot password?" → enters their email → submits → sees a generic confirmation ("If an account exists for this email, a reset link has been sent") → opens the emailed link → lands on a "Set a new password" screen → enters and confirms a new password meeting the policy → submits → password is updated and the link is invalidated → user is redirected to sign in with the new password.
- **Alternate flow (email not registered, or registered via OAuth only):** the same generic confirmation is shown; no reset email is sent (OAuth-only) or no account matches (unregistered) — no information is disclosed either way (AS-019.2).
- **Exception flow (expired or already-used link):** the "Set a new password" screen shows an error and an option to request a new link, without revealing whether the underlying account exists.
- **Exception flow (mismatched confirmation field):** inline validation error; form is not submitted.
- Mockup: *TBD* — no wireframe exists yet for the login screen's "Forgot password?" entry point or the reset screens.

## Acceptance criteria

```gherkin
AC1: Request a reset link for a registered email/password account
  Given I am on the login screen
  And I have an existing account created with an email and password
  When I select "Forgot password?", enter my registered email, and submit
  Then I see a generic confirmation that a reset link has been sent if an account exists
  And a single-use, time-limited reset link is emailed to that address

AC2: No account information is disclosed for an unregistered or OAuth-only email
  Given I am on the "Forgot password?" form
  When I submit an email that has no account, or an account that was created via OAuth only (no password)
  Then I see the same generic confirmation as AC1
  And no reset email is sent

AC3: Set a new password from a valid reset link
  Given I have received a valid, unused reset link within its time window
  When I open the link, enter a new password meeting the password policy, confirm it, and submit
  Then my password is updated
  And I am redirected to sign in with the new password

AC4: Reject an expired or already-used reset link
  Given a reset link has expired or was already used once
  When I open that link
  Then I am told the link is no longer valid
  And I am offered the option to request a new reset link

AC5: New password must meet the sign-up password policy
  Given I am on the "Set a new password" screen with a valid link
  When I submit a new password that does not meet the password policy
  Then the password is not updated
  And I see the specific validation error(s)

AC6: Reset invalidates other active sessions
  Given I successfully reset my password
  When the reset completes
  Then any other active sessions for my account are signed out
  And I must sign in again with the new password on any other device

AC7: Repeated reset requests are throttled
  Given I have already requested a reset link for an email within the throttling window
  When I request another reset link for the same email before that window elapses
  Then the system does not send an additional email
  And I still see the generic confirmation message (no error is disclosed)
```

## Out of scope

- Changing a password while already signed in and authenticated (a separate "account settings" capability — not currently in the backlog; raise as a new story if needed).
- Password reset for OAuth-only accounts (they have no password to reset; AC2 covers the non-disclosure behavior, but no "convert to password login" flow is included).
- Multi-factor authentication or security questions as an alternate recovery path.
- Email deliverability/bounce handling beyond basic send-and-confirm.

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Security | Reset tokens are single-use, time-limited, and unguessable (cryptographically random); no account existence is disclosed via response timing or messaging (OWASP) | Inferred — not in Vision & Scope; recommend adding as an explicit NFR |
| Security | Repeated reset requests are rate-limited per email/IP; exact threshold **TBD** — owner: Solution Architect | AS-019.5 |
| Availability | A transactional email-sending dependency must be selected and configured; no current SLA defined — **TBD** | New dependency, see Preconditions |
| Privacy | The reset email contains no other personal data beyond what is needed to complete the reset | §8 Privacy (Vision & Scope), by extension |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | **F-24 (new, proposed)** — Password recovery for credential accounts; not present in Vision & Scope v0.8's feature list (F-01–F-16, F-21–F-23) |
| Decisions | Extends DEC-10 (email + [OAuth provider] identity providers, US-001) |
| Dependencies | **New — D-XX (unnumbered): transactional email-sending service is not yet integrated in the codebase** |
| Risks/Issues | New — account-enumeration risk if AS-019.2's generic-messaging behavior is not implemented as specified |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| Q-019.1 | Scope | Is password recovery in Phase 1 scope, or is it a Phase 2 candidate? It is not currently listed as a feature in the Vision & Scope document. | Confirming priority/Must status above |
| Q-019.2 | Technical | Which transactional email provider should be integrated (Resend, SES, SendGrid, other)? None is currently wired into the codebase. | Any implementation of AC1/AC3 |
| Q-019.3 | Security | What should the reset-link TTL and per-email rate-limit thresholds be? | AC1, AC4, AC7 |
| Q-019.4 | UX | Should a user who signed up via OAuth-only ever be nudged toward "Sign in with [provider]" instead, or must messaging always stay fully generic (AS-019.2)? | AC2 |
| Q-019.5 | UX | Does the Vision & Scope's password policy for sign-up need to be documented explicitly, or does one not yet exist and need to be defined for AC5? | AC5 |
