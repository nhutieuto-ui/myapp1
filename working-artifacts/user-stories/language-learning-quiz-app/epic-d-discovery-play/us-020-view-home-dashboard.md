# US-020 — View personalized home dashboard

| Field | Value |
| --- | --- |
| Story ID | US-020 |
| Epic / Feature | Epic D — Discovery & Play / extends F-11 |
| Priority | **Should** (Phase 1) — not in the original Vision & Scope feature list; landing-page value is secondary to the core author/share/play loop |
| Status | Draft — new, not yet reviewed with the Sponsor |
| Source | Live screen at `/` ([src/app/page.tsx](../../../../src/app/page.tsx)), wireframe [wf-webapp-discover-leaderboard-review-mid-draft.html](../../../mockup-wireframe/language-learning-quiz-app/wf-webapp-discover-leaderboard-review-mid-draft.html), [US-011](us-011-find-a-quiz.md), [US-013](us-013-play-quiz-and-submit-attempt.md) |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.8](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** signed-in learner,
> **I want to** land on a home dashboard that greets me and surfaces quizzes I can jump into,
> **so that** I don't have to go straight to search to find something to practice.

## Preconditions

- The learner is signed in ([US-001](../epic-a-identity-access-consent/us-001-sign-up-and-sign-in.md)); an unauthenticated visitor is redirected to `/login` (already implemented).
- At least one quiz is published ([US-009](../epic-c-publishing-sharing/us-009-publish-quiz-publicly.md)) for the discovery preview to show anything.

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-020.1 | The "Recommended for you" section is **not** a personalized recommendation engine — [US-011](us-011-find-a-quiz.md) explicitly lists "personalised recommendations and ranking algorithms" as out of scope. This story reuses the same non-personalized default order as the catalogue: most played, newest as tiebreaker (DEC-38), filtered to published quizzes only. It is a home-page *preview* of discovery, not a new ranking feature. | If a real personalization capability is wanted, it needs its own story and its own decision on ranking rules |
| AS-020.2 | The dashboard body (greeting, continue-learning, discovery preview) is the same for both roles (`tutor`, `learner`) unless told otherwise — matches current implementation, which shows tutors the same screen with an added "My quizzes" nav link | A separate tutor-facing home (e.g., authoring stats) would need its own story |
| AS-020.3 | "Continue learning" requires the ability to resume a **partially completed** attempt for a signed-in learner. **The current `attempt` schema does not support this**: attempts are only written once *submitted* (`score`, `scoredQuestionCount`, `submittedAt`), and they are attributed by a self-reported `participantName`, not a `userId` — by design, per [US-013](us-013-play-quiz-and-submit-attempt.md) AS-013.5, since link/QR joiners have no account. There is no persisted "in-progress" state today. | AC6/AC7 below cannot ship until a new capability (linking attempts to signed-in learners and persisting in-progress state) is scoped and built — see Open Questions |

## Workflow notes

- **Main flow:** learner signs in → lands on `/` → sees a personalized greeting → sees a "Continue learning" card if they have an in-progress attempt → sees a "Recommended for you" preview of published quizzes → selects a quiz to open it, or clicks "See all" to go to the full catalogue ([US-011](us-011-find-a-quiz.md)).
- **Alternate flow:** learner has no in-progress attempt → the "Continue learning" card is omitted, not shown empty.
- **Alternate flow:** no published quizzes exist yet → the discovery preview shows an empty state, consistent with [US-011](us-011-find-a-quiz.md) AC4.
- **Exception flow:** a previewed quiz is unpublished or taken down between load and click → same handling as [US-011](us-011-find-a-quiz.md) AC6.
- Mockup: [wf-webapp-discover-leaderboard-review-mid-draft.html](../../../mockup-wireframe/language-learning-quiz-app/wf-webapp-discover-leaderboard-review-mid-draft.html) (Home screen) — note the wireframe's own Leaderboard section is explicitly marked "Illustrative (no story)" in that file and is **not** part of this story.

## Acceptance criteria

```gherkin
AC1: Personalized greeting
  Given a learner is signed in
  When they open the home dashboard
  Then they see a time-of-day-appropriate greeting with their first name

AC2: Discovery preview shows real published quizzes
  Given published quizzes exist
  When the learner opens the home dashboard
  Then the "Recommended for you" section shows a short list of published quizzes
  And the list is ordered most played, then newest (DEC-38), the same default order as the full catalogue
  And draft, unlisted, or taken-down quizzes never appear in this list

AC3: Empty discovery preview
  Given no published quiz exists yet
  When the learner opens the home dashboard
  Then the "Recommended for you" section shows an empty-state message instead of an empty grid

AC4: Open a previewed quiz
  Given a quiz appears in the discovery preview
  When the learner selects it
  Then they are taken to that quiz's play/detail entry point (US-013)

AC5: See the full catalogue
  Given the discovery preview is showing a partial list
  When the learner selects "See all"
  Then they are taken to the full public catalogue (US-011)

AC6: No continue-learning card when nothing is in progress
  Given the learner has no in-progress attempt
  When they open the home dashboard
  Then no "Continue learning" card is shown

AC7: Unauthenticated visitor cannot see the dashboard
  Given a visitor is not signed in
  When they request the home dashboard
  Then they are redirected to sign in
  And no quiz or account data is rendered
```

> **AC6 is deliberately the negative case only.** The positive case — showing and resuming an actual in-progress attempt — is not written here because the capability it depends on does not exist yet (see AS-020.3 and Open Questions). Do not implement a "Resume" button that cannot resume real progress.

## Out of scope

- **Resuming an in-progress attempt** (the positive "Continue learning" case: showing real progress and returning the learner to the exact question they left off at). This needs its own story once attempt-to-learner linkage and in-progress persistence are scoped (see Open Questions) — do not build this as a cosmetic-only card.
- **Streak, points ("QP"), and any leaderboard/gamification.** No business rules for how a streak or point value is earned, decays, or resets exist anywhere in the Vision & Scope or backlog. Per the wireframe file's own disclaimer, this is "illustrative only... not yet a backlog item." Do not invent scoring rules to fill this in — it needs a dedicated story and Sponsor decision.
- A tutor-specific dashboard variant (e.g., authoring stats, pending reports). Tutors currently see the same screen as learners; whether that is correct is an open question below.
- Personalized/ranked recommendations (explicitly out of scope of [US-011](us-011-find-a-quiz.md) too — see AS-020.1).
- The full catalogue's search and filter UI — already covered by [US-011](us-011-find-a-quiz.md).

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Privacy | The dashboard must not surface other learners' identities, scores, or activity | A-12 (existing privacy principle applied elsewhere in the backlog) |
| Performance | Dashboard should load without a perceptible delay; threshold *TBD* — owner: Solution Architect | §8 Performance (unset, same gap as US-011) |
| Accessibility | Progress indicators and interactive cards must be usable via keyboard and screen reader | *TBD* — no product-wide accessibility target is set in the Vision & Scope |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | Extends F-11 (Find a quiz) as a home-page preview; no dedicated feature ID exists for this screen in the Vision & Scope |
| Decisions | DEC-38 (default browse order, reused here) |
| Dependencies | [US-009](../epic-c-publishing-sharing/us-009-publish-quiz-publicly.md) (published quizzes to preview), [US-011](us-011-find-a-quiz.md) (catalogue/"See all" target), [US-013](us-013-play-quiz-and-submit-attempt.md) (play entry point) |
| Related, non-authoritative reference | [wf-webapp-discover-leaderboard-review-mid-draft.html](../../../mockup-wireframe/language-learning-quiz-app/wf-webapp-discover-leaderboard-review-mid-draft.html) |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| Q-020.1 | Data model | Should attempts be linked to a signed-in learner's account (new `userId` column) and gain an in-progress/draft state, so "Continue learning" can show and resume real progress? | AC6 positive case; needs its own story + schema change if yes |
| Q-020.2 | Business | Is a streak/points/gamification system wanted at all for Phase 1 or Phase 2? If yes, what are the earning, decay, and reset rules? | Any future gamification story |
| Q-020.3 | UX | Should a tutor see this learner-style dashboard at all, or a tutor-focused home (e.g., their quizzes, pending reports)? | Role-based rendering of `/` |
| Q-020.4 | Product | Is a home dashboard even a Phase 1 priority, or should `/` simply redirect straight to the catalogue ([US-011](us-011-find-a-quiz.md)) until this story is funded? | Priority/sequencing of this story |
