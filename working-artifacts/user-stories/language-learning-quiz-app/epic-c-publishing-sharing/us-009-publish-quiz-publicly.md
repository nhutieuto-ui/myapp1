# US-009 — Publish a quiz publicly

| Field | Value |
| --- | --- |
| Story ID | US-009 |
| Epic / Feature | Epic C — Publishing & Sharing / F-09 |
| Priority | **Must** (Phase 1) |
| Status | Draft — **must ship together with [US-017](../epic-g-trust-safety/us-017-report-a-public-quiz.md)/[US-018](../epic-g-trust-safety/us-018-review-reports-and-take-down.md) (I-2)** |
| Source | S1, F-09, DEC-5, I-2, D-7, **DEC-29, DEC-30, DEC-31, DEC-55** |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.2](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** language tutor,
> **I want to** publish a finished quiz so that anyone can find and play it,
> **so that** my material reaches learners beyond the students I teach directly and contributes to a shared content base.

## Preconditions

- I own a quiz draft containing at least one question ([US-003](../epic-b-quiz-authoring-media/us-003-create-and-manage-quiz-draft.md)).
- A named moderation owner exists: **the website admin, with a 2-business-day review target (resolved, DEC-29/DEC-55; D-7 is fully closed).**

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-009.1 | Publishing **Public** makes the quiz fully discoverable by anyone, including unauthenticated visitors (DEC-5) | Access model, discovery, and privacy analysis change |
| AS-009.2 | Moderation is **reactive** — no pre-publication screening (A-13) | Screening cost and publish latency are added |
| AS-009.3 | The author can unpublish at any time; already-collected attempts are retained | Retention/deletion expectations change |
| AS-009.4 | Published quizzes are editable, and edits take effect immediately for new attempts | A publish-versioning model is required |
| **AS-009.5** | **A quiz can also be published as Unlisted (DEC-30): reachable by anyone holding its direct link, but not listed in public search/browse** — a third state alongside Draft and Public | If not needed, publish stays a simple two-state (Draft/Public) toggle |

## Workflow notes

- **Main flow:** author opens a draft → selects publish as **Public** or **Unlisted (DEC-30)** → confirms the content-rights and visibility statement → quiz status updates accordingly; a Public quiz appears in public discovery ([US-011](../epic-d-discovery-play/us-011-find-a-quiz.md)), an Unlisted quiz does not.
- **Alternate flow:** author unpublishes; quiz disappears from discovery and can no longer be started.
- **Exception flow:** publish attempted on an empty quiz, or on a quiz whose questions are invalid.
- Mockup: *TBD*.

## Acceptance criteria

```gherkin
AC1: Publish a valid quiz
  Given I own a draft quiz containing at least one valid question
  When I publish it and confirm the visibility statement
  Then its status becomes "Published"
  And it becomes discoverable and playable by any visitor

AC2: Block publishing an empty or invalid quiz
  Given my quiz has no questions, or contains a question that fails its own validation rules
  When I attempt to publish
  Then the quiz is not published
  And I am shown which questions block publication

AC3: Unpublish a quiz
  Given a quiz of mine is published
  When I unpublish it
  Then it no longer appears in public discovery
  And it can no longer be started by anyone
  And attempts already submitted against it remain visible to me

AC4: Only the owner can publish or unpublish
  Given a quiz was created by another author
  When I attempt to publish or unpublish it
  Then the action is rejected

AC5: Public quiz exposes no personal data
  Given a quiz is published
  When an unauthenticated visitor views it
  Then only the quiz content and the author's display name are visible
  And no author email, no student identity, and no attempt data is returned

AC6: Author accepts responsibility at publish time
  Given I am publishing a quiz
  When I confirm publication
  Then my acceptance of the content-rights and acceptable-use statement is recorded with a timestamp

AC7: In-progress attempts when a quiz is unpublished
  Given a student has an attempt in progress on a quiz
  When the author unpublishes it
  Then the student can complete and submit that attempt
  And no new attempts can be started

AC8: Publish a quiz as Unlisted
  Given I own a draft quiz containing at least one valid question
  When I publish it as Unlisted (DEC-30) instead of Public
  Then the quiz becomes playable by anyone holding its direct link
  And it does not appear in public search or browse (see [US-011](../epic-d-discovery-play/us-011-find-a-quiz.md))
```

## Out of scope

- Pre-publication moderation/screening (deferred — A-13).
- Content licensing choices, attribution, or forking by other authors.
- Featured/curated catalogue placement.

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Security | Public read of quiz content is anonymous; responses are never publicly readable | §8 Security |
| Privacy | Minors' identity must never appear in public content (A-12) | §8 Privacy |
| Trust & safety | Public publish must not be enabled in production without a named moderation owner | I-2, **D-7 (closed, DEC-55)** |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | F-09 |
| Decisions | DEC-5, **DEC-29 (moderation owner), DEC-30 (Unlisted tier), DEC-31 (discovery timing)** |
| Dependencies | [US-003](../epic-b-quiz-authoring-media/us-003-create-and-manage-quiz-draft.md), **D-7 closed (owner confirmed DEC-29, 2-business-day target DEC-55)**, [US-017](../epic-g-trust-safety/us-017-report-a-public-quiz.md)/[US-018](../epic-g-trust-safety/us-018-review-reports-and-take-down.md) must ship together |
| Risks/Issues | I-2, R-9 (cold start — **mitigation confirmed, DEC-31**) |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| ~~Q-009.1~~ | ~~Ops~~ | ~~Who owns moderation, with what response-time commitment?~~ | **Resolved (DEC-29, DEC-55): the website admin, with a 2-business-day review target. D-7 is fully closed.** |
| ~~Q-009.2~~ | ~~Business~~ | ~~Is an "unlisted link" visibility option needed between private and fully public?~~ | **Resolved (DEC-30): yes — see AS-009.5, AC8.** |
| ~~Q-009.3~~ | ~~Business~~ | ~~Given cold start (R-9), is public discovery valuable at launch or should it follow seeded content?~~ | **Resolved (DEC-31): discovery follows seeded content; link/QR remains the primary Phase 1 path.** |
