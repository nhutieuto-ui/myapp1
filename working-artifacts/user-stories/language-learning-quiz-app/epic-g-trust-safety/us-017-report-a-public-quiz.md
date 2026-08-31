# US-017 — Report a public quiz

| Field | Value |
| --- | --- |
| Story ID | US-017 |
| Epic / Feature | Epic G — Trust & Safety / F-22 |
| Priority | **Must** (Phase 1) — safety gate; must ship with [US-009](../epic-c-publishing-sharing/us-009-publish-quiz-publicly.md) |
| Status | Draft |
| Source | DEC-3, DEC-5, F-22, I-2, A-13, **DEC-53, DEC-54** |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.2](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As** any user who encounters a public quiz,
> **I want to** report content that is inappropriate, unsafe, or infringing,
> **so that** harmful material in a catalogue used by minors can be reviewed and removed.

## Preconditions

- The quiz is published ([US-009](../epic-c-publishing-sharing/us-009-publish-quiz-publicly.md)).
- A moderation owner and review process exist — **the website admin, with a 2-business-day review target (resolved, DEC-55; D-7 closed).**

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-017.1 | Moderation is reactive: report → review → takedown; there is no pre-publication screening (A-13) | Screening cost and publish latency are added |
| AS-017.2 | Reporting is available to signed-in users and to anonymous visitors, with a reason category and optional comment | Anonymous abuse controls (rate limiting) become more important |
| AS-017.3 | Reason categories cover at minimum: inappropriate for minors, copyright infringement, spam, incorrect content, other | Category set must be revised with Legal |
| **AS-017.4** | **A dedicated formal legal/copyright notice channel is not built; copyright reports flow through the same general reason categories as any other report (DEC-53)** | If a formal notice-and-takedown channel is legally required, a separate intake flow must be added |

## Workflow notes

- **Main flow:** viewer opens a public quiz → selects report → chooses a reason and adds an optional comment → submits → report enters the moderation queue ([US-018](us-018-review-reports-and-take-down.md)).
- **Alternate flow:** the same quiz is reported multiple times; reports are grouped for review.
- **Exception flow:** repeated reports from the same reporter on the same quiz.
- Mockup: *TBD*.

## Acceptance criteria

```gherkin
AC1: Report a public quiz
  Given I am viewing a publicly published quiz
  When I report it with a reason category
  Then the report is recorded against that quiz with the reason, timestamp, and reporter identifier where available
  And I am shown an acknowledgement

AC2: Reason is mandatory
  Given I am submitting a report
  And no reason category is selected
  When I submit
  Then the report is not created
  And I am told a reason is required

AC3: Prevent duplicate reports from the same reporter
  Given I have already reported a quiz and it is still under review
  When I report the same quiz again
  Then no additional report is created
  And I am told my earlier report is already being reviewed

AC4: Reports are grouped per quiz
  Given several users report the same quiz
  When a moderator opens the queue
  Then the reports appear grouped under that quiz with a report count

AC5: Reporting is rate limited
  Given reports are submitted repeatedly from the same source in a short period
  When the configured limit is exceeded
  Then further reports from that source are rejected
  And the rejection is logged

AC6: Cannot report non-public content
  Given a quiz is a draft or is only shared by an invitation link
  When a report is attempted against it
  Then the report is rejected
```

## Out of scope

- Reporting individual users or private messages.
- Automated or AI-based content classification (Phase 3 candidate).
- Appeals by the reporter.
- A dedicated formal legal/copyright notice channel — **descoped for Phase 1 (DEC-53)**.
- Telling the reporter the outcome of their report — **confirmed out of scope (DEC-54)**.

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Trust & safety | A report must reach the moderation queue immediately on submission | §8 Trust & safety |
| Security | Rate limiting on anonymous reporting to prevent abuse (AC5) | OWASP — inferred |
| Privacy | Reporter identity must not be disclosed to the reported author | §8 Privacy — confirm with Legal |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | F-22 |
| Decisions | DEC-3, DEC-5, **DEC-53 (no dedicated legal channel), DEC-54 (no outcome notification)** |
| Dependencies | [US-009](../epic-c-publishing-sharing/us-009-publish-quiz-publicly.md), **D-7 (closed, DEC-55)** |
| Risks/Issues | I-2 |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| ~~Q-017.1~~ | ~~Legal~~ | ~~What reason categories are legally required (e.g. a formal copyright notice channel)?~~ | **Resolved (DEC-53): a dedicated legal/copyright channel is descoped; general reason categories are used for all reports.** |
| ~~Q-017.2~~ | ~~Ops~~ | ~~Is the reporter told the outcome of their report?~~ | **Resolved (DEC-54): no.** |
