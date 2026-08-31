# US-013 — Play a quiz and submit an attempt

| Field | Value |
| --- | --- |
| Story ID | US-013 |
| Epic / Feature | Epic D — Quiz Play Engine / F-12, F-13, F-16 |
| Priority | **Must** (Phase 1) — the core product experience |
| Status | Draft |
| Source | S1, F-12, F-13, F-16, A-5, **DEC-39, DEC-42, DEC-43** |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.2](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** student,
> **I want to** work through a quiz's questions, submit my answers, and see how I did,
> **so that** I get immediate practice feedback and my tutor receives my responses.

## Preconditions

- The quiz is published ([US-009](../epic-c-publishing-sharing/us-009-publish-quiz-publicly.md)) or I joined it by link or QR code ([US-012](us-012-join-quiz-via-link-or-qr.md)).
- If I joined by link or QR, I have entered a display name (S5) — **no account is required for this path**. If I reached the quiz via the **public catalogue** ([US-011](us-011-find-a-quiz.md)), **I must be signed in to play (resolved, DEC-43)** — this differs from the account-free link/QR join path.

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-013.1 | Objective questions (MCQ, sentence re-arrangement) are auto-scored; flashcards are unscored practice (A-5, F-16) | Manual grading workflow must be added for the tutor |
| AS-013.2 | Results are shown to the student immediately on submission, **and consist of the score only — not the correct answers (confirmed, DEC-42)** | Delayed/tutor-released results require a review-and-release workflow |
| AS-013.3 | Play is online-only; an interrupted attempt may be resumed from the server-held progress (A-8) | Offline capture and sync are required |
| AS-013.4 | Sentence re-arrangement is graded by exact sequence match against the single correct order (DEC-2) | Grading model changes |
| **AS-013.5** | **For link/QR-joined players (S5), the attempt is attributed to the display name entered at join time, not to an account — there is no verified identity behind it** | Any feature assuming a verified student identity (e.g. cross-quiz history, collections) does not work for these players without a later account |
| **AS-013.6** | **A student may retake a quiz an unlimited number of times; every attempt is recorded separately and all are visible to the tutor (DEC-39)** — there is no single "counted" attempt | If only the latest/best attempt should be shown to the tutor, [US-015](../epic-e-response-review/us-015-review-student-responses.md) needs an attempt-selection rule |
| **AS-013.7** | **A player who reached the quiz via the public catalogue ([US-011](us-011-find-a-quiz.md)) must be signed in to play (DEC-43)** — this is a stricter rule than the link/QR join path | Public-discovery play needs a sign-in gate that the link/QR join path does not have |

## Workflow notes

- **Main flow:** student opens the quiz → answers each question in order, with media playable inline → submits → sees a result summary with per-question correctness → the attempt is routed to the author ([US-015](../epic-e-response-review/us-015-review-student-responses.md)).
- **Alternate flow:** student navigates back to change an answer before submitting; student resumes an interrupted attempt.
- **Exception flow:** quiz withdrawn mid-attempt; submission fails due to connectivity.
- Mockup: *TBD*.

## Acceptance criteria

```gherkin
AC1: Complete and submit a quiz
  Given I have opened a quiz I am allowed to play
  When I answer every question and submit
  Then the attempt is recorded against my account, or my joined display name (S5), and that quiz
  And I see a result summary with my score only, not the correct answers (DEC-42)

AC2: Answer a multiple-choice question
  Given a question requires selecting one option
  When I select an option and submit the attempt
  Then my selection is recorded
  And it is scored correct only if it matches the defined correct option

AC3: Answer a multiple-answer question
  Given a question has more than one correct option
  When I submit a selection that omits a correct option or includes an incorrect one
  Then the question is scored incorrect

AC4: Answer a sentence re-arrangement question
  Given a sentence question presents its segments in a shuffled order
  When I arrange the segments and submit
  Then the answer is scored correct only if my sequence exactly matches the author-defined order

AC5: Order segments without dragging
  Given I am answering a sentence re-arrangement question using only the keyboard
  When I move segments into my chosen order
  Then the order changes as I intend
  And I can submit the answer without using a pointer

AC6: Play attached media
  Given a question has an image, audio, or video attached
  When the question is displayed
  Then the media is presented with the question
  And audio and video can be replayed as many times as I want

AC7: Submit with unanswered questions
  Given I have left one or more questions unanswered
  When I submit
  Then I am warned which questions are unanswered
  And on confirming, the attempt is submitted with those questions scored as incorrect

AC8: Resume an interrupted attempt
  Given I started an attempt and left the quiz without submitting
  When I reopen the same quiz
  Then my previously entered answers are restored
  And I can continue from where I stopped

AC9: Cannot play a quiz I am not entitled to
  Given a quiz is neither published nor one I joined through a valid link
  When I attempt to open or submit it
  Then access is denied
  And no quiz content is returned

AC10: Quiz withdrawn during an attempt
  Given the author takes the quiz down while my attempt is in progress
  When I submit
  Then my attempt is accepted and stored
  And I can no longer start a new attempt on that quiz

AC11: Submission failure does not lose answers
  Given submission fails because of a network error
  When I retry
  Then my answers are still present
  And exactly one attempt is recorded when submission succeeds

AC12: Retake after submitting
  Given I already submitted an attempt on a quiz
  When I open and play it again
  Then a new attempt is created and recorded (DEC-39)
  And my previous attempt remains recorded and visible to the tutor

AC13: Public-catalogue play requires sign-in
  Given I reached a quiz via the public catalogue ([US-011](us-011-find-a-quiz.md)) and am not signed in
  When I attempt to start it
  Then I am asked to sign in before play begins (DEC-43)
```

## Out of scope

- Flashcard review flow ([US-014](us-014-review-flashcard-set.md)).
- Learner voice recording (**closed by DEC-1**).
- Timers, anti-cheat, proctoring, and shuffling of question order.
- Manual grading of subjective answers (no free-text question type in Phase 1).
- Showing correct answers after submission — **confirmed out of scope (DEC-42): score only.**

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Performance | Question-to-question transitions should feel instant; media should start quickly on mobile networks; thresholds *TBD* | §8 Performance |
| Security | Correct answers must not be retrievable by the client before submission; scoring is performed server-side | §8 Security |
| Accessibility | Keyboard operability throughout; non-drag alternative for ordering (AC5); captions/transcripts available for audio and video | §8 Accessibility |
| Compatibility | Usable on mobile, tablet, and desktop browsers | §6.1 |
| Idempotency | A retried submission must not create duplicate attempts (AC11) | Inferred from A-8 |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | F-12, F-13, F-16 |
| Decisions | DEC-1, DEC-2, **DEC-39 (unlimited retakes), DEC-42 (score-only feedback), DEC-43 (sign-in required for public-catalogue play)** |
| Dependencies | [US-004](../epic-b-quiz-authoring-media/us-004-author-multiple-choice-question.md), [US-005](../epic-b-quiz-authoring-media/us-005-author-sentence-rearrangement-question.md), [US-007](../epic-b-quiz-authoring-media/us-007-attach-image-or-audio.md), [US-009](../epic-c-publishing-sharing/us-009-publish-quiz-publicly.md)/[US-012](us-012-join-quiz-via-link-or-qr.md) |
| Objective | BO-2, BO-3 |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| ~~Q-013.1~~ | ~~Business~~ | ~~Are multiple attempts per quiz allowed, and which attempt is reported to the tutor?~~ | **Resolved (DEC-39): unlimited retakes; every attempt is recorded and all are visible to the tutor (also resolves Q-012.1).** |
| ~~Q-013.2~~ | ~~Business~~ | ~~Should the student see the correct answers after submitting, or only their score?~~ | **Resolved (DEC-42): only the score.** |
| ~~Q-013.3~~ | ~~Business~~ | ~~Can an anonymous visitor play a public quiz without an account?~~ | **Resolved (DEC-43): no — signing in is required for the public-discovery path. The link/QR join path (S5) remains account-free.** |
