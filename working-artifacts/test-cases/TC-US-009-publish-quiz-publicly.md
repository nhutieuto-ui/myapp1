# Test Cases — US-009 Publish a quiz publicly

| Field | Value |
| --- | --- |
| Source requirement | [US-009](../user-stories/language-learning-quiz-app/epic-c-publishing-sharing/us-009-publish-quiz-publicly.md) |
| Requirement analysis | [Findings-Requirements-Analysis-language-learning-quiz-app-phase1.md](../test-analysis-reports/Findings-Requirements-Analysis-language-learning-quiz-app-phase1.md) — Readiness: Ready |
| Scope | Functional only |
| Module prefix | `PUBLISH` |

| Test Case ID | Title | Test Steps | Expected Result | Requirement | Testing Technique | Priority | Preconditions | Test Data | Automation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC_PUBLISH_001 | Verify a valid draft quiz can be published as Public | 1. Open a draft quiz containing at least one valid question<br>2. Select publish as Public<br>3. Confirm the content-rights and visibility statement | Quiz status becomes "Published"; it is discoverable and playable by any visitor | US-009 AC1 | Use Case Testing | Critical | Quiz draft has at least one valid question | — | Yes |
| TC_PUBLISH_002 | Verify publishing an empty quiz (no questions) is blocked | 1. Open a draft quiz with zero questions<br>2. Attempt to publish | Quiz is not published; author is told the quiz has no questions | US-009 AC2 | Equivalence Partitioning | Critical | Quiz draft exists with no questions | — | Yes |
| TC_PUBLISH_003 | Verify publishing a quiz containing an invalid question is blocked and the blocking question is identified | 1. Open a draft quiz that contains one question failing its own validation rules (e.g. an MCQ with no correct option)<br>2. Attempt to publish | Quiz is not published; author is shown which question(s) block publication | US-009 AC2 | Equivalence Partitioning | High | Quiz draft contains one invalid question | MCQ with 0 correct options marked | Yes |
| TC_PUBLISH_004 | Verify unpublishing a quiz removes it from discovery and play | 1. Publish a quiz<br>2. Unpublish it | Quiz no longer appears in public discovery; it can no longer be started by anyone; previously submitted attempts remain visible to the author | US-009 AC3 | State Transition Testing | High | Quiz is currently published | — | Yes |
| TC_PUBLISH_005 | Verify a non-owner cannot publish or unpublish another author's quiz | 1. Sign in as Author B<br>2. Attempt to publish or unpublish a quiz owned by Author A | Action is rejected | US-009 AC4 | Access Control (Negative) | Critical | Quiz owned by Author A; Author B signed in | — | Yes |
| TC_PUBLISH_006 | Verify a published quiz exposes no personal data to an unauthenticated visitor | 1. As an anonymous visitor, open a published quiz | Only quiz content and the author's display name are visible; no author email, student identity, or attempt data is returned | US-009 AC5 | Negative / Data Exposure | Critical | A quiz is published | — | Yes |
| TC_PUBLISH_007 | Verify the author's acceptance of the content-rights/acceptable-use statement is recorded at publish time | 1. Open a valid draft quiz<br>2. Publish it, confirming the visibility statement | Acceptance is recorded against the quiz/account with a timestamp | US-009 AC6 | Use Case Testing | Medium | Quiz draft has at least one valid question | — | No |
| TC_PUBLISH_008 | Verify an in-progress attempt can still be submitted after the author unpublishes the quiz, but no new attempt can start | 1. As a student, start an attempt on a published quiz<br>2. As the author, unpublish the quiz while the attempt is in progress<br>3. As the student, submit the in-progress attempt<br>4. As a different visitor, attempt to start a new attempt on the quiz | The in-progress attempt is accepted; the new-attempt attempt is rejected | US-009 AC7 | State Transition Testing | High | Quiz is published; a student attempt is in progress | — | Yes |
| TC_PUBLISH_009 | Verify a quiz can be published as Unlisted, reachable by direct link but absent from public search/browse | 1. Open a valid draft quiz<br>2. Publish it as Unlisted instead of Public<br>3. As a visitor holding the direct link, open the quiz<br>4. As a visitor using public search/browse, search for the quiz | Visitor with the direct link can play the quiz; the quiz does not appear in public search or browse results | US-009 AC8 (DEC-30) | Use Case Testing | High | Quiz draft has at least one valid question | — | Yes |

## Coverage notes
- AC1–AC8 are each covered by at least one test case.
- TC_PUBLISH_007 is marked Automation = No because it validates an audit/timestamp record rather than observable UI/API behavior best suited to a quick manual data check in this phase.
- Pre-publication moderation/screening and licensing/attribution are explicitly out of scope per the story and are not covered here.
- Cross-reference: TC_PUBLISH_009 (Unlisted) complements discovery coverage that would otherwise belong to US-011 (not in the 13-story scope for this test design pass).
