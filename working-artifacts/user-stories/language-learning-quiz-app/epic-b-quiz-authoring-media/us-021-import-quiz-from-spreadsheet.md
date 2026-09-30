# US-021 — Import flashcards from a spreadsheet

| Field | Value |
| --- | --- |
| Story ID | US-021 |
| Epic / Feature | Epic B — Quiz Authoring & Media / extends F-05 |
| Priority | **Could** — Phase 2 candidate, per DEC-24 ("bulk import confirmed nice-to-have") |
| Status | Draft — new, not yet reviewed with the Sponsor; grounded in DEC-24, with the proposed `.xlsx` format still pending Sponsor confirmation |
| Source | [US-006](us-006-author-flashcard.md) Out of Scope + DEC-24, [US-003](us-003-create-and-manage-quiz-draft.md) (DEC-16, DEC-26), stakeholder direction (this session): single sheet per file, max 20 rows, one quiz per import |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.8](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** language tutor,
> **I want to** import a flashcard set from a spreadsheet file instead of typing every card by hand,
> **so that** I can quickly bring in vocabulary drills I already maintain elsewhere.

## Preconditions

- I am signed in as a tutor ([US-001](../epic-a-identity-access-consent/us-001-sign-up-and-sign-in.md)).
- I have not reached my per-author quiz quota of 50 ([US-003](us-003-create-and-manage-quiz-draft.md), DEC-26).

## Import file format (confirmed: single sheet, 20-row cap, one quiz per import)

DEC-24 confirmed bulk import as a wanted capability for flashcards, but not the exact file format. The following workbook shape is still a BA proposal pending Sponsor confirmation:

- **File type:** `.xlsx` (Excel Open XML). `.xls` and `.csv` are not accepted in this story (Out of Scope).
- **One workbook = one quiz.** The file contains exactly **one sheet**, holding one row per flashcard (header row + up to 20 data rows). The `Type` column must identify each row as a flashcard:

  | Column | Required | Notes |
  | --- | --- | --- |
  | `Type` | Yes | Must be `flashcard` — any other value is rejected |
  | `Prompt` | Yes | Front text for the flashcard (≤ 1000 chars) |
  | `Back` | Yes | Back text for the flashcard (≤ 1000 chars) |
  | `Position` | No | Integer; if omitted, rows are ordered by row order |

- **Maximum 20 data rows per file** (20 flashcards per import) — an import-specific cap, tighter than the general 30-question-per-quiz limit (DEC-16). A tutor may still add more items manually after import, up to the 30 cap.
- **Quiz-level metadata is not in the sheet.** Since the file holds only question/card rows, `Title` (required, ≤ 200 chars), `Description` (optional, ≤ 2000 chars), and `Content Language` (required enum) are entered by the tutor in the import form at upload time, the same fields already collected by "+ New quiz" ([US-003](us-003-create-and-manage-quiz-draft.md)) — see AS-021.4.
- The imported quiz is always created as a **draft** ([US-003](us-003-create-and-manage-quiz-draft.md) AC1) — import never publishes directly, preserving the required author preview step (DEC-17).
- A template file link/download should be offered so tutors don't have to guess the column headers — *mockup/template file TBD*.

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-021.1 | This story covers **flashcards only**, matching DEC-24. Multiple-choice and sentence-rearrangement import are not covered here; they need separate scope decisions before being added. | If import must also support other question types, this story needs to be widened explicitly with a new decision and file format |
| AS-021.2 | Import is all-or-nothing: if any row fails validation, no quiz is created and nothing is partially saved | A partial-import mode (create the quiz, skip only the bad rows) would need different AC and a way to show which rows were skipped |
| AS-021.3 | Column headers are matched by exact name (`Type`, `Prompt`, `Back`, `Position`), case-insensitive; the workbook's single sheet is read regardless of its sheet name | A more forgiving format (any column order, fuzzy header matching) would need explicit AC |
| AS-021.4 | Quiz-level metadata (`Title`, `Description`, `Content Language`) is captured via the import form fields, not from the spreadsheet, since the file is limited to one sheet of question/card rows | If tutors expect metadata to travel with the file itself, the single-sheet constraint would need to be relaxed or metadata parsed from a fixed header block |
| AS-021.5 | If a tutor reuses a broader spreadsheet template, any MCQ-only columns such as `Option1`–`Option4` or `CorrectOptions` must be blank; this story rejects mixed-purpose rows instead of silently ignoring them | If tutors need one template that supports several question types, a different story and parser contract are needed |

## Workflow notes

- **Main flow:** tutor opens "Import quiz" → enters Title, optional Description, and Content Language in the import form → selects a single-sheet `.xlsx` file with up to 20 flashcard rows → system parses and validates the sheet → a new draft quiz is created with the form's title/description/content language, one flashcard per valid row, in the same order as the sheet → tutor is taken to the quiz editor ([US-003](us-003-create-and-manage-quiz-draft.md)) to review, edit, and eventually publish ([US-009](../epic-c-publishing-sharing/us-009-publish-quiz-publicly.md)).
- **Exception flow:** file is not `.xlsx`, has more than one sheet, is missing a required column, has a row with an invalid `Type`, has a blank `Prompt`/`Back`, has unsupported MCQ-only cells populated, has an invalid `Position`, has more than 20 rows, or the tutor is already at their 50-quiz quota (DEC-26) → import is rejected, nothing is created, and the tutor is told exactly what to fix.
- Mockup: *TBD*.

## Acceptance criteria

```gherkin
AC1: Successful import creates a draft quiz with flashcards
  Given I have entered a title and content language in the import form
  And I upload a valid single-sheet .xlsx file with 1-20 Type=flashcard rows
  When the import completes
  Then a new draft quiz is created with the form's title, description, and content language
  And each valid row becomes a flashcard, in the same order as the sheet

AC2: Reject a flashcard row with missing required content
  Given my file has a Type=flashcard row with an empty Prompt or Back cell
  When I import the file
  Then no quiz is created
  And I am told which row(s) are missing content

AC3: Reject a row with an invalid Type value
  Given my file has a row whose Type cell is not exactly flashcard
  When I import the file
  Then no quiz is created
  And I am told which row has an invalid Type

AC4: Reject a row that contains unsupported MCQ-only cells
  Given my file has a Type=flashcard row with any value in Option1, Option2, Option3, Option4, or CorrectOptions
  When I import the file
  Then no quiz is created
  And I am told which row contains unsupported data

AC5: Reject a file over the 20-row import cap
  Given my sheet has more than 20 data rows
  When I import the file
  Then no quiz is created
  And I am told the maximum is 20 items per import file

AC6: Reject import when the per-author quota is reached
  Given I already have 50 quizzes (DEC-26)
  When I attempt to import a new quiz
  Then the import is rejected before any file processing
  And I am told I have reached my quiz limit

AC7: Reject a non-.xlsx or unreadable file
  Given I upload a file that is not a valid .xlsx workbook, or select a file that is not .xlsx
  When I import the file
  Then the import is rejected
  And I am told the file could not be read

AC8: Reject a file with no data rows
  Given my sheet has a header row but no data rows
  When I import the file
  Then no quiz is created
  And I am told the file contains no items to import

AC9: Missing required column
  Given my sheet is missing the Type, Prompt, or Back column
  When I import the file
  Then no quiz is created
  And I am told which column is missing

AC10: Reject a workbook with more than one sheet
  Given my .xlsx file contains more than one sheet
  When I import the file
  Then no quiz is created
  And I am told the file must contain a single sheet

AC11: Reject a row with a non-integer Position
  Given my file has a Position value that is not an integer
  When I import the file
  Then no quiz is created
  And I am told which row has an invalid Position
```

## Out of scope

- Importing multiple-choice or sentence-rearrangement questions — no sourced decision or approved format exists for these question types in this story (AS-021.1).
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
| Feature | Extends F-05 (Flashcard); no dedicated feature ID exists for import in the Vision & Scope |
| Decisions | DEC-24 (bulk import confirmed nice-to-have, flashcards), DEC-16 (30-question-per-quiz cap, of which import fills at most 20), DEC-26 (50-quiz quota), DEC-17 (preview required before publish) |
| Dependencies | [US-003](us-003-create-and-manage-quiz-draft.md) (draft quiz creation/editing), [US-006](us-006-author-flashcard.md) (flashcard model) |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| ~~Q-021.1~~ | ~~Business~~ | ~~Is the BA-proposed file format acceptable?~~ | **Resolved (this session): single sheet per file, max 20 rows, one quiz per import — see AS-021.4 for how quiz metadata is captured.** |
| Q-021.2 | Business | Should non-flashcard import (for example sentence-rearrangement, or MCQ in a follow-up story) be added later, and if so, what does each row format look like? | Scope of any follow-up import story |
| Q-021.3 | UX | Should a downloadable template file be provided, and where in the UI does "Import quiz" live relative to "+ New quiz"? | Workflow notes, mockup |
| Q-021.4 | Data | Should partial import (skip only bad rows, keep the rest) be supported instead of all-or-nothing? | AS-021.2, AC2–AC5 (per-row validation; file-level checks AC6/AC9–AC11 would stay all-or-nothing regardless) |
