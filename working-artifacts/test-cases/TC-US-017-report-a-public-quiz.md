# Test Cases — US-017 Report a public quiz

| Field | Value |
| --- | --- |
| Source requirement | [US-017](../user-stories/language-learning-quiz-app/epic-g-trust-safety/us-017-report-a-public-quiz.md) |
| Requirement analysis | [Findings-Requirements-Analysis-language-learning-quiz-app-phase1.md](../test-analysis-reports/Findings-Requirements-Analysis-language-learning-quiz-app-phase1.md) — Readiness: Ready |
| Scope | Functional only |
| Module prefix | `REPORT` |

| Test Case ID | Title | Test Steps | Expected Result | Requirement | Testing Technique | Priority | Preconditions | Test Data | Automation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC_REPORT_001 | Verify reporting a published public quiz with a reason category records the report | 1. Open a publicly published quiz<br>2. Select report<br>3. Choose a reason category and submit | Report is recorded against the quiz with reason, timestamp, and reporter identifier where available; an acknowledgement is shown | US-017 AC1 | Use Case Testing | Critical | A quiz is published publicly | Reason: "Inappropriate for minors" | Yes |
| TC_REPORT_002 | Verify submitting a report without a reason category is rejected | 1. Open a publicly published quiz<br>2. Select report<br>3. Leave the reason category unselected<br>4. Attempt to submit | Report is not created; user is told a reason is required | US-017 AC2 | Equivalence Partitioning | High | A quiz is published publicly | Reason: (none selected) | Yes |
| TC_REPORT_003 | Verify a second report from the same reporter on a quiz still under review does not create an additional report | 1. Report a public quiz<br>2. As the same reporter, report the same quiz again before it has been reviewed | No additional report is created; reporter is told their earlier report is already being reviewed | US-017 AC3 | Use Case Testing | High | Reporter already submitted one report on this quiz, still pending review | — | Yes |
| TC_REPORT_004 | Verify multiple reports on the same quiz are grouped with a report count | 1. Have three different users report the same public quiz, each with a reason<br>2. As a moderator, open the moderation queue | Reports appear grouped under that quiz with a report count of 3 | US-017 AC4 | Use Case Testing | Medium | Three distinct reporters report the same quiz | 3 reports, 3 different reporters | Yes |
| TC_REPORT_005 | Verify reports exceeding the configured rate limit from the same source are rejected and logged | 1. Submit reports from the same source repeatedly in a short period, up to the configured limit<br>2. Submit one more report beyond the limit | Reports up to the limit are accepted; the report exceeding the limit is rejected and the rejection is logged | US-017 AC5 | Boundary Value Analysis | High | Rate limit threshold is known/configured in the test environment | N+1 reports from same source in the rate-limit window | Yes |
| TC_REPORT_006 | Verify a report attempted against a draft quiz is rejected | 1. Attempt to report a quiz that is still a draft (not published) | Report is rejected | US-017 AC6 | Access Control (Negative) | High | Quiz exists as a draft, not published | — | Yes |
| TC_REPORT_007 | Verify a report attempted against a quiz shared only by invitation link is rejected | 1. Attempt to report a quiz that is shared only via an invitation link (not published publicly) | Report is rejected | US-017 AC6 | Access Control (Negative) | High | Quiz is shared only via link/QR, not public | — | Yes |

## Coverage notes
- AC1–AC6 are each covered by at least one test case; AC6 (non-public content) is covered by two variants (draft and link-only) since both are distinct non-public states.
- Out-of-scope items explicitly not covered: reporting individual users/messages, AI-based content classification, appeals by the reporter, a dedicated legal/copyright channel (confirmed descoped, DEC-53), and outcome notification to the reporter (confirmed out of scope, DEC-54).
- Moderation queue processing itself (review, takedown, dismissal) is covered separately in [TC-US-018-review-reports-and-take-down.md](TC-US-018-review-reports-and-take-down.md) to avoid duplication.
