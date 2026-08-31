# User Story Backlog — Language Learning & Teaching Web App

| Field | Value |
| --- | --- |
| Source artifact | [Vision & Scope v0.8](../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |
| Scope covered | **Phase 1 (MVP)** features only — F-01 – F-16, F-21, F-22, F-23 |
| Stories | 18 (US-001 – US-018) grouped into 7 epic folders — **one story per file** |
| Version / Date | v1.1 — 2026-08-30 |
| Author / Status | BA Agent / **Draft — not refined with the team, not estimated** |
| Skill applied | `ba-generate-user-story` |

> **Not sprint-ready yet.** Every story carries open questions, and two Vision & Scope dependencies are still *gating*: **D-6** (Legal sign-off on the BA-recommended consent mechanism, DEC-12 — minimum age and retention are now set by DEC-9/DEC-13), **D-8** (CJK SME). **D-7 (moderation operating model) is now fully closed — DEC-55.** See "Readiness gates" below.
>
> **Update (2026-08-30).** Sponsor answered Q-001.1–Q-001.3 and Q-002.1–Q-002.5: minimum age **6, global** (DEC-9); identity providers **email + Google** (DEC-10); role **chosen at sign-up** (DEC-11); consent mechanism **BA-recommended, pending Legal** (DEC-12); retention **3 months** (DEC-13); consent ops owner **website admin** (DEC-14); and, critically, **Issue I-3 is now closed as a Sponsor risk-acceptance (DEC-15): no guardian consent is required on the account-free link/QR join path.** See [US-001](epic-a-identity-access-consent/us-001-sign-up-and-sign-in.md) and [US-002](epic-a-identity-access-consent/us-002-guardian-consent-for-minors.md) for the full detail.
>
> **Update (2026-08-30, cont'd).** Sponsor also answered Q-003.1–Q-003.2, Q-004.1–Q-004.2, Q-005.1–Q-005.3, and Q-006.1–Q-006.2 (DEC-16–DEC-24): quiz cap **30 questions** (DEC-16); author **preview mode required** (DEC-17); MCQ **no partial credit** (DEC-18) and **max 4 options** (DEC-19); Japanese segmentation unit **the word** (DEC-20); **distractor segments allowed** at author's discretion (DEC-21); **punctuation is part of the segment** (DEC-22); **flashcard-only quizzes allowed**, no scoring required (DEC-23); bulk flashcard import **confirmed nice-to-have**, Phase 2 (DEC-24). See [US-003](epic-b-quiz-authoring-media/us-003-create-and-manage-quiz-draft.md) through [US-006](epic-b-quiz-authoring-media/us-006-author-flashcard.md) for the full detail.
>
> **Update (2026-08-30, cont'd again).** Sponsor answered Q-007.1–Q-007.3 and descoped US-008 entirely (DEC-25–DEC-28): media formats **usual image formats + common audio formats, 2MB cap per file** (DEC-25); per-author quota **50 quizzes** (DEC-26, a quiz-count cap — not a storage-size cap); content-rights confirmation moved to **once at sign-up** (DEC-27, see [US-001](epic-a-identity-access-consent/us-001-sign-up-and-sign-in.md) AC8); and **F-08 video upload is fully descoped for Phase 1** (DEC-28), superseding its earlier "Should, first trim candidate" status — [US-008](epic-b-quiz-authoring-media/us-008-attach-video.md) is kept in the backlog but marked Descoped for audit trail.
>
> **Update (2026-08-30, final round).** Sponsor answered Q-009.1–Q-014.2 (DEC-29–DEC-45), closing every open question on US-009 through US-014 except **Q-011.3, which remains explicitly deferred** (still blocked by D-6/Legal): moderation owner **the website admin** (DEC-29, partially closes D-7 — response-time target still TBD); a new **Unlisted** visibility tier sits between Draft and Public (DEC-30); public discovery **follows seeded content**, confirming R-9's mitigation as an official decision (DEC-31); share links **do not expire** (DEC-32); a **join code** is added alongside the link/QR (DEC-33); **no attempt or time limits** per share (DEC-34); **a single active link per quiz** is sufficient (DEC-35); link rotation + participant removal is a **sufficient remedy** for a leaked link (DEC-36); **tags/topics are not required** for discovery (DEC-37); default browse order is **most played, then newest** (DEC-38); **retakes are unlimited**, every attempt recorded and visible to the tutor (DEC-39, resolves X-2); **no auto-archiving** of completed entries (DEC-40); **no post-play account-creation prompt** (DEC-41); results show **only the score**, not correct answers (DEC-42, resolves X-3); **sign-in is required** to play a quiz reached via public discovery, distinct from the account-free link/QR path (DEC-43, resolves X-1); flashcard review has **no tutor visibility** (DEC-44) and **no shuffle** (DEC-45). Two pre-existing duplicate/stale rows (US-010's restated Issue I-3, US-012's duplicate "Q-012.3") were also found and corrected during this round. See [US-009](epic-c-publishing-sharing/us-009-publish-quiz-publicly.md) through [US-014](epic-d-discovery-play/us-014-review-flashcard-set.md) for full detail.

> **Update (2026-08-30, backlog closeout).** Sponsor answered Q-015.1–Q-018.3 (DEC-46–DEC-57), closing every remaining open question in the backlog: no CSV export (DEC-46) and no written feedback channel (DEC-47) for tutors; deleting a student's account does **not** cascade-delete the tutor's copy of their responses, though the overall retention duration stays open at X-6/D-6 (DEC-48, a BA interpretation of a terse "nothing" answer — please confirm); no "who is missing" view (DEC-49) and no merge/relabel/split tool for ambiguous nicknames (DEC-50); tutor-side collections are a separate, out-of-scope need (DEC-51) and there is no default "Saved" collection (DEC-52); a dedicated formal legal/copyright report channel is **descoped** — copyright reports use the general reason categories (DEC-53) — and the reporter is not told the outcome of their report (DEC-54); and, critically, **D-7 is now fully closed (DEC-55): the website admin holds the operator role with a 2-business-day review-turnaround target**, no author appeals process is required (DEC-56), and unpublishing (not hard-delete) is sufficient for a takedown (DEC-57). See [US-015](epic-e-response-review/us-015-review-student-responses.md) through [US-018](epic-g-trust-safety/us-018-review-reports-and-take-down.md) for full detail.

> **Artifact drift — resolved.** The Vision & Scope has been updated to **v0.3** with **DEC-7** (S4 — link/QR distribution replaces roster-based assignment; supersedes A-4; D-3 no longer required for F-10) and **DEC-8** (S5 — joining needs no account; a display name is sufficient) and a new **Issue I-3** capturing the resulting consent-gate gap. F-10, F-11, M4, M5, and the glossary have been corrected accordingly.

> **Decision — Q-010.1 / X-1b resolved (S5, 2026-08-30).** Joining a shared quiz by link/QR requires **no account**: a player just enters a display name and plays. This closes the open question but **opens a new one, Issue I-3**: the guardian-consent gate mandated by DEC-3/I-1 has no mechanism to identify or restrict a minor on this account-free path. I-3 is tracked as a launch-blocking-severity issue in [US-010](epic-c-publishing-sharing/us-010-share-quiz-via-link-or-qr.md), [US-002](epic-a-identity-access-consent/us-002-guardian-consent-for-minors.md), the [Vision & Scope](../../vision-scope/language-learning-quiz-app/vision-and-scope.md), and below — it needs the same Sponsor/Legal ruling as D-6, not a BA-level answer.

---

## Backlog by epic

### Epic A — Identity, Access & Consent

*Modules M1, M9 · Features F-01, F-21 · Folder `epic-a-identity-access-consent/`*

| ID | Story | Priority | Depends on | Status |
| --- | --- | --- | --- | --- |
| US-001 | [Sign up and sign in with a role and age band](epic-a-identity-access-consent/us-001-sign-up-and-sign-in.md) | Must | — | Draft |
| US-002 | [Guardian consent for minor learners](epic-a-identity-access-consent/us-002-guardian-consent-for-minors.md) | Must | US-001 | **Draft — D-6 partially closed (DEC-9/12/13/14); mechanism pending Legal sign-off** |

### Epic B — Quiz Authoring & Media

*Modules M2, M3 · Features F-02 – F-08, F-23 · Folder `epic-b-quiz-authoring-media/`*

| ID | Story | Priority | Depends on | Status |
| --- | --- | --- | --- | --- |
| US-003 | [Create and manage a quiz draft](epic-b-quiz-authoring-media/us-003-create-and-manage-quiz-draft.md) | Must | US-001 | Draft |
| US-004 | [Author a multiple-choice question](epic-b-quiz-authoring-media/us-004-author-multiple-choice-question.md) | Must | US-003 | Draft |
| US-005 | [Author a sentence re-arrangement question with author-defined segments](epic-b-quiz-authoring-media/us-005-author-sentence-rearrangement-question.md) | Must | US-003 | **Blocked — D-8** |
| US-006 | [Author a flashcard](epic-b-quiz-authoring-media/us-006-author-flashcard.md) | Must | US-003 | Draft |
| US-007 | [Attach an image or audio clip to a question](epic-b-quiz-authoring-media/us-007-attach-image-or-audio.md) | Must | US-003, D-1 | Draft |
| US-008 | [Attach a video clip to a question](epic-b-quiz-authoring-media/us-008-attach-video.md) | ~~**Should**~~ | US-007 | **Descoped (DEC-28) — not building in Phase 1** |

### Epic C — Publishing & Sharing

*Module M4 · Features F-09, F-10 · Folder `epic-c-publishing-sharing/`*

| ID | Story | Priority | Depends on | Status |
| --- | --- | --- | --- | --- |
| US-009 | [Publish a quiz publicly](epic-c-publishing-sharing/us-009-publish-quiz-publicly.md) | Must | US-003, US-017/018 | **Draft — D-7 closed (DEC-29/DEC-55)** |
| US-010 | [Share a quiz by invitation link or QR code](epic-c-publishing-sharing/us-010-share-quiz-via-link-or-qr.md) | Must | US-003, US-001 | Draft — re-shaped by S4 |

### Epic D — Discovery & Play

*Modules M5, M6 · Features F-11 – F-13, F-16 · Folder `epic-d-discovery-play/`*

| ID | Story | Priority | Depends on | Status |
| --- | --- | --- | --- | --- |
| US-011 | [Find a quiz in the public catalogue](epic-d-discovery-play/us-011-find-a-quiz.md) | Must | US-009 | Draft |
| US-012 | [Join a quiz by invitation link or QR code](epic-d-discovery-play/us-012-join-quiz-via-link-or-qr.md) | Must | US-010 | Draft — re-shaped by S4 |
| US-013 | [Play a quiz and submit an attempt](epic-d-discovery-play/us-013-play-quiz-and-submit-attempt.md) | Must | US-004/005/007, US-009/012 | Draft |
| US-014 | [Review a flashcard set](epic-d-discovery-play/us-014-review-flashcard-set.md) | Must | US-006, US-013 | Draft |

### Epic E — Response Collection & Review

*Module M7 · Features F-13, F-14 · Folder `epic-e-response-review/`*

| ID | Story | Priority | Depends on | Status |
| --- | --- | --- | --- | --- |
| US-015 | [Review student responses to my quiz](epic-e-response-review/us-015-review-student-responses.md) | Must | US-013 | Draft |

### Epic F — Student Collections

*Module M8 · Feature F-15 · Folder `epic-f-student-collections/`*

| ID | Story | Priority | Depends on | Status |
| --- | --- | --- | --- | --- |
| US-016 | [Save quizzes into personal collections](epic-f-student-collections/us-016-save-quizzes-into-collections.md) | Must | US-011/013 | Draft |

### Epic G — Trust & Safety

*Module M9 · Feature F-22 · Folder `epic-g-trust-safety/`*

| ID | Story | Priority | Depends on | Status |
| --- | --- | --- | --- | --- |
| US-017 | [Report a public quiz](epic-g-trust-safety/us-017-report-a-public-quiz.md) | Must | US-009 | **Draft — D-7 closed (DEC-55)** |
| US-018 | [Review reports and take content down](epic-g-trust-safety/us-018-review-reports-and-take-down.md) | Must | US-017 | **Draft — D-7 closed (DEC-55)** |

> **Folder convention:** `epic-<letter>-<epic-name>/us-<nnn>-<short-kebab-name>.md` — one story per file, one folder per epic. Story IDs stay globally unique and sequential, so a story can be re-grouped without renumbering.

---

## Feature → story traceability

| Feature | Description | Stories |
| --- | --- | --- |
| F-01 | Account & role | [US-001](epic-a-identity-access-consent/us-001-sign-up-and-sign-in.md) |
| F-02 | Create & manage quiz | [US-003](epic-b-quiz-authoring-media/us-003-create-and-manage-quiz-draft.md) |
| F-03 | Multiple-choice question | [US-004](epic-b-quiz-authoring-media/us-004-author-multiple-choice-question.md) |
| F-04 | Sentence re-arrangement question | [US-005](epic-b-quiz-authoring-media/us-005-author-sentence-rearrangement-question.md), [US-013](epic-d-discovery-play/us-013-play-quiz-and-submit-attempt.md) |
| F-05 | Flashcard | [US-006](epic-b-quiz-authoring-media/us-006-author-flashcard.md), [US-014](epic-d-discovery-play/us-014-review-flashcard-set.md) |
| F-06 | Attach image | [US-007](epic-b-quiz-authoring-media/us-007-attach-image-or-audio.md) |
| F-07 | Attach audio/voice | [US-007](epic-b-quiz-authoring-media/us-007-attach-image-or-audio.md) |
| F-08 | ~~Attach video (Should)~~ | **Descoped (DEC-28)** — [US-008](epic-b-quiz-authoring-media/us-008-attach-video.md) |
| F-09 | Publish publicly | [US-009](epic-c-publishing-sharing/us-009-publish-quiz-publicly.md) |
| F-10 | Distribute to learners — **link/QR share (S4)**, not roster assignment | [US-010](epic-c-publishing-sharing/us-010-share-quiz-via-link-or-qr.md), [US-012](epic-d-discovery-play/us-012-join-quiz-via-link-or-qr.md) |
| F-11 | Find a quiz | [US-011](epic-d-discovery-play/us-011-find-a-quiz.md) (public), [US-012](epic-d-discovery-play/us-012-join-quiz-via-link-or-qr.md) (joined) |
| F-12 | Play a quiz | [US-013](epic-d-discovery-play/us-013-play-quiz-and-submit-attempt.md), [US-014](epic-d-discovery-play/us-014-review-flashcard-set.md) |
| F-13 | Submit & route responses | [US-013](epic-d-discovery-play/us-013-play-quiz-and-submit-attempt.md), [US-015](epic-e-response-review/us-015-review-student-responses.md) |
| F-14 | Author response review | [US-015](epic-e-response-review/us-015-review-student-responses.md) |
| F-15 | Student collections | [US-016](epic-f-student-collections/us-016-save-quizzes-into-collections.md) |
| F-16 | Auto-scoring for objective questions | [US-013](epic-d-discovery-play/us-013-play-quiz-and-submit-attempt.md) (scoring), [US-015](epic-e-response-review/us-015-review-student-responses.md) (display) |
| F-21 | Age & consent handling | [US-001](epic-a-identity-access-consent/us-001-sign-up-and-sign-in.md) (capture), [US-002](epic-a-identity-access-consent/us-002-guardian-consent-for-minors.md) (consent) |
| F-22 | Content reporting & takedown | [US-017](epic-g-trust-safety/us-017-report-a-public-quiz.md), [US-018](epic-g-trust-safety/us-018-review-reports-and-take-down.md) |
| F-23 | CJK-aware sentence segmentation | [US-005](epic-b-quiz-authoring-media/us-005-author-sentence-rearrangement-question.md) |
| F-17, F-18, F-19 | Notifications, duplicate quiz, analytics | **Phase 2 — not written yet** |
| ~~F-20~~ | ~~Learner voice recording~~ | **Dropped (DEC-1)** — no story |

**Coverage check:** every Phase 1 feature (§6.3 of the Vision & Scope) maps to at least one story, and every story maps back to at least one feature. No orphans in either direction.

---

## Suggested delivery order

| Slice | Stories | Demonstrable outcome |
| --- | --- | --- |
| 1 — Author a quiz | US-001, US-003, US-004, US-006 | A tutor can sign in and build a quiz with MCQ and flashcards |
| 2 — Share and play (the core loop) | US-010, US-012, US-013, US-014, US-015 | A tutor shares a QR code, a student scans it and plays, the tutor sees the responses |
| 3 — Language depth and media | US-005, US-007 | Sentence re-arrangement works in zh/ja/en; questions carry images and audio |
| 4 — Public catalogue (safety-gated) | US-009, US-011, US-016, US-017, US-018 | Quizzes are discoverable publicly with reporting and takedown in place |
| 5 — Compliance and stretch | US-002 | Minor consent enforced. **US-008/video removed — fully descoped (DEC-28), not a stretch goal** |

> **Sequencing rationale.** Slice 2 delivers the product's core value (BO-2) earliest and mitigates the cold-start risk R-9 by making link/QR sharing — not public discovery — the first working path. US-009 is deliberately not shipped before US-017/US-018 (I-2). US-002 appears late only because it is blocked on D-6; **it must be complete before any minor uses production**. **This staged sequencing is now a confirmed decision, not just a risk mitigation (DEC-31).**

---

## Readiness gates before sprint planning

| Gate | What is needed | Owner | Blocks |
| --- | --- | --- | --- |
| **D-6** | **Partially closed.** Minimum age (6, global — DEC-9) and retention (3 months — DEC-13) are set; **Legal sign-off on the BA-recommended consent mechanism (DEC-12)** is what remains | Sponsor / Legal | US-001 (AC5), US-002 entirely |
| ~~D-7~~ | ~~Moderation operating model: named owner, review turnaround, takedown authority~~ | ~~Sponsor~~ | **Resolved (DEC-29, DEC-55): website admin, 2-business-day review target. No longer blocking; retained for audit trail.** |
| **D-8** | CJK SME to confirm segment unit and grading behaviour for Chinese and Japanese | Sponsor | US-005 (highest-risk story, R-5) |
| ~~I-3~~ | ~~Sponsor/Legal ruling: is guardian consent (DEC-3/I-1) legally required on the account-free link/QR join path (S5/DEC-8)?~~ | ~~Sponsor / Legal~~ | **Resolved (DEC-15): risk accepted, no consent required. No longer blocking; retained for audit trail.** |
| **D-1** | Media storage/CDN provider selected, with size and duration caps | Solution Architect | US-007 *(US-008 no longer applies — descoped, DEC-28)* |
| ~~D-2~~ | ~~Identity providers chosen~~ | ~~Solution Architect / PO~~ | **Resolved (DEC-10): email + Google** |
| **D-5** | BO-1 – BO-5 targets set | Sponsor | Phase 1 sign-off criteria |
| **R-1** | A single named Product Owner to close the 30+ open questions in these stories | Sponsor | Refinement |

---

## Cross-cutting questions the stories could not resolve

| # | Area | Question | Affects |
| --- | --- | --- | --- |
| X-1 | ~~Access model~~ | ~~Can an anonymous visitor **play** a public quiz, or is sign-in required to attempt anything?~~ | **Resolved (DEC-43): sign-in is required for the public-discovery path; the link/QR join path (S5) remains account-free.** |
| ~~X-1b~~ | ~~Access model~~ | ~~Can someone joining by link/QR play with a nickname only (Q-010.1)?~~ | **Resolved (S5): yes, no account, display name only. See Issue I-3 for the consent-gate consequence this creates.** |
| ~~X-2~~ | ~~Attempts~~ | ~~Are multiple attempts allowed per quiz, and which one is reported to the tutor?~~ | **Resolved (DEC-39): unlimited retakes; every attempt is recorded and all are visible to the tutor.** |
| ~~X-3~~ | ~~Results~~ | ~~Does the student see the correct answers after submitting, or only their score?~~ | **Resolved (DEC-42): only the score.** |
| X-4 | Notifications | Does the share → respond loop work at all in Phase 1 without F-17 notifications? | US-010, US-012, Phase 1 scope |
| ~~X-5~~ | ~~Discovery~~ | ~~Are author-defined tags/topics needed for search to be usable at launch?~~ | **Resolved (DEC-37): no.** |
| X-6 | Data retention | How long are attempts and media retained, and what happens on account deletion? **(Partially answered: a restricted/declined minor account is purged after 3 months — DEC-13. General attempt/media retention for active accounts is still open.)** | US-015, US-002, D-6 |
| X-7 | Non-functional targets | No performance thresholds exist anywhere in the Vision & Scope; all are marked *TBD* | Every story's NFR section |

> **Recommendation.** Resolve X-4, X-6, X-7 with the Product Owner next — X-1, X-2, X-3, and X-5 are now closed (DEC-37, DEC-39, DEC-42, DEC-43).
