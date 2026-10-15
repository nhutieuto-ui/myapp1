# Test Cases — US-003 Create and manage a quiz draft

| Field | Value |
| --- | --- |
| Source requirement | [US-003](../user-stories/language-learning-quiz-app/epic-b-quiz-authoring-media/us-003-create-and-manage-quiz-draft.md) |
| Requirement analysis | [Findings-Requirements-Analysis-language-learning-quiz-app-phase1.md](../test-analysis-reports/Findings-Requirements-Analysis-language-learning-quiz-app-phase1.md) — Readiness: Ready |
| Scope | Functional only |
| Module prefix | `QUIZDRAFT` |

| Test Case ID | Title | Test Steps | Expected Result | Requirement | Testing Technique | Priority | Preconditions | Test Data | Automation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC_QUIZDRAFT_001 | Verify a signed-in author can create a quiz draft with a title and content language | 1. Sign in as a tutor<br>2. Select "+ New quiz"<br>3. Enter a title and choose a content language<br>4. Save | Quiz is saved with status "Draft" and appears in the author's quiz list | US-003 AC1 | Use Case Testing | Critical | Signed in as tutor | Title: "Basic Greetings"; Language: English | Yes |
| TC_QUIZDRAFT_002 | Verify questions can be added and reordered within a draft | 1. Open a quiz draft<br>2. Add two questions<br>3. Change their order<br>4. Save | New order is persisted and reflected when the quiz is previewed | US-003 AC2 | Use Case Testing | High | Quiz draft exists | 2 questions | Yes |
| TC_QUIZDRAFT_003 | Verify editing a question's content persists the change | 1. Open a quiz draft with one question<br>2. Edit the question text<br>3. Save | Updated question text is persisted | US-003 AC3 | Use Case Testing | High | Quiz draft has at least one question | — | Yes |
| TC_QUIZDRAFT_004 | Verify deleting a question reduces the question count | 1. Open a quiz draft with two questions<br>2. Delete one question | Question count decreases by one; deleted question no longer appears | US-003 AC3 | Use Case Testing | High | Quiz draft has at least two questions | — | Yes |
| TC_QUIZDRAFT_005 | Verify saving a quiz without a title is rejected | 1. Select "+ New quiz"<br>2. Leave the title empty<br>3. Attempt to save | Quiz is not saved; user is told the title is required | US-003 AC4 | Equivalence Partitioning | Critical | Signed in as tutor | Title: "" | Yes |
| TC_QUIZDRAFT_006 | Verify a draft quiz is not accessible to another signed-in user | 1. Author A creates a draft quiz<br>2. Author B (signed in) attempts to open it | Access is denied | US-003 AC5 | Access Control (Negative) | Critical | Author A owns a draft quiz; Author B signed in | — | Yes |
| TC_QUIZDRAFT_007 | Verify a draft quiz is not accessible to an anonymous visitor | 1. Anonymous visitor attempts to open a known draft quiz URL | Access is denied | US-003 AC5 | Access Control (Negative) | Critical | A draft quiz exists | — | Yes |
| TC_QUIZDRAFT_008 | Verify a non-owner cannot edit or delete another author's quiz | 1. Author B attempts to edit Author A's quiz<br>2. Author B attempts to delete Author A's quiz | Both actions are rejected | US-003 AC6 | Access Control (Negative) | Critical | Quiz owned by Author A; Author B signed in | — | Yes |
| TC_QUIZDRAFT_009 | Verify an owner can delete their own quiz draft | 1. Open own quiz draft<br>2. Select delete and confirm | Quiz and its questions are removed from the author's list and can no longer be opened | US-003 AC7 | Use Case Testing | High | Signed-in author owns a draft quiz | — | Yes |
| TC_QUIZDRAFT_010 | Verify adding a 31st question to a quiz already at the 30-question cap is rejected | 1. Open a quiz draft already containing 30 questions<br>2. Attempt to add another question | Question is not added; user is told the quiz has reached its maximum of 30 questions | US-003 AC8 (DEC-16) | Boundary Value Analysis | Critical | Quiz draft has exactly 30 questions | 31st question payload | Yes |
| TC_QUIZDRAFT_011 | Verify the 30th question can be added successfully (upper boundary, valid) | 1. Open a quiz draft containing 29 questions<br>2. Add one more question | The 30th question is added and saved successfully | US-003 AC8 (boundary) | Boundary Value Analysis | High | Quiz draft has exactly 29 questions | 30th question payload | Yes |
| TC_QUIZDRAFT_012 | Verify preview mode plays the quiz as a student would without persisting changes | 1. Open a quiz draft with at least one question<br>2. Open preview mode<br>3. Exit preview without further edits | Quiz is experienced as a student would play it; no changes are saved to the draft as a result of previewing | US-003 AC9 (DEC-17) | Use Case Testing | Medium | Quiz draft has at least one question | — | No |
| TC_QUIZDRAFT_013 | Verify creating a 51st quiz when the author already owns 50 is rejected | 1. As an author who already owns 50 quizzes, select "+ New quiz"<br>2. Attempt to save a new quiz | Quiz is not created; author is told they reached their quota of 50 quizzes | US-003 AC10 (DEC-26) | Boundary Value Analysis | Critical | Author already owns exactly 50 quizzes | — | Yes |
| TC_QUIZDRAFT_014 | Verify the 50th quiz can be created successfully (upper boundary, valid) | 1. As an author who owns 49 quizzes, select "+ New quiz"<br>2. Save a new quiz | The 50th quiz is created successfully | US-003 AC10 (boundary) | Boundary Value Analysis | High | Author owns exactly 49 quizzes | — | Yes |

## Coverage notes

- AC1–AC10 are each covered; AC8 and AC10 receive both the invalid (31st/51st) and valid (30th/50th) boundary per Boundary Value Analysis guidance.
- Mixing question types in one quiz (AS-003.2) is exercised indirectly via [TC-US-004](TC-US-004-author-multiple-choice-question.md) and [TC-US-006](TC-US-006-author-flashcard.md), which add questions into drafts created here — no separate case is duplicated in this file to avoid redundancy.
