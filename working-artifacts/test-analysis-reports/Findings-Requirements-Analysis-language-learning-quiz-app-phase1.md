# Findings Log — Requirements Analysis: Language Learning & Teaching Web App, Phase 1 Backlog

Companion to [Report-Requirements-Analysis-language-learning-quiz-app-phase1.md](Report-Requirements-Analysis-language-learning-quiz-app-phase1.md). One row per story; checklist reference is `references/checklists/requirement-review-checklist.md` (13 sections). Ratings: **Pass** (meets the gate), **Partial** (meets most, gap noted), **Open** (unresolved blocker).

| Story | Business Value & AC Quality | Testability | Key Gap(s) Found | Readiness |
| --- | --- | --- | --- | --- |
| US-001 Sign up and sign in | Pass — 8 ACs, all resolved decisions (DEC-9/10/11/27) | Pass | AC5 enforcement detail still downstream of D-6 Legal sign-off, but the age-6 floor itself is testable now | Ready |
| US-002 Guardian consent for minors | Partial — 7 ACs, clear state machine (restricted → active/declined/purged) | Partial | **Consent-request expiry "window" (AC5) has no stated duration anywhere** (new finding); D-6 Legal sign-off on mechanism still open | Needs Clarification |
| US-019 Reset forgotten password | Pass on AC clarity (6 ACs, enumeration-safe design) — **Fail on security-by-design** | Pass (functionally testable), but release-readiness gate fails | Self-flagged critical account-takeover risk (no proof of email ownership); Q-019.1/Q-019.2 unresolved; F-24 not yet added to Vision & Scope (traceability gap) | Needs Clarification — **security sign-off required before non-dev use** |
| US-003 Create/manage quiz draft | Pass — 10 ACs, numeric caps (30 Q/quiz, 50 quiz/author) fully resolved | Pass | None blocking | Ready |
| US-004 Author MCQ | Pass — 6 ACs, DEC-18/19 resolved | Pass | None blocking | Ready |
| US-005 Author sentence re-arrangement | Pass on AC clarity (8 ACs) — **Open on domain validation** | Partial | **D-8 CJK SME review still pending** — backlog's own highest risk (R-5 high/high); grading accuracy for zh/ja cannot be certified without SME-reviewed test data | Needs Clarification |
| US-006 Author flashcard | Pass — 4 ACs, DEC-23/24 resolved | Pass | None blocking | Ready |
| US-007 Attach image/audio | Pass — 8 ACs, DEC-25/26/27 resolved | Pass | Performance threshold TBD (part of systemic X-7 gap, not story-specific) | Ready (functional); NFR gap noted |
| US-008 Attach video | N/A — formally descoped (DEC-28) | N/A | Retained for audit trail only | **Excluded — do not test** |
| US-021 Import flashcards from spreadsheet | Pass on AC clarity (11 ACs, strong negative-path coverage) — **Open on Sponsor review** | Pass functionally | Not yet Sponsor-reviewed; Q-021.2–Q-021.4 open (non-flashcard import, template file, partial-import mode); file-size-cap and zip-bomb mitigation are BA recommendations, not yet decisions | Needs Clarification (draft test cases only) |
| US-009 Publish quiz publicly | Pass — 8 ACs, D-7 fully closed (DEC-29/55) | Pass | None blocking; must test alongside US-017/018 per I-2 coupling | Ready |
| US-010 Share via link/QR | Pass — 10 ACs, DEC-32–36 resolved | Pass | Residual I-3/DEC-15 risk (no age gate on this path) must be tested as accepted behavior, not a defect | Ready (with documented residual-risk test note) |
| US-011 Find a quiz (catalogue) | Pass — 6 ACs, DEC-37/38/43 resolved | Partial | Q-011.3 deferred (minor accessibility of catalogue) — current rule (browse open, sign-in to play) is testable, but status is open, not closed | Ready (current rule), flag deferred question |
| US-012 Join via link/QR | Pass — 11 ACs, DEC-39/40/41 resolved | Pass | None blocking | Ready |
| US-013 Play quiz/submit attempt | Pass — 13 ACs, DEC-39/42/43 resolved | Pass | None blocking; this is the core-loop story — recommend highest automation priority | Ready |
| US-014 Review flashcard set | Pass — 5 ACs, DEC-44/45 resolved | Pass | None blocking | Ready |
| US-020 View home dashboard | Partial — 7 ACs, but explicitly incomplete by design (positive "resume" case intentionally omitted) | Partial | Not yet Sponsor-reviewed; Q-020.1–Q-020.4 open (data model, gamification, role-based rendering, priority); recommend a specific negative test confirming no misleading "Resume" UI exists | Needs Clarification (draft test cases only) |
| US-015 Review student responses | Pass — 7 ACs, DEC-46–50 resolved | Partial | General attempt/media retention duration for active accounts still open (X-6); does not block functional test design | Ready (functional), flag data-retention gap |
| US-016 Save quizzes to collections | Pass — 7 ACs, DEC-51/52 resolved | Pass | None blocking | Ready |
| US-017 Report a public quiz | Pass — 6 ACs, DEC-53/54 resolved | Pass | None blocking | Ready |
| US-018 Review reports/take down | Pass — 7 ACs, DEC-55/56/57 resolved (D-7 fully closed) | Pass | None blocking | Ready |

