# Test Cases — US-018 Review reports and take content down

| Field | Value |
| --- | --- |
| Source requirement | [US-018](../user-stories/language-learning-quiz-app/epic-g-trust-safety/us-018-review-reports-and-take-down.md) |
| Requirement analysis | [Findings-Requirements-Analysis-language-learning-quiz-app-phase1.md](../test-analysis-reports/Findings-Requirements-Analysis-language-learning-quiz-app-phase1.md) — Readiness: Ready |
| Scope | Functional only |
| Module prefix | `MODERATION` |

| Test Case ID | Title | Test Steps | Expected Result | Requirement | Testing Technique | Priority | Preconditions | Test Data | Automation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC_MODERATION_001 | Verify an operator can view the moderation queue with report details and open full quiz content | 1. Sign in as an operator<br>2. Open the moderation queue<br>3. Open a listed reported quiz | Reported quizzes are listed with report count, reasons, and time of first report; the quiz's full content is viewable | US-018 AC1 | Use Case Testing | Critical | At least one report exists; operator role is granted | — | Yes |
| TC_MODERATION_002 | Verify taking a quiz down unpublishes it immediately, notifies the author, and records the decision | 1. As an operator, open a reported quiz in the queue<br>2. Take it down | Quiz is immediately removed from public discovery and no longer playable; author is notified with the reason; decision, moderator, and timestamp are recorded | US-018 AC2 | Use Case Testing | Critical | A reported, published quiz exists | — | Yes |
| TC_MODERATION_003 | Verify dismissing a report leaves the quiz published and records the decision | 1. As an operator, open a reported quiz that does not breach the rules<br>2. Dismiss the reports | Quiz remains published; the dismissal decision is recorded against the report group | US-018 AC3 | Use Case Testing | High | A reported, published quiz exists that does not breach the rules | — | Yes |
| TC_MODERATION_004 | Verify a non-operator cannot open the moderation queue or take content down | 1. Sign in as a user without the operator role<br>2. Attempt to open the moderation queue<br>3. Attempt to take a quiz down directly via its reported-content action | Both actions are denied | US-018 AC4 | Access Control (Negative) | Critical | User is signed in without the operator role | — | Yes |
| TC_MODERATION_005 | Verify an author cannot re-publish taken-down content without changes | 1. Have a quiz taken down by a moderator<br>2. As the author, attempt to publish the same quiz again without changes | Publication is blocked; author is told the content is subject to a moderation decision | US-018 AC5 | State Transition Testing | High | Quiz was taken down by a moderator | — | Yes |
| TC_MODERATION_006 | Verify suspending a repeat offender unpublishes their existing quizzes and blocks new publishing | 1. As an operator, suspend the publishing ability of an author who has had multiple quizzes taken down<br>2. As that author, check existing public quizzes<br>3. As that author, attempt to publish a new quiz | Existing public quizzes are unpublished; the author cannot publish new quizzes until the suspension is lifted | US-018 AC6 | Use Case Testing | High | Author has had 2+ quizzes taken down previously | — | Yes |
| TC_MODERATION_007 | Verify every moderation decision is retrievable in the audit record | 1. Perform at least one takedown and one dismissal decision<br>2. As an authorised reviewer, inspect the audit record | Every decision is retrievable with its moderator, timestamp, reason, and affected content | US-018 AC7 | Use Case Testing | Medium | At least one takedown and one dismissal decision have been made | — | Yes |

## Coverage notes
- AC1–AC7 are each covered by at least one test case.
- Out-of-scope items explicitly not covered: author appeals workflow (confirmed not legally required, DEC-56) and hard-deletion of taken-down content (confirmed out of scope; unpublishing is sufficient, DEC-57) — no test cases are written for these since they are confirmed absent features.
- Report submission itself (reasons, duplicate prevention, rate limiting) is covered separately in [TC-US-017-report-a-public-quiz.md](TC-US-017-report-a-public-quiz.md) to avoid duplication.
