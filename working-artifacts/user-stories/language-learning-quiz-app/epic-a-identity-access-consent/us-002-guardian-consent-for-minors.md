# US-002 — Guardian consent for minor learners

| Field | Value |
| --- | --- |
| Story ID | US-002 |
| Epic / Feature | Epic A — Identity, Access & Consent / F-21 |
| Priority | **Must** (Phase 1) — legal release gate (I-1) |
| Status | Draft — **blocked on D-6** |
| Source | DEC-3, F-21, I-1, A-11, A-12, C-6, **DEC-9, DEC-12, DEC-13, DEC-14, DEC-15** |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.2](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** parent or guardian of a minor learner,
> **I want to** be asked for consent before my child can use the app and have their data restricted,
> **so that** my child participates lawfully and their identity is not exposed in a public catalogue.

## Preconditions

- [US-001](us-001-sign-up-and-sign-in.md) is delivered (age band is captured at sign-up).
- D-6 is **partially closed**: minimum age (6, global — DEC-9) and retention period (3 months — DEC-13) are set; the consent mechanism (DEC-12) is a BA recommendation still pending Legal validation.

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-002.1 | **Consent is collected by a verifiable double-opt-in guardian email confirmation — an "email-plus" flow where the guardian must click a link and actively confirm through a dedicated screen, not just open the email (DEC-12, BA recommendation)** | This is a working assumption, not a legal ruling; Legal may require a higher-assurance method (signed form, payment verification, video call) for some jurisdictions given a global minimum age of 6 |
| AS-002.2 | A minor account exists but is **restricted** until consent is granted — it can browse nothing and submit nothing | Account creation must be deferred entirely until consent, changing the sign-up flow |
| AS-002.3 | A minor's public presence is limited to a display name; real name, email, and responses are never public (A-12) | Privacy exposure and potential regulatory breach |
| ~~AS-002.4~~ | ~~This consent gate only applies to account-holding users. Since S5 (2026-08-30), a learner can join and play a shared quiz by link/QR with no account at all — this consent flow cannot see or restrict them. See Issue I-3~~ | **Resolved (DEC-15): Sponsor has decided consent is not required on the account-free link/QR path — a risk-acceptance decision, not a legal clearance. Issue I-3 is closed as risk accepted; see [US-012](../epic-d-discovery-play/us-012-join-quiz-via-link-or-qr.md)** |

## Workflow notes

- **Main flow:** minor declares a minor age band → supplies guardian email → app emails a consent request → guardian confirms → account becomes active.
- **Alternate flow:** guardian declines or does not respond within the configured window → account remains restricted and is purged after the **3-month retention period (DEC-13)**.
- **Exception flow:** guardian email is invalid or bounces → minor is prompted to correct it.
- Mockup: *TBD*.

## Acceptance criteria

```gherkin
AC1: Request consent for a minor account
  Given I have signed up and declared a minor age band
  When I submit a guardian email address
  Then my account is placed in a restricted state
  And a consent request is sent to the guardian address
  And I am told that I must wait for guardian approval

AC2: Restricted account cannot use the product
  Given my account is restricted pending guardian consent
  When I attempt to play a quiz, submit an attempt, or save a collection
  Then the action is blocked
  And I am shown the pending-consent message

AC3: Guardian grants consent
  Given a guardian has received a consent request
  When the guardian confirms consent through the link provided
  Then the minor account becomes active
  And the consent event is recorded with its timestamp and the guardian identifier

AC4: Guardian declines consent
  Given a guardian has received a consent request
  When the guardian declines
  Then the account remains permanently restricted
  And the account and its personal data are deleted after the 3-month retention period (DEC-13)

AC5: Consent request expires
  Given a consent request has been pending longer than the configured window
  When the window elapses
  Then the account remains restricted
  And the minor is told that consent was not received

AC6: Minor identity is not publicly exposed
  Given a minor account is active
  When any content or list that account contributes to is viewed by an unauthenticated visitor
  Then only the display name is visible
  And no email address, real name, age band, or response data is returned

AC7: Consent record is auditable
  Given consent has been granted or declined
  When an authorised operator inspects the account
  Then the consent decision, timestamp, guardian identifier, and consent text version are retrievable
```

## Out of scope

- Guardian dashboards or guardian-side visibility of a child's activity (future).
- Age verification (A-11).
- Proactive content screening (deferred — A-13).

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Privacy | Consent basis, retention, export, and deletion must be explicitly defined and enforced | §8 Privacy, C-6 |
| Security | Consent links must be single-use and time-limited | Inferred from AC3 — confirm with Legal |
| Auditability | Consent decisions retained for **3 months (DEC-13)**; owner: **website admin (DEC-14)** | D-6 |
| Ops | Consent disputes and deletion requests are handled by the **website admin** (DEC-14) | Q-002.4 |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | F-21 |
| Decisions | DEC-3, DEC-5, **DEC-9, DEC-12, DEC-13, DEC-14, DEC-15** |
| Dependencies | **D-6 partially closed — mechanism (DEC-12) pending Legal validation** |
| Risks/Issues | I-1 (high — can block launch), R-10, **I-3 — Resolved: Sponsor risk acceptance (DEC-15). No consent gate on the account-free link/QR join path. Retained here for audit trail; see [US-010](../epic-c-publishing-sharing/us-010-share-quiz-via-link-or-qr.md)** |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| ~~Q-002.1~~ | ~~Legal~~ | ~~Which consent mechanism is legally sufficient in each target jurisdiction?~~ | **Answered as a BA recommendation (DEC-12): double-opt-in guardian email confirmation. Still pending Legal sign-off — D-6 not fully closed.** |
| ~~Q-002.2~~ | ~~Legal~~ | ~~What is the retention period for a restricted or declined account?~~ | **Resolved (DEC-13): 3 months.** |
| ~~Q-002.3~~ | ~~Business~~ | ~~Which jurisdictions does the product operate in at launch?~~ | **Resolved (DEC-9): global — all jurisdictions.** |
| ~~Q-002.4~~ | ~~Ops~~ | ~~Who is accountable for handling consent disputes and deletion requests?~~ | **Resolved (DEC-14): the website admin.** |
| ~~Q-002.5~~ | ~~Legal~~ | ~~Given S5 (account-free link/QR joining), is guardian consent legally required at all for that path?~~ | **Resolved (DEC-15): no — Sponsor accepts this as a risk, not a legal clearance. Closes Issue I-3.** |