---

## Cross-Cutting Findings (apply to multiple/all stories)

| # | Finding | Affected Stories | Checklist Section | Severity |
| --- | --- | --- | --- | --- |
| CF-1 | No performance/NFR thresholds (latency, throughput, concurrency) exist in any story | All 20 active stories | §10 Non-Functional Requirements | High — blocks performance test pass/fail criteria entirely |
| CF-2 | No product-wide WCAG conformance level is defined | All 20 active stories | §10 Non-Functional Requirements | Medium — blocks accessibility certification, directional testing still possible |
| CF-3 | Two independently valid but non-overlapping minor-safety controls (guardian consent on account path; no gate on link/QR path) must be tested as distinct, non-conflicting rule sets | US-001, US-002, US-010, US-012, US-013 | §6 Business Rules and Constraints | Medium — documented, Sponsor-accepted; risk is a future misunderstanding during test design, not a product defect |
| CF-4 | US-020 and US-021 are explicitly not yet Sponsor-reviewed | US-020, US-021 | §1 Story Basics / §12 Risk and Readiness | Medium — do not treat on par with the other 19 stories for sign-off purposes |
| CF-5 | Rate limiting is required/assumed for some abuse-prone anonymous flows (US-010, US-012, US-017) but left as an open question for the flow with the highest account-takeover exposure (US-019) | US-019 | §8 Error Handling and Recovery / §10 NFR (Security) | High (specific to US-019; part of the same story-level finding already logged above) |
| CF-6 | Consent-request expiry window (US-002 AC5) has no stated duration | US-002 | §5 Acceptance Criteria Quality (quantitative values) | Medium |

---

## Self-Review (against `requirement-review-checklist.md`)

- [x] Story basics, business value, actors/permissions reviewed for all 21 files.
- [x] Functional scope, AC quality, business rules, data/validation, error handling reviewed for all 21 files.
- [x] Dependencies/integrations and NFRs reviewed; systemic gaps (CF-1, CF-2) identified and not buried in individual story rows.
- [x] Traceability and testability assessed; readiness decision stated per story, not just at the backlog level.
- [x] Ambiguity checklist applied — only genuine unquantified/vague terms are flagged (consent window, NFR "instant/quickly" language); resolved items from the backlog's own decision log are not re-flagged as ambiguous.
- [x] All clarification questions are either newly raised (with clear rationale) or explicitly traced to an existing open item in the backlog — none invented without basis.

No applicable check failed; report and findings are ready to hand off to `testing-design-test-case` for the Ready subset.
