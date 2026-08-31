# US-016 — Save quizzes into personal collections

| Field | Value |
| --- | --- |
| Story ID | US-016 |
| Epic / Feature | Epic F — Student Collections / F-15 |
| Priority | **Must** (Phase 1) |
| Status | Draft |
| Source | S1, F-15, BO-3, **DEC-51, DEC-52** |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.2](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** student,
> **I want to** save quizzes into named collections of my own,
> **so that** I can build a personal study library and come back to the material that matters to me.

## Preconditions

- I am signed in with an active account ([US-001](../epic-a-identity-access-consent/us-001-sign-up-and-sign-in.md), [US-002](../epic-a-identity-access-consent/us-002-guardian-consent-for-minors.md)).
- At least one quiz is accessible to me (published, or joined by link or QR code).

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-016.1 | Collections are private to their owner and are not shareable in Phase 1 | Sharing, permissions, and public collection pages are added |
| AS-016.2 | A collection holds references to quizzes, not copies; if a quiz is edited, the collection reflects the current version | Snapshotting/versioning is required |
| AS-016.3 | A quiz can belong to more than one collection | A single-parent model simplifies the design but limits the user |
| **AS-016.4** | **Collections require an account. A student who joined a quiz account-free by link/QR (S5, see [US-012](../epic-d-discovery-play/us-012-join-quiz-via-link-or-qr.md)) cannot save it to a collection unless they create an account first** | If account-free saving is expected, collections need a device-local mode too |

## Workflow notes

- **Main flow:** student finds or plays a quiz → saves it → chooses an existing collection or creates a new one → the quiz appears in that collection.
- **Alternate flow:** student renames a collection, removes a quiz from it, or deletes the collection.
- **Exception flow:** a saved quiz is later unpublished or taken down.
- Mockup: *TBD*.

## Acceptance criteria

```gherkin
AC1: Save a quiz into a new collection
  Given I am viewing a quiz I can access
  When I save it and create a new named collection
  Then the collection is created
  And the quiz appears inside it

AC2: Save a quiz into an existing collection
  Given I already have a collection
  When I save another quiz into it
  Then both quizzes are listed in that collection

AC3: Collections are private
  Given I have created collections
  When another user or an anonymous visitor attempts to view them
  Then access is denied

AC4: Manage collections
  Given I own a collection
  When I rename it, remove a quiz from it, or delete it
  Then the change is applied to my library only
  And the underlying quizzes are unaffected

AC5: Replay from a collection
  Given a quiz is saved in one of my collections
  When I open it from the collection
  Then I can play it again
  And a new attempt is recorded

AC6: Saved quiz becomes unavailable
  Given a quiz saved in my collection is unpublished or taken down
  When I open my collection
  Then the entry is shown as no longer available
  And its content cannot be opened

AC7: Duplicate save is prevented
  Given a quiz is already in a collection
  When I save it to the same collection again
  Then it is not duplicated
  And I am told it is already saved there
```

## Out of scope

- Sharing collections with other users or with a tutor.
- Tutor-curated collections and recommended study paths.
- **Tutors organising their own quizzes into collections — confirmed a separate need, out of scope for this story (DEC-51).**
- Notes, highlights, or personal annotations on a saved quiz.
- Offline availability of saved quizzes (out of scope, §6.2).
- **Saving without an account (AS-016.4) — an account-free joiner (S5) must sign up first.**
- **A default "Saved" collection / one-click save — confirmed out of scope; a student always names or chooses a collection (DEC-52).**

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Security | Collection access is owner-only, enforced server-side | §8 Security |
| Privacy | Collections must not reveal a minor's activity publicly | A-12 |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | F-15 |
| Decisions | **DEC-51 (no tutor-side collections), DEC-52 (no default collection)** |
| Objective | BO-3 (repeat practice) |
| Dependencies | [US-001](../epic-a-identity-access-consent/us-001-sign-up-and-sign-in.md), [US-011](../epic-d-discovery-play/us-011-find-a-quiz.md)/[US-013](../epic-d-discovery-play/us-013-play-quiz-and-submit-attempt.md) |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| ~~Q-016.1~~ | ~~Business~~ | ~~Do tutors also need collections for organising their own quizzes, or is that a separate need?~~ | **Resolved (DEC-51): a separate need, out of scope here.** |
| ~~Q-016.2~~ | ~~Business~~ | ~~Is a default "Saved" collection needed so that saving is a one-click action?~~ | **Resolved (DEC-52): no.** |
