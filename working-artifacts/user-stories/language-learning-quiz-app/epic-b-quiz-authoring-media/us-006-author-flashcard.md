# US-006 — Author a flashcard

| Field | Value |
| --- | --- |
| Story ID | US-006 |
| Epic / Feature | Epic B — Quiz Authoring / F-05 |
| Priority | **Must** (Phase 1) |
| Status | Draft |
| Source | S1, F-05, A-5, **DEC-23, DEC-24** |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.2](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** language tutor,
> **I want to** create two-sided flashcards with a prompt and an answer,
> **so that** my students can drill vocabulary through repeated review.

## Preconditions

- I am editing a quiz draft ([US-003](us-003-create-and-manage-quiz-draft.md)).

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-006.1 | Flashcards are **practice-only**: they are not scored and do not contribute to an attempt score (A-5) | Self-assessment capture and scoring rules must be added, changing [US-013](../epic-d-discovery-play/us-013-play-quiz-and-submit-attempt.md) and [US-015](../epic-e-response-review/us-015-review-student-responses.md) |
| AS-006.2 | A flashcard has exactly two sides; front and back may each carry text and media | Multi-field cards (e.g. reading + meaning + example) require a different model |
| **AS-006.3** | **A quiz may consist entirely of flashcards, with no scorable questions at all (DEC-23)** | [US-013](../epic-d-discovery-play/us-013-play-quiz-and-submit-attempt.md) must handle an attempt with zero scorable questions without treating it as an error |

## Workflow notes

- **Main flow:** author adds a flashcard → enters front and back content → optionally attaches media ([US-007](us-007-attach-image-or-audio.md)) → saves.
- **Exception flow:** either side is left empty.
- Mockup: *TBD*.

## Acceptance criteria

```gherkin
AC1: Create a flashcard
  Given I am editing a quiz draft
  When I add a flashcard with front content and back content
  Then the flashcard is saved
  And it appears in the quiz in the position I added it

AC2: Reject an incomplete flashcard
  Given I am adding a flashcard
  And either the front or the back has no text and no media
  When I attempt to save
  Then the flashcard is not saved
  And I am told both sides require content

AC3: Flashcards are excluded from scoring
  Given a quiz contains both flashcards and multiple-choice questions
  When a student completes an attempt
  Then the attempt score is calculated from the scorable questions only
  And the flashcards are reported as reviewed, not as correct or incorrect

AC4: A quiz may be flashcard-only
  Given a quiz contains only flashcards and no scorable questions (DEC-23)
  When a student completes an attempt on that quiz
  Then the attempt completes successfully with all cards marked reviewed
  And no numeric score is shown or required
```

## Out of scope

- Spaced-repetition scheduling and card-level mastery tracking (future).
- Learner self-rating ("I knew this / I didn't").
- Bulk import of cards from CSV or other tools (**confirmed nice-to-have — DEC-24 — Phase 2 candidate**).

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Internationalization | CJK text renders correctly on both card sides | C-5 |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | F-05 |
| Assumptions | A-5 |
| Decisions | **DEC-23 (flashcard-only quizzes allowed), DEC-24 (bulk import confirmed nice-to-have)** |
| Dependencies | [US-003](us-003-create-and-manage-quiz-draft.md) |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| ~~Q-006.1~~ | ~~Business~~ | ~~Should the author be able to build a flashcard-only quiz, or must every quiz contain at least one scorable question?~~ | **Resolved (DEC-23): flashcard-only quizzes are allowed, no scoring required — see AS-006.3, AC4.** |
| ~~Q-006.2~~ | ~~Business~~ | ~~Is bulk card import expected by tutors migrating from another tool?~~ | **Resolved (DEC-24): yes, confirmed as a nice-to-have — stays a Phase 2 candidate.** |
