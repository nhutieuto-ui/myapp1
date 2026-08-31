# US-005 — Author a sentence re-arrangement question with author-defined segments

| Field | Value |
| --- | --- |
| Story ID | US-005 |
| Epic / Feature | Epic B — Quiz Authoring / F-04, F-23 |
| Priority | **Must** (Phase 1) — highest-risk story (R-5) |
| Status | Draft — **needs CJK SME review (D-8)** |
| Source | S1, F-04, F-23, DEC-2, A-10, C-5, R-5, **DEC-20, DEC-21, DEC-22** |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.2](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** language tutor teaching Chinese, Japanese, or English,
> **I want to** write a target sentence and define exactly which segments the learner must re-order,
> **so that** word-order practice works correctly in languages that have no spaces between words.

## Preconditions

- I am editing a quiz draft with a content language set ([US-003](us-003-create-and-manage-quiz-draft.md)).

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-005.1 | Exactly **one** segment order is correct (DEC-2) — grading is a straight sequence comparison | Multiple accepted orders require a different grading model and authoring UI |
| AS-005.2 | Segments are **author-defined** for all three languages (A-10); English may be pre-split on spaces as a convenience the author can adjust. **For Japanese, the expected default segment unit is the word, not the bunsetsu (DEC-20)**, though the author retains final control over boundaries | Automatic tokenisation for zh/ja is required — new library/service and accuracy risk |
| AS-005.3 | A segment is an opaque string; the system does not interpret grammar or morphology | Linguistic validation features are needed |
| AS-005.4 | **Punctuation is always part of the segment it belongs to (DEC-22)** — it is never a separate segment and never stripped | Punctuation-handling rules must be specified |
| **AS-005.5** | **Distractor segments — extra segments that are not part of the correct sentence — are allowed, at the author's discretion (DEC-21)** | Grading logic must exclude distractors from the required sequence rather than reject the question outright |

## Workflow notes

- **Main flow:** author enters the correct full sentence → defines segments (for English, an automatic space-split is offered and editable; for Chinese/Japanese the author marks segment boundaries explicitly, at word level for Japanese per DEC-20) → optionally adds distractor segments not part of the correct sentence (DEC-21) → previews the shuffled form → saves.
- **Alternate flow:** author adjusts segment boundaries after the initial split.
- **Exception flow:** segments do not reconstruct the target sentence; fewer than two segments defined.
- Mockup: *TBD*.

## Acceptance criteria

```gherkin
AC1: Author a sentence question in English with assisted splitting
  Given I am editing a quiz whose content language is English
  When I enter a target sentence and accept the suggested space-based split
  Then the segments are saved in the target order
  And the question is added to the quiz

AC2: Author a sentence question in Chinese or Japanese with explicit segments
  Given I am editing a quiz whose content language is Chinese or Japanese
  When I enter a target sentence and mark the segment boundaries myself
  Then the segments are saved in the target order
  And no automatic word splitting is applied

AC3: Segments must reconstruct the target sentence
  Given I have defined segments for a sentence question
  When the segments joined in the saved order do not match the target sentence
  Then the question is not saved
  And I am shown the mismatch

AC4: Reject fewer than two segments
  Given I am authoring a sentence question with only one segment
  When I attempt to save
  Then the question is not saved
  And I am told at least two segments are required

AC5: Preview the shuffled order the learner will see
  Given I have defined valid segments
  When I preview the question
  Then the segments are shown in a shuffled order
  And the shuffled order differs from the correct order when two or more distinct segments exist

AC6: Edit segments after saving
  Given a saved sentence question
  When I change the target sentence or its segments and save
  Then the updated segments and order are persisted
  And previously collected attempts remain associated with the version they were answered against

AC7: Duplicate segments are permitted
  Given a target sentence contains the same segment text twice
  When I save the question
  Then the question is saved
  And an answer matching the correct sequence positionally is graded correct

AC8: Distractor segments do not count toward the correct sequence
  Given I have added one or more distractor segments that are not part of the target sentence (DEC-21)
  When I save the question
  Then the question is saved
  And an answer is graded correct only if the non-distractor segments are placed in the correct order and the distractors are excluded
```

## Out of scope

- Multiple accepted orders (closed by DEC-2).
- Automatic Chinese/Japanese tokenisation (Phase 3 candidate).
- Grammar or morphology validation.
- System-suggested/automatic distractor generation (only author-added distractors are supported — DEC-21).

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Internationalization | Correct storage, rendering, fonts, and IME input for Chinese, Japanese, and English; character-aware handling, never byte- or space-based | C-5, DEC-2 |
| Accessibility | A non-drag alternative for ordering segments must exist | §8 Accessibility |
| Quality | zh/ja test data must exist before build completion | R-5 mitigation |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | F-04, F-23 |
| Decisions | DEC-2, **DEC-20, DEC-21, DEC-22** |
| Dependencies | **D-8 CJK SME (gating)**, [US-003](us-003-create-and-manage-quiz-draft.md) |
| Risks | R-5 (high/high) |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| ~~Q-005.1~~ | ~~Domain~~ | ~~For Japanese, is the expected segment unit the bunsetsu, the word, or author preference?~~ | **Resolved (DEC-20): the word.** |
| ~~Q-005.2~~ | ~~Business~~ | ~~Are distractor segments (extra segments not in the sentence) required?~~ | **Resolved (DEC-21): allowed, at author's discretion — see AS-005.5, AC8.** |
| ~~Q-005.3~~ | ~~Domain~~ | ~~How is punctuation handled — part of a segment, separate, or stripped?~~ | **Resolved (DEC-22): part of the segment.** |
