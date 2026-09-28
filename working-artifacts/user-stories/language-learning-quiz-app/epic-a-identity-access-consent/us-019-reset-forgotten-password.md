# US-019 — Reset a forgotten password

| Field | Value |
| --- | --- |
| Story ID | US-019 |
| Epic / Feature | Epic A — Identity, Access & Consent / **F-24 (new — not yet in Vision & Scope, see Traceability gap)** |
| Priority | **Must** — no self-service recovery path exists today for email/password accounts; every locked-out user currently needs manual DB intervention |
| Status | Draft — **Revised (2026-09-28): simplified to a single-screen, no-email-link flow per Sponsor direction. Carries a critical security risk (see Risks/Issues) that needs explicit sign-off before this ships beyond local/dev.** |
| Source | Gap identified during development; extends [US-001](us-001-sign-up-and-sign-in.md) (email/password identity provider, DEC-10). Flow simplified 2026-09-28 at Sponsor's request. |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.8](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** registered user who signed up with an email and password,
> **I want to** submit my email together with a new password directly on the Forgot Password screen,
> **so that** I can regain access to my account without contacting support, and without needing to receive or click an emailed link.

## Preconditions

- The user has an existing account created via the email/password (Credentials) flow ([US-001](us-001-sign-up-and-sign-in.md)). Accounts created via an OAuth provider only (e.g. GitHub/Google) have no password on file.
- A "Forgot password?" entry point exists on the login screen.
- No transactional email-sending dependency is required for this revision — the previous link/token design and its email-service dependency are removed (see Traceability).

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| **AS-019.1** | **(Sponsor decision, high risk)** This flow performs **no verification that the requester actually owns/controls the submitted email address** — knowing (or guessing) a registered email is sufficient to overwrite that account's password. This is a deliberate simplification trading identity assurance for implementation simplicity. | Anyone who knows or guesses a user's registered email can take over their account. This is a materially higher risk than a standard emailed-link "forgot password" flow — see the Risk in Traceability. Needs explicit written risk acceptance before real (non-dev) users are exposed to it. |
| AS-019.2 | To prevent account enumeration (OWASP), the system shows the **same generic confirmation message** after submission whether or not the email matched an account, and whether the matched account was password-based or OAuth-only | If the business wants explicit "no account found" messaging, this trades a small usability gain for a re-introduced enumeration risk |
| AS-019.3 | The new password and its confirmation must match exactly, checked before any database update | If mismatches should be tolerated (e.g. only warn), validation behavior changes |
| AS-019.4 | The new password must satisfy the same password policy enforced at sign-up (currently 8–72 characters) | If a stronger/different policy is wanted specifically for resets, validation rules diverge from sign-up |
| AS-019.5 | OAuth-only accounts (no password on file) are treated the same as "email not registered" — there is no password row to overwrite, so nothing changes and the same generic message is shown | If OAuth-only users should instead be nudged to their OAuth provider, messaging needs to differ per AS-019.2 |

## Workflow notes

- **Main flow (match found):** user on the login screen selects "Forgot password?" → lands on the Forgot Password screen → enters their email, a new password, and a confirmation of the new password → submits → the system finds a matching email/password account → the account's password is updated directly to the new value → the user sees a generic confirmation message.
- **Main flow (no match):** same screen and inputs, but the email does not match any account, or matches an OAuth-only account with no password on file → the system makes no changes → the user sees the **same** generic confirmation message as the match case (AS-019.2).
- **Alternate flow (password/confirmation mismatch):** inline validation error; the form is not submitted and no lookup against the database happens.
- **Alternate flow (new password fails policy):** inline validation error (e.g. too short); the form is not submitted.
- This is a **single screen, single submit** — there is no separate emailed link, token, or second "set new password" step.
- Mockup: *TBD* — no wireframe exists yet for the login screen's "Forgot password?" entry point or the Forgot Password screen itself.

## Acceptance criteria

