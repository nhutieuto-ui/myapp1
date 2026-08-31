# US-014 — Review a flashcard set

| Field | Value |
| --- | --- |
| Story ID | US-014 |
| Epic / Feature | Epic D — Quiz Play Engine / F-05, F-12 |
| Priority | **Must** (Phase 1) |
| Status | Draft |
| Source | S1, F-05, A-5, **DEC-44, DEC-45** |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.2](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** student,
> **I want to** flip through flashcards at my own pace,
> **so that** I can memorise vocabulary without being graded.

## Preconditions

- The quiz contains at least one flashcard ([US-006](../epic-b-quiz-authoring-media/us-006-author-flashcard.md)).
- I can access the quiz (published, or joined by link or QR code).

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-014.1 | Flashcard review is unscored practice (A-5); the system records only that cards were reviewed. **The tutor has no visibility into which students reviewed a set — it is entirely private practice (confirmed, DEC-44)** | Self-rating capture and mastery tracking must be built |
| AS-014.2 | Cards are shown in the author-defined order only; **shuffle is not built (confirmed, DEC-45)** | Randomisation and session state add complexity |

## Workflow notes

- **Main flow:** student opens a quiz containing flashcards → sees the front → reveals the back → moves to the next card → finishes the set.
- **Alternate flow:** student goes back to a previous card or leaves mid-set.
- Mockup: *TBD*.

## Acceptance criteria

```gherkin
AC1: Flip a card
  Given I am reviewing a flashcard
  When I reveal the answer
  Then the back of the card is displayed with its text and any attached media

AC2: Move through the set
  Given a quiz contains several flashcards
  When I move forward and backward through the set
  Then each card is shown in the author-defined order
  And I can reach the end of the set

AC3: Flashcards do not affect the score
  Given a quiz contains flashcards and scorable questions
  When I complete the quiz and submit
  Then the flashcards are reported as reviewed
  And they do not change my score

AC4: Reveal with the keyboard
  Given I am using only the keyboard
  When I use the keyboard to reveal and advance cards
  Then the flip and navigation work without a pointer

AC5: Leave and return mid-set
  Given I leave a flashcard set part-way through
  When I reopen the quiz
  Then I can continue reviewing from the start or from where I stopped
  And no incorrect result is recorded for the unreviewed cards
```

## Out of scope

- Spaced repetition, mastery levels, and "I knew it / I didn't" self-rating.
- Audio auto-play through a card set.
- Printable or exportable card decks.
- Shuffle/randomised card order — **confirmed out of scope (DEC-45)**.
- Tutor visibility into flashcard review activity — **confirmed out of scope (DEC-44)**.

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Accessibility | Flip and navigation must be keyboard operable and announced to screen readers | §8 Accessibility |
| Internationalization | CJK text renders correctly at card size on mobile | C-5 |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | F-05, F-12 |
| Assumptions | A-5 |
| Decisions | **DEC-44 (no tutor visibility), DEC-45 (no shuffle)** |
| Dependencies | [US-006](../epic-b-quiz-authoring-media/us-006-author-flashcard.md), [US-013](us-013-play-quiz-and-submit-attempt.md) |
| Objective | BO-3 (repeat practice) |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| ~~Q-014.1~~ | ~~Business~~ | ~~Should the tutor see which students reviewed a flashcard set, or is it entirely private practice?~~ | **Resolved (DEC-44): entirely private practice — no tutor visibility.** |
| ~~Q-014.2~~ | ~~UX~~ | ~~Is shuffle expected by learners familiar with consumer flashcard apps?~~ | **Resolved (DEC-45): no — shuffle is not built.** |
