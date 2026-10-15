# Test Cases — US-014 Review a flashcard set

| Field | Value |
| --- | --- |
| Source requirement | [US-014](../user-stories/language-learning-quiz-app/epic-d-discovery-play/us-014-review-flashcard-set.md) |
| Requirement analysis | [Findings-Requirements-Analysis-language-learning-quiz-app-phase1.md](../test-analysis-reports/Findings-Requirements-Analysis-language-learning-quiz-app-phase1.md) — Readiness: Ready |
| Scope | Functional only |
| Module prefix | `FLASHREVIEW` |

| Test Case ID | Title | Test Steps | Expected Result | Requirement | Testing Technique | Priority | Preconditions | Test Data | Automation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC_FLASHREVIEW_001 | Verify revealing a flashcard displays its back content and attached media | 1. Open a quiz containing a flashcard with front and back content plus attached media<br>2. Reveal the answer | Back of the card is displayed with its text and any attached media | US-014 AC1 | Use Case Testing | Critical | Quiz contains at least one flashcard with media | — | Yes |
| TC_FLASHREVIEW_002 | Verify navigating a flashcard set preserves the author-defined order and reaches the end | 1. Open a quiz containing several flashcards<br>2. Move forward through each card to the end<br>3. Move backward through the set | Each card is shown in the author-defined order in both directions; the end of the set is reachable | US-014 AC2 | Use Case Testing | High | Quiz contains 3+ flashcards in a defined order | 3 flashcards | Yes |
| TC_FLASHREVIEW_003 | Verify flashcards are reported as reviewed and do not change the score of a mixed quiz | 1. Open a quiz containing flashcards and scorable questions<br>2. Review the flashcards and answer the scorable questions<br>3. Submit | Flashcards are reported as reviewed; they do not change the numeric score | US-014 AC3 | Use Case Testing | Critical | Quiz mixes flashcards and scorable questions | 1 flashcard, 1 MCQ | Yes |
| TC_FLASHREVIEW_004 | Verify flip and navigation are operable using only the keyboard | 1. Open a flashcard set using only the keyboard<br>2. Use the keyboard to reveal a card<br>3. Use the keyboard to advance to the next card | Flip and navigation work without a pointer | US-014 AC4 | Use Case Testing | High | Quiz contains at least two flashcards | — | No |
| TC_FLASHREVIEW_005 | Verify leaving and returning mid-set does not record an incorrect result for unreviewed cards | 1. Begin reviewing a flashcard set<br>2. Leave the quiz part-way through, before reaching the last card<br>3. Reopen the quiz | Review can continue from the start or from where it stopped; no incorrect result is recorded for cards not yet reviewed | US-014 AC5 | State Transition Testing | Medium | Flashcard set review was started and left incomplete | — | Yes |

## Coverage notes
- AC1–AC5 are each covered by at least one test case.
- Out-of-scope items explicitly not covered: spaced repetition/self-rating, shuffle (confirmed out of scope, DEC-45), and tutor visibility into review activity (confirmed out of scope, DEC-44) — no test cases are written for these since they are confirmed absent.
- TC_FLASHREVIEW_004 is marked Automation = No because keyboard-only flip/navigation and screen-reader announcement are better verified through manual/exploratory accessibility testing in this phase.
- Scoring interaction with other question types in a mixed quiz is cross-referenced to [TC-US-006-author-flashcard.md](TC-US-006-author-flashcard.md) and [TC-US-013-play-quiz-and-submit-attempt.md](TC-US-013-play-quiz-and-submit-attempt.md) to avoid duplicating the full scoring test matrix here.