```gherkin
AC1: Reset the password directly for a registered email/password account
  Given I am on the Forgot Password screen
  And I have an existing account created with an email and password
  When I enter my registered email, a new password, and a matching confirmation, and submit
  Then my account's password is updated to the new password
  And I see a generic confirmation message

AC2: No change is made for an unregistered or OAuth-only email
  Given I am on the Forgot Password screen
  When I submit an email that has no account, or that belongs to an OAuth-only account with no password on file, along with a new password and matching confirmation
  Then no password anywhere is changed
  And I see the same generic confirmation message as AC1

AC3: New password and confirmation must match
  Given I am on the Forgot Password screen
  When I submit a new password and a confirmation that do not match
  Then the form is not submitted and no account is looked up
  And I see a validation error indicating the passwords do not match

AC4: New password must meet the password policy
  Given I am on the Forgot Password screen
  When I submit a new password that does not meet the password policy (e.g. too short)
  Then the form is not submitted
  And I see the specific validation error

AC5: Successful and unsuccessful outcomes are indistinguishable to the user
  Given I have submitted the Forgot Password form with validly-formed input (matching, policy-compliant passwords)
  When the submission completes, regardless of whether the email matched a resettable account
  Then the confirmation message text is identical in both cases
  And no other visible signal (timing, error styling, redirect target) reveals which case occurred

AC6: Reach the Forgot Password screen from login
  Given I am on the login screen
  When I select "Forgot password?"
  Then I am taken to the Forgot Password screen described above
```

## Out of scope

- **Verifying that the requester actually owns/controls the submitted email address** (e.g. an emailed link, OTP, or magic code) — explicitly removed by this revision; see the critical risk this introduces under Risks/Issues.
- Any email sending, token, or link/expiry mechanism (fully removed from this revision).
- Invalidating other active sessions when the password changes (not requested here; raise as a follow-up if needed).
- Changing a password while already signed in and authenticated (a separate "account settings" capability — not currently in the backlog).
- Rate limiting or throttling of submissions (not requested; recommended as a follow-up mitigation given AS-019.1 — see Open Questions).
- Multi-factor authentication or security questions as an alternate recovery path.

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Security | The new password is hashed with the same algorithm/cost factor used at sign-up (bcrypt) before being stored | Consistency with US-001's sign-up implementation |
| Security | No account existence is disclosed via response timing, error messaging, or redirect differences (OWASP non-enumeration) | AS-019.2 |
| **Security (flagged, not yet mitigated)** | **No identity-ownership verification precedes a password change (AS-019.1).** Recommend at minimum per-email/IP rate limiting and abuse monitoring before enabling outside local/dev — **TBD, needs sign-off** | New risk introduced by this revision, see Traceability |
| Privacy | No personal data beyond the submitted email and password is processed or stored by this flow | §8 Privacy (Vision & Scope), by extension |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | **F-24 (new, proposed)** — Password recovery for credential accounts; not present in Vision & Scope v0.8's feature list (F-01–F-16, F-21–F-23) |
| Decisions | Extends DEC-10 (email + [OAuth provider] identity providers, US-001). **New (2026-09-28, unnumbered):** Sponsor directed removal of the emailed link/token step in favor of a direct email + new-password + confirm-password form — see AS-019.1. |
| Dependencies | **Removed** — the transactional email-sending dependency from the original draft no longer applies to this revision. |
| Risks/Issues | **New, critical — unnumbered:** because no proof of email ownership is required, any actor who knows or guesses a registered user's email can overwrite that account's password and take it over. This is a materially higher risk than a standard "forgot password" flow. Recommend restricting this flow to local/dev/staging, or pairing it with abuse mitigation (Q-019.2), until Sponsor/Security formally accepts the risk for production use. |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| **Q-019.1** | **Security** | **Is this reduced-assurance flow acceptable for real (non-dev) users, or should it be restricted to local/dev/staging only until an identity-verification step is added?** | Production readiness / Definition of Done |
| Q-019.2 | Security | Should basic abuse mitigation (e.g. per-email/IP rate limiting, CAPTCHA) be added despite the simplified flow, to reduce automated password-overwrite abuse? | NFR finalization |
| Q-019.3 | Scope | Is password recovery in Phase 1 scope, or is it a Phase 2 candidate? It is not currently listed as a feature in the Vision & Scope document. | Confirming priority/Must status above |
| Q-019.4 | UX | Should "Forgot password?" be reachable only from the login screen, or also from other entry points (e.g. sign-up)? | AC6 scope |
| Q-019.5 | UX | Is the existing sign-up password policy (8–72 characters) sufficient for this flow, or should reset enforce additional rules? | AC4 |
