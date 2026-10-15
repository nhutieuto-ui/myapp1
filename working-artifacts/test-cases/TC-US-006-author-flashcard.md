# Test Cases — US-006 Author a flashcard

| Field | Value |
| --- | --- |
| Source requirement | [US-006](../user-stories/language-learning-quiz-app/epic-b-quiz-authoring-media/us-006-author-flashcard.md) |
| Requirement analysis | [Findings-Requirements-Analysis-language-learning-quiz-app-phase1.md](../test-analysis-reports/Findings-Requirements-Analysis-language-learning-quiz-app-phase1.md) — Readiness: Ready |
| Scope | Functional only |
| Module prefix | `FLASHCARD` |

| Test Case ID | Title | Test Steps | Expected Result | Requirement | Testing Technique | Priority | Preconditions | Test Data | Automation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC_FLASHCARD_001 | Verify a flashcard can be created with front and back content | 1. Open a quiz draft<br>2. Add a flashcard<br>3. Enter front content and back content<br>4. Save | Flashcard is saved and appears in the quiz at the position added | US-006 AC1 | Use Case Testing | Critical | Editing a quiz draft | Front: "犬"; Back: "dog" | Yes |
| TC_FLASHCARD_002 | Verify saving a flashcard with an empty front (no text, no media) is rejected | 1. Add a flashcard<br>2. Leave the front empty<br>3. Enter back content<br>4. Attempt to save | Flashcard is not saved; user is told both sides require content | US-006 AC2 | Equivalence Partitioning | High | Editing a quiz draft | Front: ""; Back: "dog" | Yes |
| TC_FLASHCARD_003 | Verify saving a flashcard with an empty back (no text, no media) is rejected | 1. Add a flashcard<br>2. Enter front content<br>3. Leave the back empty<br>4. Attempt to save | Flashcard is not saved; user is told both sides require content | US-006 AC2 | Equivalence Partitioning | High | Editing a quiz draft | Front: "犬"; Back: "" | Yes |
| TC_FLASHCARD_004 | Verify the attempt score is calculated only from scorable questions when a quiz mixes flashcards and MCQs | 1. Author a quiz with 1 flashcard and 1 MCQ<br>2. As a student, complete and submit an attempt | Score reflects only the MCQ; the flashcard is reported as reviewed, not correct/incorrect | US-006 AC3 | Use Case Testing | Critical | Quiz contains both question types; quiz is playable | 1 flashcard, 1 MCQ | Yes |
| TC_FLASHCARD_005 | Verify flashcards never appear as "correct" or "incorrect" in the result summary | 1. Complete an attempt on a quiz containing a flashcard<br>2. View the result summary | Flashcard entry is marked reviewed; no correct/incorrect label is shown for it | US-006 AC3 | Use Case Testing | High | Quiz contains at least one flashcard | — | Yes |
| TC_FLASHCARD_006 | Verify a flashcard-only quiz (no scorable questions) completes successfully with no numeric score required | 1. Author a quiz containing only flashcards<br>2. As a student, complete the attempt and submit | Attempt completes successfully; all cards are marked reviewed; no numeric score is shown or required | US-006 AC4 (DEC-23) | Use Case Testing | Critical | Quiz contains only flashcards | 3 flashcards, 0 scorable questions | Yes |

## Coverage notes

- AC1–AC4 are each covered, including both empty-front and empty-back partitions of AC2 (BA explicitly states "either the front or the back" — both are tested independently rather than assumed symmetric).
- Bulk import of flashcards (DEC-24, Phase 2 candidate) is out of scope for US-006 and is covered separately once [US-021](../user-stories/language-learning-quiz-app/epic-b-quiz-authoring-media/us-021-import-quiz-from-spreadsheet.md) clears Sponsor review (see Findings log — Needs Clarification).
