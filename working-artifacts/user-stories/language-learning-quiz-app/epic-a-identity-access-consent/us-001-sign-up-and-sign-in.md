# US-001 — Sign up and sign in with a role and age band

| Field | Value |
| --- | --- |
| Story ID | US-001 |
| Epic / Feature | Epic A — Identity, Access & Consent / F-01, F-21 |
| Priority | **Must** (Phase 1) — prerequisite for every other story |
| Status | Draft |
| Source | S1 (implied), F-01, DEC-3, DEC-4, A-3, A-11, **DEC-9, DEC-10, DEC-11, DEC-27** |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.2](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** language tutor or learner,
> **I want to** create an account, declare my age band, and sign in,
> **so that** the content I author or the answers I submit are reliably attributed to me and handled appropriately for my age.

## Preconditions

- At least one identity provider is configured: **email and Google (DEC-10, closes D-2)**.
- The global minimum age is **6 (DEC-9)**; the guardian-consent mechanism is a BA recommendation pending Legal validation (**DEC-12; D-6 remains gating** until Legal signs off).

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-001.1 | One account can act as both teacher (author) and student (A-3); role is a capability, not an exclusive account type | Separate account types, separate sign-up flows, and permission rework |
| AS-001.2 | Age is **self-declared** at sign-up; no verification service is used (A-11) | Age-verification vendor, cost, and an extra flow step are added |
| AS-001.3 | Age is captured as a **band** (e.g. under-13 / 13–17 / 18+), not a date of birth, to minimise personal data | Date of birth storage and stricter retention rules apply |
| **AS-001.4** | **The global floor for any account is age 6 (DEC-9); role (tutor/learner) is chosen explicitly at sign-up, not inferred from behaviour (DEC-11)** | If role should instead be inferred, the sign-up screen and AC1 need to drop the explicit choice |
| **AS-001.5** | **A tutor confirms content rights once, at sign-up (DEC-27) — not re-asked on every later media upload ([US-007](../epic-b-quiz-authoring-media/us-007-attach-image-or-audio.md))** | If a per-upload confirmation is legally safer, sign-up must not be treated as sufficient and US-007's AC8 must be reinstated |

## Workflow notes

- **Main flow:** visitor chooses sign-up → **chooses a role (tutor or learner, DEC-11)** → authenticates with the configured provider (**email or Google, DEC-10**) → declares age band → account is created → lands on their home view.
- **Alternate flow:** returning user signs in and goes straight to their home view.
- **Exception flow:** a user who declares an age band below the jurisdiction minimum is not granted an account (see AC5).
- Minors are routed into the guardian-consent flow — see [US-002](us-002-guardian-consent-for-minors.md).
- Mockup: *TBD*.

## Acceptance criteria

```gherkin
AC1: Create an account successfully
  Given I am a visitor who is not signed in
  When I complete sign-up by choosing a role, authenticating with a supported identity provider (email or Google), and declaring my age band
  Then my account is created with that role
  And I am signed in and see my home view

AC2: Sign in to an existing account
  Given I already have an account
  When I sign in with the identity provider I registered with
  Then I am signed in
  And I see my own content only

AC3: Age band is mandatory
  Given I am completing sign-up
  And I have not declared an age band
  When I attempt to finish sign-up
  Then the account is not created
  And I am told that an age band is required

AC4: Act as both author and learner on one account
  Given I am a signed-in user
  When I create a quiz and separately play a quiz published by another user
  Then both actions succeed under the same account
  And the quiz I created is listed as mine and the attempt I made is recorded as mine

AC5: Block sign-up below the minimum age
  Given I am completing sign-up
  When I declare an age band below the minimum age of 6 (DEC-9, applied globally)
  Then no account is created
  And I am shown an explanation and no further personal data is stored

AC6: Content is private to its owner by default
  Given user A has created an unpublished quiz
  When user B is signed in and attempts to open that quiz
  Then access is denied
  And the quiz content is not returned

AC7: Sign out
  Given I am signed in
  When I sign out
  Then my session is ended
  And returning to an authenticated view requires signing in again

AC8: Tutor confirms content rights at sign-up
  Given I am signing up and choosing the tutor role
  When I complete sign-up
  Then I have confirmed that any media I later upload will be rights-cleared by me
  And that confirmation is recorded against my account (DEC-27)
```

## Out of scope

- Guardian consent capture and enforcement ([US-002](us-002-guardian-consent-for-minors.md)).
- Class/roster management and institutional admin (closed by DEC-4).
- Age or identity verification (A-11).
- Profile editing, avatars, account deletion self-service (Phase 2 candidate — raise as a separate story).

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Security | Authorization is enforced server-side on every data access; the client-supplied user id is never trusted | §8 Security |
| Privacy | Only the minimum personal data required for sign-up is stored | §8 Privacy, A-12 |
| Availability | Response-time targets *TBD* — owner: Solution Architect | §8 Performance |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | F-01 Account & role; F-21 Age & consent handling (capture portion) |
| Decisions | DEC-3 (minors in scope), DEC-4 (independent tutors), **DEC-9 (min age 6, global), DEC-10 (email + Google), DEC-11 (role chosen at sign-up), DEC-27 (rights confirmation at sign-up)** |
| Dependencies | **D-2 resolved (email + Google, DEC-10)**; **D-6 partially closed — mechanism (DEC-12) pending Legal validation** |
| Risks/Issues | I-1 |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| ~~Q-001.1~~ | ~~Legal~~ | ~~What is the minimum age, and which age bands must be distinguished per jurisdiction?~~ | **Resolved (DEC-9): minimum age 6, applied globally. Per-jurisdiction consent-age nuance is still tracked at the Vision & Scope level (Q4a).** |
| ~~Q-001.2~~ | ~~Business~~ | ~~Which identity providers are in Phase 1 — email only, Google, others?~~ | **Resolved (DEC-10): email and Google.** |
| ~~Q-001.3~~ | ~~UX~~ | ~~Is role chosen at sign-up, or inferred from the first action taken?~~ | **Resolved (DEC-11): chosen explicitly at sign-up.** |