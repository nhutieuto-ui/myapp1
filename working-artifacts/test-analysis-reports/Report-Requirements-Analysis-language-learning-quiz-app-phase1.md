# Requirement Analysis Report — Language Learning & Teaching Web App, Phase 1 Backlog

| Field | Value |
| --- | --- |
| Analyzed by | Test Agent (`testing-analyze-requirements` skill) |
| Scope | `working-artifacts/user-stories/language-learning-quiz-app/` — US-001–US-021 (21 story files, 7 epics), cross-checked against the [backlog index](../user-stories/language-learning-quiz-app/README.md) and [Vision & Scope v0.8](../vision-scope/language-learning-quiz-app/vision-and-scope.md) references embedded in each story |
| Date | 2026-10-06 |
| Companion artifact | [Findings-Requirements-Analysis-language-learning-quiz-app-phase1.md](Findings-Requirements-Analysis-language-learning-quiz-app-phase1.md) (per-story findings log) |

---

## 1. Requirement Summary

- **Requirement ID:** US-001–US-021 (Phase 1 MVP backlog; US-008 is in-backlog but formally descoped)
- **Feature/Module:** Full product — identity/consent (Epic A), authoring/media (Epic B), publishing/sharing (Epic C), discovery/play (Epic D), response review (Epic E), student collections (Epic F), trust & safety (Epic G)
- **Source Document:** Vision & Scope v0.8 → this backlog (v1.3, 2026-09-28), authored via `ba-generate-user-story`
- **Business Goal:** Let independent language tutors (zh/ja/en) author quizzes and flashcards, distribute them to learners mainly via link/QR (and secondarily via a public catalogue), auto-score objective questions, and let tutors review responses — while keeping minors' data lawful and the catalogue safe (BO-1–BO-5 in the Vision & Scope).

This is **not a single requirement** but a 21-story backlog that already carries an unusually high degree of self-documented rigor: 57 numbered Sponsor decisions (DEC-1–DEC-57), explicit assumption IDs, risk/issue IDs, and an open-question ledger per story. The analysis below treats the backlog as a whole and calls out individual stories where risk concentrates.

---

## 2. Completeness Assessment

