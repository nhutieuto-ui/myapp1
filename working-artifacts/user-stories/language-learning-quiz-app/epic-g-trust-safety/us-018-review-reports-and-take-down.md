# US-018 — Review reports and take content down

| Field | Value |
| --- | --- |
| Story ID | US-018 |
| Epic / Feature | Epic G — Trust & Safety / F-22 |
| Priority | **Must** (Phase 1) — safety gate; must ship with [US-009](../epic-c-publishing-sharing/us-009-publish-quiz-publicly.md) |
| Status | **Draft — D-7 resolved (DEC-55): owner named, response-time target set** |
| Source | DEC-3, DEC-5, F-22, I-2, D-7, **DEC-55, DEC-56, DEC-57** |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.2](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** moderator (operator role),
> **I want to** review reported quizzes and unpublish or remove them,
> **so that** the public catalogue stays safe for minors and free of infringing content.

## Preconditions

- [US-017](us-017-report-a-public-quiz.md) is delivered (reports exist).
- A moderation owner, response-time commitment, and takedown authority are defined — **the website admin, 2-business-day review target (resolved, DEC-55; D-7 closed).**
- An operator role exists and can be granted.

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-018.1 | Moderation is performed by an internal operator role, not by the community | Community moderation tooling is a different product capability |
| AS-018.2 | Takedown means the quiz is unpublished and made unplayable; the author retains a copy unless the case requires deletion | Hard-delete rules and data-retention handling change |
| AS-018.3 | Repeat-offender handling in Phase 1 is manual account suspension by the operator | An automated strike system must be built |
| **AS-018.4** | **Unpublishing is sufficient for a takedown; hard-deletion of content is not required (confirmed, DEC-57)** | If Legal later requires hard-delete for certain report categories, a deletion path must be added |

## Workflow notes

- **Main flow:** moderator opens the queue → reviews a reported quiz with its content and report reasons → decides: dismiss, unpublish, or remove → the decision is recorded and the author is notified.
- **Alternate flow:** moderator suspends a repeat-offending author's ability to publish.
- **Exception flow:** the author has already unpublished the quiz; the reported quiz has been deleted.
- Mockup: *TBD*.

## Acceptance criteria

```gherkin
AC1: View the moderation queue
  Given reports have been submitted
  When I open the moderation queue as an operator
  Then reported quizzes are listed with their report count, reasons, and time of first report
  And I can open each quiz to see its full content

AC2: Take a quiz down
  Given I am reviewing a reported quiz
  When I take it down
  Then the quiz is immediately removed from public discovery and is no longer playable
  And the author is notified with the reason
  And the decision, moderator, and timestamp are recorded

AC3: Dismiss a report
  Given I am reviewing a reported quiz that does not breach the rules
  When I dismiss the reports
  Then the quiz remains published
  And the decision is recorded against the report group

AC4: Only operators can moderate
  Given I do not hold the operator role
  When I attempt to open the moderation queue or take content down
  Then access is denied

AC5: Author cannot re-publish taken-down content unchanged
  Given my quiz was taken down
  When I attempt to publish it again without changes
  Then publication is blocked
  And I am told the content is subject to a moderation decision

AC6: Suspend a repeat offender
  Given an author has had multiple quizzes taken down
  When I suspend their publishing ability
  Then their existing public quizzes are unpublished
  And they cannot publish new quizzes until the suspension is lifted

AC7: Moderation actions are auditable
  Given moderation decisions have been made
  When an authorised reviewer inspects the audit record
  Then every decision is retrievable with its moderator, timestamp, reason, and affected content
```

## Out of scope

- Author appeals workflow — **confirmed not legally required for Phase 1 (DEC-56)**.
- Automated pre-publication screening (deferred — A-13).
- Legal notice-and-takedown formalities beyond recording the decision (confirm with Legal).
- Hard-deletion of taken-down content — **confirmed out of scope; unpublishing is sufficient (DEC-57)**.

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Trust & safety | Takedown must take effect immediately across discovery, play, and collections | §8 Trust & safety, I-2 |
| Security | Operator role is separately granted and least-privileged; every action is audit-logged | §8 Security |
| Ops | Response-time commitment for reviewing a report — **2 business days, owner: the website admin (resolved, DEC-55)** | D-7 |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | F-22 |
| Decisions | DEC-3, DEC-5, **DEC-55 (owner + response time, D-7 closed), DEC-56 (no appeals), DEC-57 (unpublish sufficient)** |
| Dependencies | [US-017](us-017-report-a-public-quiz.md), [US-009](../epic-c-publishing-sharing/us-009-publish-quiz-publicly.md) |
| Risks/Issues | I-2, R-10 (unbudgeted trust & safety scope) |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| ~~Q-018.1~~ | ~~Ops~~ | ~~Who holds the operator role at launch, and what is the target review turnaround?~~ | **Resolved (DEC-55): the website admin; 2-business-day target. D-7 is closed.** |
| ~~Q-018.2~~ | ~~Legal~~ | ~~Is an author appeals process legally required?~~ | **Resolved (DEC-56): no.** |
| ~~Q-018.3~~ | ~~Legal~~ | ~~Must taken-down content be hard-deleted, or is unpublishing sufficient?~~ | **Resolved (DEC-57): unpublishing is sufficient.** |
