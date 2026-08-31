---
name: testing-accessibility-testing
description: "Use when: assessing web application accessibility against WCAG 2.2 through checklist-based verification or focused evaluation of applicable accessibility areas."
---

# SKILL.md - Testing Accessibility Testing

## 1. Purpose
<!-- Why the skill exists, business objective, primary responsibility -->

Assess web application accessibility against WCAG 2.2, identify barriers and risks, combine automated, manual, and assistive-technology evidence, and produce actionable findings without generating test-case documents.

---

## 2. When to Use
<!-- Situations where the skill should be executed -->

- When a page, component, user journey, or product area needs accessibility assessment.
- When WCAG 2.2 coverage must be verified against a target conformance level.
- When automated accessibility findings need manual validation and prioritization.
- When a focused accessibility review is needed for keyboard access, forms, dynamic content, screen readers, visual presentation, or interaction behavior.
- When accessibility findings, limitations, remediation, or residual risk must be documented.

---

## 3. Do Not Use When
<!-- What the skill is NOT responsible for -->

- When accessibility requirements or the target conformance level are missing and cannot be clarified.
- When the task is to fix accessibility defects in application code.
- When the task is only to generate test-case documents; use `testing-design-test-case` for that purpose.
- When the task is to execute a general functional, performance, or security test unrelated to accessibility.
- When legal or regulatory compliance certification is requested without qualified human review.

---

## 4. Inputs
<!-- Required and Optional inputs -->

### Required

- **Assessment Scope**: Page, component, user journey, application area, or product area.
- **Accessibility Standard**: WCAG 2.2 by default, including the target conformance level: A, AA, or AAA.
- **Assessment Evidence**: URL, running application, HTML/DOM, screenshots, design artifacts, or other evidence sufficient for the requested approach.

### Optional

- **Requirements and Context**: User stories, acceptance criteria, accessibility requirements, business criticality, and affected user groups.
- **Assessment Approach**: `WCAG checklist verification`, `applicable-area evaluation`, or `both`.
- **Environment Context**: Browser, operating system, viewport, device, input method, screen reader, magnification, voice, or switch access.
- **Existing Assets**: Previous accessibility reports, axe-core results, defect reports, known exceptions, automated checks, and monitoring evidence.
- **AI Context**: Generated content, streaming responses, loading states, conversational interactions, or AI-generated UI components.

---

## 5. Outputs
<!-- Files generated, reports, documents with naming conventions -->

| Output | Approach | Purpose | Naming Convention |
| ------ | -------- | ------- | ----------------- |
| Applicable-Area Assessment Report | Applicable-area evaluation | Summarizes Perceivable, Operable, Understandable, and Robust findings for the assessed scope. | `Accessibility-Report-<Scope-Name>-<YYYYMMDD-HHmmss>.md` |
| WCAG Coverage Assessment Report | WCAG checklist verification | Reproduces all 86 WCAG 2.2 checklist items and records a status, primary method, and evidence or rationale for every item. | `WCAG-Coverage-<Scope-Name>-<YYYYMMDD-HHmmss>.md` |
| Accessibility Findings Log | Either approach | Records confirmed findings, affected users, criteria or areas, severity, evidence, remediation, owners, and residual risk. | `Accessibility-Findings-<Scope-Name>-<YYYYMMDD-HHmmss>.md` |
| Automated Testing Recommendation | Either approach | Documents automation candidates, tools, limitations, and required manual or assistive-technology follow-up. | `Accessibility-Automation-<Scope-Name>-<YYYYMMDD-HHmmss>.md` |

Output location: `working-artifacts/accessibility-test-reports/`

The skill produces the report required by the selected approach. When `both` approaches are selected, generate both assessment reports and share the supporting findings log and automation recommendation where applicable.

---

## 6. Workflow
<!-- High-level workflow steps only -->

```text
1. Load Knowledge -> 2. Read Inputs -> 3. Select Assessment Approach -> 4. Assess Accessibility -> 5. Validate Evidence -> 6. Report Findings -> 7. Self Review
```

---

## 7. Knowledge Sources
<!-- Standards, Checklists, Templates, Examples to load -->

### Standards

- `references/standards/accessibility-testing-standard.md`

### Checklists

- `references/checklists/wcag-2.2-checklist.md`
- `references/checklists/accessibility-testing-checklist.md`

### Strategy and Tools

- `references/accessibility-testing-strategy.md`
- `references/accessibility-tools.md`

### Templates

- `references/templates/accessibility-report-template.md` for applicable-area evaluation.
- `references/templates/accessibility-wcag-report-template.md` for WCAG checklist verification.

### Examples

- `working-artifacts/accessibility-test-reports/WCAG-Coverage-20260815-220429.md` as a complete WCAG report sample.
- `working-artifacts/accessibility-test-reports/WCAG-Coverage-20260815-220429.md` as a complete WCAG report sample.

---

## 8. Execution Rules
<!-- Execution sequence -->

1. Read the scope, accessibility requirements, target conformance level, available evidence, and existing findings fully.
2. Load the accessibility standard, applicable checklist, strategy, tool guidance, approach-specific report template, and example from `references/`.
3. Confirm the user's selected assessment approach before execution:
   - **WCAG checklist verification**: use `references/templates/accessibility-wcag-report-template.md` and `references/checklists/wcag-2.2-checklist.md` as the report structure, retain all 86 WCAG 2.2 criteria, and record each item's status, primary method, evidence, and rationale.
   - **Applicable-area evaluation**: assess the relevant Perceivable, Operable, Understandable, and Robust areas for the current scope.