**Complete areas (backlog-wide):**
- Story format: every story has ID, epic/feature mapping, priority, status, story statement, preconditions, assumptions (with impact-if-wrong), workflow (main/alternate/exception), Gherkin ACs, out-of-scope, NFR table, traceability, and open-questions log — all 11 sections are present in all 21 files.
- Business rule quantification: numeric caps are defined and consistent across stories (30 questions/quiz — DEC-16; 4 options/MCQ — DEC-19; 50 quizzes/author — DEC-26; 2MB/file, specific formats — DEC-25; 20 rows/import — US-021; 3-month retention for restricted minor accounts — DEC-13; 2-business-day moderation SLA — DEC-55).
- Access control is explicit and testable in almost every story (owner-only edit/delete, server-side authorization, private-by-default content) — this gives strong raw material for security/authorization test cases (OWASP A01).
- Negative/exception flows and boundary ACs are present for nearly every story (e.g., US-003 AC8/AC10, US-004 AC3/AC4/AC6, US-021 AC2–AC11).
- Feature → story traceability is complete with no orphans in either direction (confirmed by the backlog index's own coverage check).

**Missing areas (backlog-wide, confirmed by direct reading, not merely restating the backlog's own open-question ledger):**
- **No performance/NFR thresholds exist anywhere.** Every story's Performance row says "threshold *TBD*." This is called out by the backlog itself as cross-cutting question **X-7** — my independent read confirms it is total: not one of the 21 stories has a measurable latency, throughput, or load target. **This blocks writing any pass/fail performance test case today.**
- **No product-wide accessibility conformance target is defined.** Individual stories reference "§8 Accessibility" or state keyboard/screen-reader requirements, but no story (nor, per US-020's own admission, the Vision & Scope) states a WCAG level (e.g., 2.2 AA). Accessibility ACs are directional ("must be keyboard operable") rather than measurable.
- **US-002 AC5** ("consent request expires... the window elapses") references a "configured window" whose duration is never stated anywhere in the story, the decision log, or the backlog index. This is a genuine gap the backlog's own open-question ledger did not catch (all of US-002's questions show as resolved).
- **Rate-limiting / abuse-mitigation is uneven.** It is explicitly required for US-010 (join-token guessing), US-012, and US-017 (anonymous reporting), but is an **open, unresolved question** for the one story with the highest account-takeover exposure, **US-019** (password reset) — Q-019.2 is unresolved.
- **Two stories are explicitly not yet Sponsor-reviewed** (US-020, US-021) and carry multiple unresolved open questions each; they should not be treated as equally final as the other 19.

---

## 3. Quality Assessment

**Clarity:** High. Acceptance criteria are in consistent Gherkin, each with a single Given/When/Then and an observable outcome. Vague terms flagged by the ambiguity checklist (quickly, easily, appropriate, efficient, etc.) are rare, and where a vague NFR term does appear (e.g., "feel instant," "quickly"), the story itself already flags the threshold as TBD rather than presenting it as a settled requirement — this is good self-awareness but does not resolve the gap.

**Consistency:** High, with a few residual cross-story tensions worth tracking rather than treating as defects:
- The product has **two distinct access models that must not be conflated in test design**: (a) account-free link/QR join (S5/DEC-8) with no identity verification and no consent gate (DEC-15, risk-accepted), vs. (b) public-catalogue play, which requires sign-in (DEC-43). US-013 correctly encodes both (AC1/AS-013.5 vs AC13/AS-013.7), but any shared "play" component in the codebase must not silently apply one path's rule to the other.
- Minor-safety posture is **split across two independent controls that do not cover the same surface**: guardian consent (US-002, account path only) and age-floor-6 + public-catalogue sign-in (US-001 AC5, DEC-43). Neither control reaches an unauthenticated link/QR joiner who is, in practice, unidentifiable by age. This is a known, Sponsor-accepted residual risk (I-3/DEC-15), not a contradiction — but it means **no test case can assert "minors are prevented from joining via link/QR,"** because that is explicitly not built. Test design must assert the absence of an age gate on that path as the expected (accepted-risk) behavior, not flag it as a bug.
- DEC-39 (unlimited retakes, every attempt visible) interacts with DEC-50 (no tool to merge/relabel/split ambiguous display names) — the tutor-facing response list will, by design, show unverified, possibly duplicate "John" entries with no disambiguation tool. This is confirmed intentional scope, but testers should not raise it as a defect when response lists show same-named, unlinked entries.

**Testability:** High for functional ACs (nearly all are independently verifiable with clear preconditions and expected results). **Low to Not Yet Testable for non-functional requirements** (performance, and accessibility conformance level) because no measurable target exists anywhere in the backlog — see §4 and §9.

---

## 4. Missing Information

| Item | Impact |
| --- | --- |
| Performance thresholds (latency, throughput, concurrent-user targets) — absent from all 21 stories | No performance test can have an objective pass/fail gate; blocks `performance-analyze-requirements` downstream until the Product Owner/Solution Architect sets targets (owner already named as "Solution Architect" in several stories, but no values exist) |
| WCAG conformance level (e.g., 2.2 AA) — absent product-wide | Accessibility test cases can verify keyboard operability and screen-reader labeling directionally, but cannot certify a conformance level; `testing-accessibility-testing` checklist results will be "partially applicable" rather than pass/fail |
| Guardian-consent request expiry window (US-002 AC5) — no duration given | Cannot write a deterministic test for "window elapses"; must be raised as a new clarification question (see §8) |
| US-019 (password reset) production-readiness decision — Q-019.1 unresolved | Release-readiness gate must stay **Blocked** for any non-dev environment until Sponsor/Security formally accepts or mitigates the account-takeover risk (see §9) |
| D-6 (Legal sign-off on guardian-consent mechanism, DEC-12) — still open | US-002 is fully gated; US-001 AC5's enforcement detail and Q-011.3 (minor access to public catalogue) also remain downstream of this |
| D-8 (CJK SME review) — still open | US-005, the backlog's own designated highest-risk story (R-5, high/high), cannot be considered final until a domain expert confirms Japanese word-level segmentation and zh/ja grading behavior |
| US-020 and US-021 Sponsor review | Both are explicitly marked "new, not yet reviewed with the Sponsor" with multiple open questions each; treat as **Draft, not Ready**, distinctly from the other 19 stories |

---

## 5. Ambiguities and Conflicts

| Statement | Why Ambiguous/Conflicting | Impact |
| --- | --- | --- |
| US-002 AC5: "a consent request has been pending longer than the configured window" | "Configured window" has no stated value anywhere in the story, Vision & Scope excerpt, or decision log | Cannot design a deterministic boundary test (e.g., window − 1 min vs window + 1 min) until a number exists |
| Multiple NFR rows: "should feel instant," "should begin playback quickly," "without a perceptible delay" (US-007, US-010, US-011, US-013, US-020, US-021) | Subjective/unquantified performance language, flagged `TBD` by the stories themselves | Confirms X-7 is systemic, not a one-off oversight; these are placeholders, not requirements, until quantified |
| US-009 AC2 / AC1: "contains a question that fails its own validation rules" (what counts as publish-blocking) | Each question type's own validity rules (US-004 AC3/4/6, US-005 AC3/4, US-006 AC2) are defined per type but US-009 does not enumerate them centrally | Low impact — test design can derive the combined rule set from the referenced stories, but a single authoritative "quiz is publishable when…" checklist would reduce ambiguity for both dev and test |
| I-3 / DEC-15 (no consent gate on link/QR join) vs. DEC-9 (global minimum age 6) | Not a documentation conflict (both are explicit, cross-referenced, Sponsor-approved decisions) but a **functional conflict in the product's actual safety posture**: the stated minimum age of 6 is enforceable only on the account path, not the link/QR path | Must be represented in the test suite as a documented, accepted gap (a specific "known limitation" test note), not treated as an untested gray area |

---

## 6. Assumptions

Only the assumptions with the highest downstream test-design impact are restated here (the full per-story assumption ledger in each file is already complete and does not need duplication):

| Assumption | Rationale | Risk if Incorrect |
| --- | --- | --- |
| AS-019.1 (US-019): password reset performs no ownership verification of the submitted email | Explicit Sponsor direction to simplify the flow | If this assumption is later reversed (identity verification added), most of US-019's current AC set (AC1, AC2, AC5) would need to be rewritten and re-tested from scratch — recommend not investing in deep automation for this flow until Q-019.1 is resolved |
| AS-010.4 / AS-012.5 (link/QR join needs no account): a display name is sufficient identification | S5, confirmed Sponsor decision | Already stable (multiple decisions reaffirm it); low re-work risk |
| AS-020.3 (US-020): "Continue learning" cannot show real progress because `attempt` has no `userId`/in-progress state | Verified directly against the schema reference the story itself cites | Correctly scoped out of AC (AC6 is negative-only); testers must confirm no "Resume" UI exists that implies unbuilt capability — this is a good candidate for a specific negative/regression test |

---

## 7. Dependencies

| Dependency | Owner/System | Risk |
| --- | --- | --- |
| **D-6** — Legal sign-off on guardian-consent mechanism (DEC-12) | Sponsor/Legal | Gates US-002 entirely; also leaves US-001 AC5 and Q-011.3 (minor access to public catalogue) unsettled. Highest-priority legal dependency in the backlog. |
| **D-8** — CJK SME review | Sponsor | Gates sign-off on US-005, the backlog's own highest-complexity/highest-risk story (R-5) |
| **D-1** — Media storage/CDN provider and caps | Solution Architect | Gates US-007's non-functional guarantees (though functional ACs are already testable against the stated 2MB/format caps) |
| US-009/US-017/US-018 must ship together (I-2) | Product/Release management | A test plan must never exercise public-publish ACs in an environment where reporting/takedown (US-017/018) is absent — recommend a release-gate test asserting all three are deployed together |
| US-019 (new, unnumbered) — Sponsor/Security sign-off on account-takeover risk | Sponsor/Security | Blocks production rollout of password reset; does not block test-case authoring, which can and should proceed now using the current (risky) design as written |

---

## 8. Clarification Questions

Only genuinely **unresolved** items are listed (the backlog's own ledger already resolves ~90% of raised questions via DEC-1–DEC-57; re-listing resolved ones would not be useful). Numbered for response tracking:

1. **(New — raised by this analysis)** What is the exact duration of the "configured window" for a pending guardian-consent request (US-002 AC5)? No value exists today.
2. **(Existing, Q-019.1)** Is the simplified, no-identity-verification password-reset flow (US-019) acceptable for real users, or restricted to dev/staging until a verification step is added?
3. **(Existing, Q-019.2)** Should rate limiting/CAPTCHA be added to the password-reset flow despite its simplified design?
4. **(Existing, Q-011.3, deferred)** Should the public catalogue be reachable by unauthenticated minors, or gated behind sign-in? Still blocked on D-6.
5. **(Existing, X-7)** What are the performance/NFR thresholds (latency, throughput, concurrency) for the product, referenced as TBD in every story?
6. **(Existing, implicit)** What WCAG conformance level is targeted product-wide? No story or the Vision & Scope states one.
7. **(Existing, Q-020.1–Q-020.4)** For US-020 (home dashboard): is attempt-to-learner linkage in scope, is gamification wanted at all, should tutors see a different dashboard, and is this screen a Phase 1 priority?
8. **(Existing, Q-021.2–Q-021.4)** For US-021 (spreadsheet import): is non-flashcard import wanted later, is a template file needed, and is partial (per-row) import wanted instead of all-or-nothing?
9. **(Existing, D-8)** CJK SME confirmation of Japanese word-level segmentation and zh/ja grading behavior for US-005.

---

## 9. Testing Risks

**High**
- **US-019 (reset forgotten password):** self-identified critical account-takeover exposure (no proof of email ownership). Must be security-tested explicitly as a *known-vulnerable* flow and must not reach production without an explicit, recorded risk acceptance or a redesign. Maps to OWASP A07 (Identification & Authentication Failures) and A04 (Insecure Design).
- **US-005 (sentence re-arrangement, CJK):** backlog's own highest risk (R-5, high/high); blocked on D-8; requires zh/ja native-speaker test data before any grading-accuracy test can be trusted.
- **US-002 (guardian consent):** legally gating (D-6); the undefined consent-window duration (§5) blocks a deterministic expiry test today.
- **Cross-cutting NFR gap (X-7):** with no performance targets anywhere, no story can receive a load/soak/spike pass/fail verdict; this risk applies to the entire backlog equally, not one story.
- **Residual minor-safety gap (I-3/DEC-15):** accepted by Sponsor, but must be represented as an explicit, documented test case ("link/QR join does not and is not expected to gate by age") so it is never mistaken for an untested gap in a future audit.

**Medium**
- **US-009/US-017/US-018 release coupling (I-2):** moderate process risk if a release pipeline allows publish to ship without reporting/takedown.
- **US-015 retention ambiguity (X-6):** general attempt/media retention duration for active (non-restricted) accounts is still open; affects data-lifecycle and right-to-erasure test design.
- **US-011 Q-011.3 (deferred):** low functional impact today (current rule: browse without sign-in, sign-in required to play), but unresolved status should be tracked, not silently assumed closed.
- **US-020, US-021 (Sponsor-unreviewed):** scope could still change; recommend drafting test cases but holding off on investment in automation until Sponsor confirms.
- **Accessibility conformance level undefined:** cannot certify compliance; can only verify directional keyboard/screen-reader behavior.

**Low**
- The remaining 13 "Must," fully-resolved stories (US-001, US-003, US-004, US-006, US-007, US-009, US-010, US-012, US-013, US-014, US-016, US-017, US-018) have clear, numerically bounded, Gherkin-ready ACs with resolved decisions and no open blocking questions. These are the best candidates for early, high-confidence automated test-case development.

---

## 10. Readiness Decision

**Status: Needs Clarification (backlog-wide), with a Ready subset.**

| Readiness | Stories |
| --- | --- |
| **Ready for test-case design now** | US-001, US-003, US-004, US-006, US-007, US-009, US-010, US-012, US-013, US-014, US-016, US-017, US-018 (13 stories) |
| **Needs Clarification before sign-off (but test-case drafting can proceed with assumptions flagged)** | US-002 (D-6 + undefined consent window), US-005 (D-8), US-011 (Q-011.3 deferred), US-015 (X-6 retention), US-019 (critical security sign-off), US-020 (Sponsor-unreviewed), US-021 (Sponsor-unreviewed) (7 stories) |
| **Excluded from test design** | US-008 (formally descoped, DEC-28) — do not author test cases; add a guard check that no video-upload UI/endpoint has been inadvertently implemented |

**Rationale:** The backlog is exceptionally mature for a Draft-status artifact — the vast majority of ambiguity has already been closed through 57 recorded Sponsor decisions, and acceptance criteria are consistently Gherkin-formatted and independently verifiable. The remaining gaps are concentrated, known, and already tracked by the backlog's own authors (D-6, D-8, X-6, X-7) plus two additional gaps this analysis surfaced (the undefined US-002 consent window, and the absence of any WCAG target). None of the gaps invalidate the 13 "Ready" stories; they should not block starting `testing-design-test-case` for that subset while clarifications are sought for the remaining 7.

---

## 11. Recommendations

**Immediate actions:**
1. Proceed to `testing-design-test-case` for the 13 Ready stories; prioritize the Slice 1–2 delivery order already defined in the backlog index (US-001, US-003, US-004, US-006 → US-010, US-012, US-013, US-014, US-015 — note US-015 needs its retention caveat flagged but is otherwise testable).
2. Raise clarification question #1 above (consent-window duration) back to the BA/Sponsor before finalizing US-002 test cases.
3. Escalate US-019 (Q-019.1) as a release-blocking security decision — recommend restricting this flow to non-production environments in the test environment matrix until a decision is recorded.
4. Treat US-020 and US-021 as **draft-only**: produce test case skeletons but do not invest in automation until Sponsor review closes their open questions.

**Follow-up actions:**
1. Request numeric NFR targets (X-7) from the Solution Architect/Sponsor before `performance-analyze-requirements` can produce a meaningful PRD for this product.
2. Request a product-wide WCAG conformance target before `testing-accessibility-testing` can issue a pass/fail verdict rather than a directional checklist result.
3. Track D-6 and D-8 resolution; re-run this analysis for US-002, US-001 (AC5), US-011 (Q-011.3), and US-005 once Legal/CJK SME input lands.
4. Record the I-3/DEC-15 residual minor-safety gap explicitly in the test plan as an accepted-risk, expected-behavior test case rather than leaving it implicit.
