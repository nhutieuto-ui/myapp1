# US-021 — Import a quiz from a spreadsheet (flashcards & multiple-choice)

| Field | Value |
| --- | --- |
| Story ID | US-021 |
| Epic / Feature | Epic B — Quiz Authoring & Media / extends F-05 and F-03 |
| Priority | **Could** — Phase 2 candidate, per DEC-24 ("bulk import confirmed nice-to-have") |
| Status | Draft — new, not yet reviewed with the Sponsor; file format confirmed (single sheet, 20-row cap, flashcards + MCQ), remaining details open |
| Source | [US-006](us-006-author-flashcard.md) Out of Scope + DEC-24, [US-004](us-004-author-multiple-choice-question.md) (DEC-18, DEC-19), [US-003](us-003-create-and-manage-quiz-draft.md) (DEC-16, DEC-26), stakeholder direction (this session): single sheet per file, max 20 rows, one quiz per import, MCQ import in scope |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.8](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** language tutor,
> **I want to** import a quiz — mixing flashcards and multiple-choice questions — from a spreadsheet file instead of typing every item by hand,
> **so that** I can quickly bring in a question set I already maintain elsewhere.

## Preconditions

- I am signed in as a tutor ([US-001](../epic-a-identity-access-consent/us-001-sign-up-and-sign-in.md)).
- I have not reached my per-author quiz quota of 50 ([US-003](us-003-create-and-manage-quiz-draft.md), DEC-26).

## Import file format (confirmed: single sheet, 20-row cap, flashcards + MCQ, one quiz per import)

DEC-24 only confirmed bulk import as a wanted capability, not its format, and only for flashcards. Widening the format to also cover MCQ rows is stakeholder direction from this session, not a separate Sponsor decision — the file-shape question itself is resolved (Q-021.1), but Sponsor ratification of the widened MCQ scope is tracked separately as **Q-021.5**. Remaining details (exact column names, template) are still BA proposals pending confirmation:

- **File type:** `.xlsx` (Excel Open XML). `.xls` and `.csv` are not accepted in this story (Out of Scope).
- **One workbook = one quiz.** The file contains exactly **one sheet**, holding one row per question/card (header row + up to 20 data rows). A `Type` column tells the importer how to read the rest of the row:

  | Column | Required | Notes |
  | --- | --- | --- |
  | `Type` | Yes | `flashcard` or `mcq` — any other value is rejected |
  | `Prompt` | Yes | Front text for a `flashcard` row (≤ 1000 chars) or the question prompt for an `mcq` row (≤ 500 chars, matches [US-004](us-004-author-multiple-choice-question.md) prompt limit) |
  | `Back` | Required when `Type = flashcard`, must be blank when `Type = mcq` | ≤ 1000 characters |
  | `Option1` … `Option4` | Required when `Type = mcq` (at least `Option1`/`Option2`, up to `Option4`); must be blank when `Type = flashcard` | Text options only, no images; 2–4 options per row (`MIN_MCQ_OPTIONS`/`MAX_MCQ_OPTIONS`, DEC-19) |
  | `CorrectOptions` | Required when `Type = mcq`, must be blank when `Type = flashcard` | Comma-separated option numbers marking the correct answer(s), e.g. `1` or `1,3` — supports both single- and multi-correct MCQs ([US-004](us-004-author-multiple-choice-question.md) AS-004.1) |
  | `Position` | No | Integer; if omitted, rows are ordered by row order |

- **Maximum 20 data rows per file** (20 questions/cards per import, any mix of `flashcard`/`mcq` rows) — an import-specific cap, tighter than the general 30-question-per-quiz limit (DEC-16). A tutor may still add more items manually after import, up to the 30 cap.
- **Quiz-level metadata is not in the sheet.** Since the file holds only question/card rows, `Title` (required, ≤ 200 chars), `Description` (optional, ≤ 2000 chars), and `Content Language` (required enum) are entered by the tutor in the import form at upload time, the same fields already collected by "+ New quiz" ([US-003](us-003-create-and-manage-quiz-draft.md)) — see AS-021.4.
- The imported quiz is always created as a **draft** ([US-003](us-003-create-and-manage-quiz-draft.md) AC1) — import never publishes directly, preserving the required author preview step (DEC-17).
- A template file link/download should be offered so tutors don't have to guess the column headers — *mockup/template file TBD*.

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-021.1 | This story covers **flashcards and multiple-choice questions (MCQ)**, per stakeholder direction (this session) — widening the original DEC-24 scope, which only named flashcards. Sentence-rearrangement import is **still not** covered here; there is no sourced decision or format for it. | If sentence-rearrangement import is also wanted, that needs its own decision and format definition — do not silently extend this format to that question type |
| AS-021.2 | Import is all-or-nothing: if any row fails validation, no quiz is created and nothing is partially saved | A partial-import mode (create the quiz, skip only the bad rows) would need different AC and a way to show which rows were skipped |
| AS-021.3 | Column headers are matched by exact name (`Type`, `Prompt`, `Back`, `Option1`–`Option4`, `CorrectOptions`, `Position`), case-insensitive; the workbook's single sheet is read regardless of its sheet name | A more forgiving format (any column order, fuzzy header matching) would need explicit AC |
| AS-021.4 | Quiz-level metadata (`Title`, `Description`, `Content Language`) is captured via the import form fields, not from the spreadsheet, since the file is limited to one sheet of question/card rows | If tutors expect metadata to travel with the file itself, the single-sheet constraint would need to be relaxed or metadata parsed from a fixed header block |
| AS-021.5 | Imported MCQ options are **text-only** — an option's media attachment (AS-004.2) is not supported through import | If tutors need image options on imported questions, media would need to be attached manually afterward, or the format extended |
| AS-021.6 | Imported MCQs inherit the same scoring rules as manually authored MCQs (single- or multi-correct, no partial credit — AS-004.1/AS-004.3); import adds no new scoring behavior | N/A — this only fails if US-004's scoring rules change |

## Workflow notes

- **Main flow:** tutor opens "Import quiz" → enters Title, optional Description, and Content Language in the import form → selects a single-sheet `.xlsx` file with up to 20 rows, each marked `flashcard` or `mcq` → system parses and validates the sheet → a new draft quiz is created with the form's title/description/content language, one flashcard or MCQ per valid row, in the same order as the sheet → tutor is taken to the quiz editor ([US-003](us-003-create-and-manage-quiz-draft.md)) to review, edit, and eventually publish ([US-009](../epic-c-publishing-sharing/us-009-publish-quiz-publicly.md)).
- **Exception flow:** file is not `.xlsx`, has more than one sheet, is missing a required column, has a row with an invalid `Type`, a blank `Front`/`Back` on a flashcard row, too few/many options or no correct option on an MCQ row, has more than 20 rows, or the tutor is already at their 50-quiz quota (DEC-26) → import is rejected, nothing is created, and the tutor is told exactly what to fix.
- Mockup: *TBD*.

## Acceptance criteria

```gherkin
AC1: Successful import creates a draft quiz with mixed question types
  Given I have entered a title and content language in the import form
  And I upload a valid single-sheet .xlsx file with 1-20 rows, some Type=flashcard and some Type=mcq
  When the import completes
  Then a new draft quiz is created with the form's title, description, and content language
  And each valid row becomes a flashcard or a multiple-choice question, in the same order as the sheet

AC2: Reject a flashcard row with missing required content
  Given my file has a Type=flashcard row with an empty Prompt or Back cell
  When I import the file
  Then no quiz is created
  And I am told which row(s) are missing content

AC3: Reject an MCQ row with too few or too many options
  Given my file has a Type=mcq row with fewer than 2 filled options or more than 4 (MIN/MAX_MCQ_OPTIONS, DEC-19)
  When I import the file
  Then no quiz is created
  And I am told which row has an invalid number of options

AC4: Reject an MCQ row with no correct option marked
  Given my file has a Type=mcq row whose CorrectOptions cell is blank or references no valid option
  When I import the file
  Then no quiz is created
  And I am told which row is missing a correct answer

AC5: Reject a row with an invalid Type value
  Given my file has a row whose Type cell is not exactly flashcard or mcq
  When I import the file
  Then no quiz is created
  And I am told which row has an invalid Type

AC6: Reject a file over the 20-row import cap
  Given my sheet has more than 20 data rows
  When I import the file
  Then no quiz is created
  And I am told the maximum is 20 items per import file

AC7: Reject import when the per-author quota is reached
  Given I already have 50 quizzes (DEC-26)
  When I attempt to import a new quiz
  Then the import is rejected before any file processing
  And I am told I have reached my quiz limit

AC8: Reject a non-.xlsx or unreadable file
  Given I upload a file that is not a valid .xlsx workbook, or select a file that is not .xlsx
  When I attempt to import it
  Then the import is rejected
  And I am told the file could not be read

AC9: Reject a file with no data rows
  Given my sheet has a header row but no data rows
  When I import the file
  Then no quiz is created
  And I am told the file contains no items to import

AC10: Missing required column
  Given my sheet is missing the Type or Prompt column
  When I import the file
  Then no quiz is created
  And I am told which column is missing

AC11: Reject a workbook with more than one sheet
  Given my .xlsx file contains more than one sheet
  When I import the file
  Then no quiz is created
  And I am told the file must contain a single sheet
```

## Out of scope

- Importing sentence-rearrangement questions — no sourced decision or format exists for this question type (AS-021.1).
- MCQ options carrying media (AS-021.5) — imported options are text-only; media can be attached manually afterward ([US-007](us-007-attach-image-or-audio.md)).
- Importing media (images/audio) attached to a flashcard — text only in this story.
- `.csv` or `.xls` import, or import from Google Sheets/other tools directly.
- Partial import (creating a quiz while skipping only the invalid rows) — see AS-021.2.
- Re-importing into an *existing* draft to append/replace items — this story only creates a **new** quiz.
- A downloadable template file — recommended, but not specified as an AC pending a mockup.

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Security | Uploaded files must be parsed with a hardened library and bounded before full parsing (row/sheet/size limits) to avoid zip-bomb or resource-exhaustion attacks via a malicious `.xlsx` (OWASP) | BA recommendation — no source in Vision & Scope |
| File size | Recommend capping the upload at 2MB, aligning with the existing media cap (DEC-25) — needs Sponsor confirmation | BA recommendation, not yet a decision |
| Internationalization | Chinese/Japanese text in `Prompt`/`Back`/option cells must import without corruption (encoding-safe) | C-5 |
| Performance | Import of a 20-row file should complete without a perceptible delay; threshold *TBD* | §8 Performance (unset, same gap as other stories) |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | Extends F-05 (Flashcard) and F-03 (Multiple-choice question); no dedicated feature ID exists for import in the Vision & Scope |
| Decisions | DEC-24 (bulk import confirmed nice-to-have, flashcards), DEC-18/DEC-19 (MCQ rules and 4-option cap, extended to import by this session's stakeholder direction), DEC-16 (30-question-per-quiz cap, of which import fills at most 20), DEC-26 (50-quiz quota), DEC-17 (preview required before publish) |
| Dependencies | [US-003](us-003-create-and-manage-quiz-draft.md) (draft quiz creation/editing), [US-006](us-006-author-flashcard.md) (flashcard model), [US-004](us-004-author-multiple-choice-question.md) (MCQ model) |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| ~~Q-021.1~~ | ~~Business~~ | ~~Is the BA-proposed file format acceptable?~~ | **Resolved (this session): single sheet per file, max 20 rows, one quiz per import — see AS-021.4 for how quiz metadata is captured.** |
| Q-021.2 | Business | Should sentence-rearrangement import be added in a later story, and if so, what does that row format look like? | Scope of any follow-up import story |
| Q-021.3 | UX | Should a downloadable template file be provided, and where in the UI does "Import quiz" live relative to "+ New quiz"? | Workflow notes, mockup |
| Q-021.4 | Data | Should partial import (skip only bad rows, keep the rest) be supported instead of all-or-nothing? | AS-021.2, AC2–AC5 (per-row validation; file-level checks AC6/AC9–AC11 would stay all-or-nothing regardless) |
| Q-021.5 | Business | MCQ import was added to this story by stakeholder direction in this session, not by a recorded Sponsor decision like DEC-24 — does the Sponsor need to formally ratify AS-021.1's widened scope before this story is built? | AS-021.1, Priority |
