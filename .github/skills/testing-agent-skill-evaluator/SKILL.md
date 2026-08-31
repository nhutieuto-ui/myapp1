---
name: testing-agent-skill-evaluator
description: "Use when: evaluating the output quality of another AI agent skill by running baseline vs skill-enabled comparisons and grading outputs against assertions."
---

# SKILL.md - Testing Agent Skill Evaluator

## 1. Purpose

Evaluate the output quality of a target AI agent skill by running structured evaluation cases, comparing skill-enabled vs baseline outputs, grading assertions with evidence, and producing human-reviewable results before adoption.

---

## 2. When to Use

- When a new or updated skill needs quality validation before adoption.
- When comparing a target skill against a previous version or competing skill.
- When structured grading of AI outputs against defined assertions is required.
- When human review artifacts must be produced prior to approving a skill change.

---

## 3. Do Not Use When

- When the task is to write or modify the target skill being evaluated.
- When no evaluation cases file exists for the target skill.
- When there is no defined output workspace to save results.

---

## 4. Inputs

### Required
- **Target skill path**: Path to the skill folder being evaluated.
- **Evaluation cases file**: A JSON file containing test prompts, expected outputs, input files, and assertions (e.g., `references/evals/evals-<skill-name>.json`).
- **Output workspace path**: Workspace location where all result artifacts should be saved.

### Optional
- **Baseline**: No skill (default), a previous version of the skill, or another competing skill.

---

## 5. Outputs

| Output | Format | Naming Convention |
| ------ | ------ | ----------------- |
| Evaluation Results | JSON | `evaluation-results.json` |
| Grading Results | JSON | `grading.json` |
| Timing and Token Usage | JSON | `timing.json` |
| Benchmark Comparison | JSON | `benchmark.json` |
| Feedback for Human Review | JSON | `feedback.json` |

Output location: `working-artifacts/skill-evaluator-reports/`

---

## 6. Workflow

```text
1. Load Knowledge -> 2. Read Evaluation Cases -> 3. Run Without Skill -> 4. Run With Skill -> 5. Grade Outputs -> 6. Compare and Benchmark -> 7. Generate Feedback -> 8. Self Review
```

---

## 7. Knowledge Sources

### Templates
- `references/templates/evaluation-results-template.json`
- `references/templates/grading-template.json`
- `references/templates/feedback-template.json`
- `references/templates/benchmark.json`

### Scripts
- `references/scripts/validate_output.py`

---

## 8. Execution Rules

1. Read all evaluation cases fully before running any prompts.
2. Load all templates before generating output artifacts.
3. For each evaluation case, run the baseline first (without skill or with provided baseline).
4. For each evaluation case, run the same prompt with the target skill enabled.
5. Save outputs for both runs to the designated output workspace.
6. Grade all assertions for both runs with evidence.
7. Produce `evaluation-results.json`, `grading.json`, and `timing.json`.
8. Compare `Without Skill` vs `With Skill` results and produce `benchmark.json`.
9. Generate `feedback.json` with improvement recommendations and human review notes.
10. Never auto-approve the target skill; mark final output as requiring human review.
11. Perform self-validation before delivering final artifacts.

---

## 9. Decision Rules

1. If the evaluation cases file is missing or malformed, stop and report the missing input before proceeding.
2. If a test case is too vague to produce a reliable pass/fail result, mark it as `needs-improvement` instead of forcing a verdict.
3. If the baseline is not specified, run without the target skill as the default baseline.
4. If an assertion cannot be graded due to ambiguity, record the ambiguity as evidence and assign an `inconclusive` grade.
5. If the output workspace does not exist, create it before saving artifacts.

---

## 10. Knowledge Priority

1. User instructions
2. SKILL.md
3. Templates
4. Scripts

---

## 11. Quality Gates

- [ ] All evaluation cases have been executed for both baseline and skill-enabled runs.
- [ ] All assertions are graded with evidence.
- [ ] All required output artifacts are present and follow template structure.
- [ ] Benchmark comparison reflects actual diff between runs.
- [ ] Feedback includes actionable improvement recommendations.
- [ ] Final output explicitly states that human review is required before adoption.

---

## 12. Self Review

Before completing, verify:

- [ ] All output files match the template structure in `references/templates/`.
- [ ] No skill has been auto-approved without human review notation.
- [ ] Grading evidence is traceable to specific prompt outputs.
- [ ] Benchmark accurately reflects `Without Skill` vs `With Skill` comparison.

---

## 13. Success Criteria

- [ ] All evaluation cases are executed with both baseline and skill-enabled runs.
- [ ] Every assertion is graded with supporting evidence.
- [ ] All output artifacts (`evaluation-results.json`, `grading.json`, `timing.json`, `benchmark.json`, `feedback.json`) are produced and complete.
- [ ] Human review is clearly required before the target skill is approved for adoption.

---

## 14. Next Skill

- Not applicable. This skill produces human-review artifacts; the next step is manual review by a human.

---

## 15. Related Skills

- All skills under `skills/` (any skill may be a target for evaluation)

---

## 16. Related Knowledge

### Templates
- `references/templates/evaluation-results-template.json`
- `references/templates/grading-template.json`
- `references/templates/feedback-template.json`
- `references/templates/benchmark.json`

### Scripts
- `references/scripts/validate_output.py`