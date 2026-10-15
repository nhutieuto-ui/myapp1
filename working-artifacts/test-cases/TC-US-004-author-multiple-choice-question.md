# Test Cases — US-004 Author a multiple-choice question

| Field | Value |
| --- | --- |
| Source requirement | [US-004](../user-stories/language-learning-quiz-app/epic-b-quiz-authoring-media/us-004-author-multiple-choice-question.md) |
| Requirement analysis | [Findings-Requirements-Analysis-language-learning-quiz-app-phase1.md](../test-analysis-reports/Findings-Requirements-Analysis-language-learning-quiz-app-phase1.md) — Readiness: Ready |
| Scope | Functional only |
| Module prefix | `MCQ` |

| Test Case ID | Title | Test Steps | Expected Result | Requirement | Testing Technique | Priority | Preconditions | Test Data | Automation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC_MCQ_001 | Verify a single-answer MCQ can be created with a prompt, two or more options, and one correct option | 1. Open a quiz draft<br>2. Add an MCQ with a prompt and 3 options<br>3. Mark exactly one option correct<br>4. Save | Question is saved and appears at the position added | US-004 AC1 | Use Case Testing | Critical | Editing a quiz draft | Prompt: "Select the greeting"; 3 options, 1 correct | Yes |
| TC_MCQ_002 | Verify a multiple-answer MCQ can be created with more than one correct option | 1. Add an MCQ with 4 options<br>2. Mark two options correct<br>3. Save | Question is saved as multiple-answer; both correct options must be selected to score | US-004 AC2 | Use Case Testing | High | Editing a quiz draft | 4 options, 2 correct | Yes |
| TC_MCQ_003 | Verify saving an MCQ with no correct option marked is rejected | 1. Add an MCQ with 2+ options<br>2. Mark no option as correct<br>3. Attempt to save | Question is not saved; user is told at least one correct option is required | US-004 AC3 | Equivalence Partitioning | Critical | Editing a quiz draft | 0 correct options marked | Yes |
| TC_MCQ_004 | Verify saving an MCQ with only one option is rejected | 1. Add an MCQ with a single option<br>2. Mark it correct<br>3. Attempt to save | Question is not saved; user is told at least two options are required | US-004 AC4 | Boundary Value Analysis | Critical | Editing a quiz draft | 1 option | Yes |
| TC_MCQ_005 | Verify an MCQ with exactly two options (lower boundary) can be saved | 1. Add an MCQ with exactly 2 options<br>2. Mark one correct<br>3. Save | Question is saved successfully | US-004 AC4 (boundary) | Boundary Value Analysis | High | Editing a quiz draft | 2 options | Yes |
| TC_MCQ_006 | Verify the correct-option identifier is not exposed to the play client before submission | 1. Publish/share a quiz containing an MCQ<br>2. As a student, load the question via the play view/API before submitting | Returned question data does not identify which option is correct | US-004 AC5 | Negative / Data Exposure | Critical | Quiz with an MCQ is playable | — | Yes |
| TC_MCQ_007 | Verify adding a 5th option to an MCQ already at the 4-option cap is rejected | 1. Add an MCQ with 4 options already saved<br>2. Attempt to add a 5th option | Option is not added; user is told a question may have at most 4 options | US-004 AC6 (DEC-19) | Boundary Value Analysis | Critical | MCQ has exactly 4 options | 5th option payload | Yes |
| TC_MCQ_008 | Verify the 4th option (upper boundary, valid) can be added successfully | 1. Add an MCQ with 3 options<br>2. Add a 4th option | 4th option is added and saved successfully | US-004 AC6 (boundary) | Boundary Value Analysis | High | MCQ has exactly 3 options | 4th option payload | Yes |

## Coverage notes

- AC1–AC6 are each covered; AC4 and AC6 include both invalid and valid boundary cases (2-option minimum, 4-option maximum).
- Partial-credit absence (DEC-18, AS-004.3) is implicitly verified by TC_MCQ_002's expected result ("both correct options must be selected to score") and further exercised end-to-end in [TC-US-013](TC-US-013-play-quiz-and-submit-attempt.md) TC_PLAY_003 — not duplicated here as a separate authoring-time case since DEC-18 is a scoring rule, not an authoring validation rule.
