# US-003 — Create and manage a quiz draft

| Field | Value |
| --- | --- |
| Story ID | US-003 |
| Epic / Feature | Epic B — Quiz Authoring / F-02 |
| Priority | **Must** (Phase 1) |
| Status | Draft |
| Source | S1, F-02, BO-1, **DEC-16, DEC-17, DEC-26** |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.2](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** language tutor,
> **I want to** create a quiz, name it, and add, reorder, edit, and delete its questions while it stays a private draft,
> **so that** I can build and refine practice material in one place before anyone sees it.

## Preconditions

- I am signed in ([US-001](../epic-a-identity-access-consent/us-001-sign-up-and-sign-in.md)).

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-003.1 | A quiz is a single ordered list of questions; sections/chapters are not required in Phase 1 | Nested structure and reordering rules are added |
| AS-003.2 | A quiz may mix question types (MCQ, sentence re-arrangement, flashcard) in one list | Separate quiz types per exercise type are required, changing play and scoring |
| AS-003.3 | A quiz carries a content language (Chinese, Japanese, or English) set by the author, used for rendering and segmentation defaults (DEC-2) | Language must be inferred per question, complicating F-23 |
| **AS-003.4** | **A quiz is capped at 30 questions (DEC-16); the author can preview the quiz as a student would before publishing or sharing (DEC-17)** | If the cap is too low for real usage it must be revisited; if preview is skipped, authors publish untested quizzes |
| **AS-003.5** | **Each author is limited to 50 quizzes in total (DEC-26)** — this is a quiz-count cap, not a media storage-size cap | If a storage-size quota is also needed to bound media cost, it must be defined and enforced separately (see [US-007](../epic-b-quiz-authoring-media/us-007-attach-image-or-audio.md) Q-007.2) |

## Workflow notes

- **Main flow:** author creates a quiz → sets title, content language, optional description → adds questions ([US-004](us-004-author-multiple-choice-question.md) / [US-005](us-005-author-sentence-rearrangement-question.md) / [US-006](us-006-author-flashcard.md)) → saves → quiz remains a draft until published ([US-009](../epic-c-publishing-sharing/us-009-publish-quiz-publicly.md)) or shared by link/QR ([US-010](../epic-c-publishing-sharing/us-010-share-quiz-via-link-or-qr.md)).
- **Alternate flow:** author reorders or deletes a question; author deletes the whole quiz.
- **Exception flow:** author leaves the editor with unsaved changes.
- Mockup: *TBD*.

## Acceptance criteria

```gherkin
AC1: Create a quiz draft
  Given I am a signed-in author
  When I create a quiz with a title and a content language
  Then the quiz is saved as a draft
  And it appears in my list of quizzes with status "Draft"

AC2: Add and reorder questions
  Given I am editing a quiz draft
  When I add questions and change their order
  Then the new order is saved
  And the quiz shows the questions in that order when previewed

AC3: Edit and delete a question
  Given my quiz draft contains at least one question
  When I edit a question's content and save, or delete a question
  Then the change is persisted
  And the question count reflects the change

AC4: Title is mandatory
  Given I am creating a quiz
  And the title is empty
  When I attempt to save
  Then the quiz is not saved
  And I am told the title is required

AC5: Drafts are private
  Given I have a quiz in draft status
  When another signed-in user or an anonymous visitor attempts to open it
  Then access is denied

AC6: Only the owner can edit
  Given a quiz was created by another author
  When I attempt to edit or delete it
  Then the action is rejected

AC7: Delete a quiz
  Given I own a quiz draft
  When I delete it and confirm
  Then the quiz and its questions are removed from my list
  And it can no longer be opened

AC8: Reject adding a question beyond the maximum
  Given my quiz draft already contains 30 questions (DEC-16)
  When I attempt to add another question
  Then the question is not added
  And I am told the quiz has reached its maximum of 30 questions

AC9: Preview the quiz as a student would see it
  Given I am editing a quiz draft with at least one question
  When I open preview mode (DEC-17)
  Then I experience the quiz the way a student would play it
  And no changes are saved to the draft as a result of previewing

AC10: Reject creating a quiz beyond the per-author quota
  Given I already own 50 quizzes (DEC-26)
  When I attempt to create another quiz
  Then the quiz is not created
  And I am told I have reached my quota of 50 quizzes
```

## Out of scope

- Publishing and link/QR sharing ([US-009](../epic-c-publishing-sharing/us-009-publish-quiz-publicly.md), [US-010](../epic-c-publishing-sharing/us-010-share-quiz-via-link-or-qr.md)).
- Duplicating/reusing a quiz (F-18 — Phase 2).
- Collaborative or co-authored quizzes.
- Version history and rollback.

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Security | Server-side ownership check on every read and write | §8 Security |
| Internationalization | Titles, descriptions, and question text must store and render Chinese, Japanese, and English correctly | C-5, DEC-2 |
| Usability | Authoring is usable on desktop; mobile authoring is not optimised in Phase 1 | §3.3 |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | F-02 |
| Objective | BO-1 (time to ready-to-share quiz), BO-4 |
| Decisions | **DEC-16 (max 30 questions), DEC-17 (preview mode required), DEC-26 (max 50 quizzes per author)** |
| Dependencies | [US-001](../epic-a-identity-access-consent/us-001-sign-up-and-sign-in.md) |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| ~~Q-003.1~~ | ~~Business~~ | ~~Is there a maximum number of questions per quiz?~~ | **Resolved (DEC-16): 30 questions per quiz.** |
| ~~Q-003.2~~ | ~~UX~~ | ~~Does the author need a preview mode that plays the quiz as a student would?~~ | **Resolved (DEC-17): yes, required — see AC9.** |
