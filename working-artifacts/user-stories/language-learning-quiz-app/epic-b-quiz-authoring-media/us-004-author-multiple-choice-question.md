# US-004 — Author a multiple-choice question

| Field | Value |
| --- | --- |
| Story ID | US-004 |
| Epic / Feature | Epic B — Quiz Authoring / F-03 |
| Priority | **Must** (Phase 1) |
| Status | Draft |
| Source | S1, F-03, **DEC-18, DEC-19** |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.2](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** language tutor,
> **I want to** write a multiple-choice question with options and mark the correct answer(s),
> **so that** my students can be checked on comprehension and vocabulary and be scored automatically.

## Preconditions

- I am editing a quiz draft ([US-003](us-003-create-and-manage-quiz-draft.md)).

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-004.1 | Both single-correct and multiple-correct MCQs are supported, chosen by the author | Only single-answer needed → simpler; only multi needed → scoring rule changes |
| AS-004.2 | An option may carry an image (F-06) in addition to or instead of text | Text-only options simplify the editor |
| AS-004.3 | Partial credit is not awarded for multi-correct questions in Phase 1 — the answer is right or wrong | Scoring and analytics change (A-5) |
| **AS-004.4** | **An MCQ may have at most 4 options (DEC-19)** | If a real quiz needs more, the cap and the editor UI must be revisited |

## Workflow notes

- **Main flow:** author adds an MCQ → enters the prompt → adds 2+ options → marks the correct option(s) → optionally attaches media ([US-007](us-007-attach-image-or-audio.md)) → saves.
- **Exception flow:** author saves with no correct option marked, or with fewer than two options.
- Mockup: *TBD*.

## Acceptance criteria

```gherkin
AC1: Create a single-answer multiple-choice question
  Given I am editing a quiz draft
  When I add a multiple-choice question with a prompt, at least two options, and exactly one option marked correct
  Then the question is saved
  And it appears in the quiz at the position I added it

AC2: Create a multiple-answer question
  Given I am adding a multiple-choice question
  When I mark more than one option as correct
  Then the question is saved as multiple-answer
  And students must select all correct options to score

AC3: Reject a question with no correct answer
  Given I am adding a multiple-choice question
  And no option is marked correct
  When I attempt to save
  Then the question is not saved
  And I am told at least one correct option is required

AC4: Reject fewer than two options
  Given I am adding a multiple-choice question with only one option
  When I attempt to save
  Then the question is not saved
  And I am told at least two options are required

AC5: Correct answers are not exposed to students before submission
  Given a quiz containing a multiple-choice question is playable
  When a student loads the question
  Then the data returned to the student does not identify which option is correct

AC6: Reject more than the maximum number of options
  Given I am adding a multiple-choice question that already has 4 options (DEC-19)
  When I attempt to add another option
  Then the option is not added
  And I am told a question may have at most 4 options
```

## Out of scope

- Per-option feedback text and hints (Phase 2 candidate).
- Randomised option order (Phase 2 candidate).
- Partial credit scoring.

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Security | The correct-answer key must never be sent to the play client before submission (AC5) | §8 Security |
| Accessibility | Options must be keyboard-selectable and screen-reader labelled | §8 Accessibility |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | F-03; scoring consumed by F-16 ([US-013](../epic-d-discovery-play/us-013-play-quiz-and-submit-attempt.md)) |
| Decisions | **DEC-18 (no partial credit), DEC-19 (max 4 options)** |
| Dependencies | [US-003](us-003-create-and-manage-quiz-draft.md) |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| ~~Q-004.1~~ | ~~Business~~ | ~~Is partial credit required for multiple-answer questions?~~ | **Resolved (DEC-18): no — confirms AS-004.3.** |
| ~~Q-004.2~~ | ~~Business~~ | ~~Is there a maximum number of options?~~ | **Resolved (DEC-19): 4 options maximum — see AC6.** |
