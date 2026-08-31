# US-015 — Review student responses to my quiz

| Field | Value |
| --- | --- |
| Story ID | US-015 |
| Epic / Feature | Epic E — Response Collection & Review / F-13, F-14 |
| Priority | **Must** (Phase 1) — closes the core loop |
| Status | Draft |
| Source | S1, F-13, F-14, F-16, BO-2, **DEC-46, DEC-47, DEC-48, DEC-49, DEC-50** |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.2](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** language tutor,
> **I want to** see the attempts submitted against my quizzes, per quiz and per student, with each answer given,
> **so that** I know who practised, how they performed, and what to reteach — without collating answers by hand.

## Preconditions

- I own at least one quiz that has been published or shared by link/QR ([US-009](../epic-c-publishing-sharing/us-009-publish-quiz-publicly.md), [US-010](../epic-c-publishing-sharing/us-010-share-quiz-via-link-or-qr.md)).
- At least one attempt has been submitted ([US-013](../epic-d-discovery-play/us-013-play-quiz-and-submit-attempt.md)).

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-015.1 | Objective questions arrive already auto-scored (A-5, F-16); the tutor reviews rather than grades | A manual grading and score-override workflow is needed |
| AS-015.2 | Attempts from public plays by unknown learners are shown alongside attempts from participants who joined by link/QR, distinguished by source | Public attempts must be excluded or aggregated only |
| AS-015.3 | Responses are visible only to the quiz author and the responding student (§8 Security) | Sharing/export rules and privacy analysis change |
| AS-015.4 | Aggregate per-question analytics is Phase 2 (F-19); Phase 1 shows raw responses only | Analytics must be pulled into Phase 1 |
| **AS-015.5** | **Resolved by S5: for link/QR-joined participants, the "student display name" is a self-entered, unverified nickname, not a verified account identity. Two attempts with the same name may be two different people, or the same person twice** | Tutor may misattribute responses; grading/feedback keyed to a name could reach the wrong learner |

## Workflow notes

- **Main flow:** author opens a quiz → sees a list of attempts with student display name, submitted time, score, and late flag → opens one attempt → sees each question with the submitted answer and its correctness.
- **Alternate flow:** author switches to a per-student view across their quizzes; **for link/QR-joined participants this view groups by matching display name, which is unverified (AS-015.5)**.
- **Exception flow:** no attempts yet; **for account-based responders, the account has been deleted**.
- Mockup: *TBD*.

## Acceptance criteria

```gherkin
AC1: See attempts for one of my quizzes
  Given students have submitted attempts against my quiz
  When I open the quiz's responses view
  Then each attempt is listed with the student display name, submission time, and score
  And attempts submitted after the due date are marked late

AC2: Inspect an individual attempt
  Given an attempt is listed
  When I open it
  Then I see every question with the answer the student submitted and whether it was scored correct
  And flashcards are shown as reviewed rather than scored

AC3: See a single student's responses across my quizzes
  Given a student has attempted several of my quizzes
  When I open that student's view
  Then all their attempts on my quizzes are listed with scores and dates
  And attempts on quizzes I do not own are not shown

AC4: Only the author can see responses
  Given I am not the author of a quiz
  When I attempt to open its responses
  Then access is denied
  And no attempt data is returned

AC5: Responses are never public
  Given a quiz is published publicly
  When an unauthenticated visitor views it
  Then no attempt, score, or responder identity is retrievable

AC6: Distinguish link/QR participants from public plays
  Given my published quiz has been played both by participants who joined through my link and by other users
  When I view its responses
  Then each attempt indicates whether the player joined through my invitation or played it publicly

AC7: Empty state
  Given none of my quizzes has been attempted yet
  When I open the responses view
  Then I am shown an empty state explaining that responses appear once students submit
```

## Out of scope

- Aggregate per-question analytics (F-19 — Phase 2).
- Manual grading, score override, and written feedback to the student — **confirmed out of scope for Phase 1 (DEC-47)**.
- Export to CSV/spreadsheet — **confirmed out of scope for Phase 1 (DEC-46)**.
- Notification to the author on new responses (F-17 — Phase 2).
- A "who is missing" view against a roster — **confirmed out of scope, there is no roster to compare against (DEC-49)**.
- A tool to merge, relabel, or split attempts by ambiguous display name — **confirmed out of scope (DEC-50)**.

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Security | Server-side authorization on every attempt read; author-only access | §8 Security |
| Privacy | Response data is personal data; minors' responses must never be publicly exposed | §8 Privacy, A-12, DEC-3 |
| **Privacy** | **Display names for link/QR-joined participants are unverified (AS-015.5); the tutor UI must not present them as confirmed identity** | AS-015.5 |
| Performance | The responses list should remain usable at the expected attempt volume; volume unknown — see Q5 in Vision & Scope | §8 Performance |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | F-13, F-14, F-16 |
| Decisions | **DEC-46 (no export), DEC-47 (no feedback channel), DEC-48 (retention on deletion), DEC-49 (no missing-list view), DEC-50 (no merge/relabel tool)** |
| Objective | BO-2, BO-4 |
| Dependencies | [US-013](../epic-d-discovery-play/us-013-play-quiz-and-submit-attempt.md) |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| ~~Q-015.1~~ | ~~Business~~ | ~~Is export (CSV) needed in Phase 1 for tutors who keep their own records?~~ | **Resolved (DEC-46): no.** |
| ~~Q-015.2~~ | ~~Business~~ | ~~Does the tutor need to send written feedback back to a student in Phase 1?~~ | **Resolved (DEC-47): no.** |
| ~~Q-015.3~~ | ~~Privacy~~ | ~~How long are attempts retained, and what happens to them when a student deletes their account?~~ | **Resolved (DEC-48): nothing changes automatically — the tutor's copy is retained, not cascade-deleted. The overall retention *duration* remains open — see X-6/D-6 in the [backlog index](../README.md).** |
| ~~Q-015.4~~ | ~~Business~~ | ~~With no roster (S4), the tutor can only see who joined — never who did not. Is a "who is missing" view still expected, and if so, against what list?~~ | **Resolved (DEC-49): no such view is expected.** |
| ~~Q-015.5~~ | ~~Business~~ | ~~Given nicknames are unverified and unenforced as unique (S5/AS-015.5), does the tutor need a way to merge or relabel two attempts they believe belong to the same person, or split two people who used the same name?~~ | **Resolved (DEC-50): no such tool is needed.** |