4. Record the browser, platform, viewport, input method, assistive technology, tool versions, and limitations.
5. Run automated checks for objective, repeatable signals using tools such as axe-core, Playwright, Lighthouse, or WAVE where appropriate.
6. Complete manual review for meaning, content quality, keyboard behavior, focus, error recovery, dynamic content, visual presentation, and user interaction.
7. Complete assistive-technology review when required by risk, requirements, or the selected WCAG criteria.
8. Manually validate automated findings before reporting them as confirmed defects.
9. Classify findings by user impact, journey criticality, severity, affected criterion or area, reproducibility, and remediation priority.
10. For WCAG checklist verification, use `accessibility-wcag-report-template.md`, copy or reproduce every one of the 86 checklist items in the report, and mark each item as `Pass`, `Fail`, `N/A`, `Not tested`, or `Needs review`; include the primary tool or method and supporting evidence or rationale. Do not omit, merge, or summarize checklist items.
11. Generate assessment artifacts using the naming conventions, current local timestamp (`YYYYMMDD-HHmmss`), and output location.
12. Perform self-validation before delivering the report.

---

## 9. Decision Rules
<!-- Deterministic branching logic -->

1. If the assessment approach is not specified, ask the user to select one:
   - `1`: WCAG checklist verification
   - `2`: Applicable-area evaluation
   - `3`: Both approaches
2. Do not begin assessment until the user selects `1`, `2`, or `3`.
3. If the target accessibility standard or conformance level is missing, request clarification before assigning compliance status.
4. If the assessment scope is missing, request a page, component, journey, or product area before proceeding.
5. If runtime evidence is unavailable, mark execution-dependent checks as `Not tested` or `BLOCKED`; do not invent results.
6. If an automated scan reports a violation, manually validate it before confirming the finding.
7. If an automated scan passes, report only the passing rule; do not claim complete WCAG conformance.
8. If a criterion or area is not applicable, record `N/A` with a documented rationale.
9. If a criterion requires meaning, context, usability, or assistive-technology behavior, require manual review.
10. If a barrier blocks a critical journey, prioritize it by user impact even when the automated severity is lower.
11. If browser, screen-reader, input-method, or viewport coverage is limited, record the limitation and residual risk.
12. If legal or regulatory conclusions are requested, escalate to a qualified accessibility or compliance reviewer.
13. If the user requests test-case documents, hand off to `testing-design-test-case` rather than generating them here.

---

## 10. Knowledge Priority
<!-- Rule precedence -->

1. User instructions
2. SKILL.md
3. Project accessibility requirements and target conformance policy
4. `references/standards/accessibility-testing-standard.md`
5. `references/checklists/`
6. `references/accessibility-testing-strategy.md`
7. `references/accessibility-tools.md`
8. Templates
9. Examples

---

## 11. Quality Gates
<!-- Mandatory validation before output -->

- [ ] Assessment scope, standard, and conformance level are explicit.
- [ ] Selected assessment approach is stated.
- [ ] Automated, manual, and assistive-technology coverage are distinguished.
- [ ] Tool versions, environments, and limitations are recorded.
- [ ] Automated findings are manually validated where required.
- [ ] WCAG statuses or area findings have supporting evidence and rationale.
- [ ] WCAG checklist reports include all 86 checklist items and mark the status of every item, including `N/A`, `Not tested`, and `Needs review` items.
- [ ] Critical barriers and residual risks are prioritized.
- [ ] Findings include affected users, criterion or area, severity, and remediation guidance.
- [ ] No unsupported conformance or legal claim is made.
- [ ] Output artifacts use the required names and location.

---

## 12. Self Review
<!-- Checklist-driven self review -->

Before completing, execute:

- `references/checklists/wcag-2.2-checklist.md` when using checklist verification.
- `references/checklists/accessibility-testing-checklist.md` for applicable manual and reporting checks.
- `references/templates/accessibility-wcag-report-template.md` when using checklist verification.

Also verify:

- [ ] Relevant accessibility requirements and user risks were identified.
- [ ] Applicable WCAG criteria or accessibility areas were considered.
- [ ] Automated results are separated from manual and assistive-technology results.
- [ ] Keyboard access, focus, dynamic behavior, and content meaning were considered where applicable.
- [ ] Evidence was captured or unavailable evidence was clearly marked.
- [ ] Findings, limitations, assumptions, and residual risks are documented.

Revise output if any applicable check fails.

---

## 13. Success Criteria
<!-- Measurable outcomes -->

- [ ] A reviewable accessibility assessment is created in `working-artifacts/accessibility-test-reports/` with a timestamped filename using `YYYYMMDD-HHmmss`.
- [ ] The assessment uses the WCAG checklist or applicable-area approach as appropriate.
- [ ] When the WCAG approach is selected, the report reproduces every item from `wcag-2.2-checklist.md` with a status, primary method, and evidence or rationale.
- [ ] The WCAG report follows `references/templates/accessibility-wcag-report-template.md`.
- [ ] Findings are evidence-based, prioritized, reproducible, and actionable.
- [ ] Automated limitations and required manual or assistive-technology review are clear.
- [ ] The output supports remediation, regression verification, and qualified conformance review.
- [ ] No test-case document is generated by this skill.

---

## 14. Next Skill
<!-- Downstream handoff -->

- `testing-analyze-bug` for confirmed accessibility defects.
- `testing-design-test-case` when formal test-case documents are explicitly requested.

---

## 15. Related Skills
<!-- Upstream and downstream skills only -->

- `testing-analyze-requirements`
- `testing-test-strategy`
- `testing-analyze-bug`
- `testing-design-test-case`
- `testing-implement-automation`
- `testing-review-automation`

---
