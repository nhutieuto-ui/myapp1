# US-012 — Join a quiz by invitation link or QR code

| Field | Value |
| --- | --- |
| Story ID | US-012 |
| Epic / Feature | Epic D — Discovery / F-11, F-10 |
| Priority | **Must** (Phase 1) |
| Status | Draft — **supersedes the assigned-quiz list (S4); join is account-free (S5)** |
| Source | S1, F-11, F-10, **S4 — stakeholder change 2026-08-30: join by QR scan or invitation link**, **S5 — stakeholder decision 2026-08-30: no account required to join; enter a display name to play**, **DEC-39, DEC-40, DEC-41** |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.2](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** student,
> **I want to** join a quiz by scanning a QR code or opening an invitation link and typing my name, and then find it again in my own list,
> **so that** I can start practising in seconds, with nothing to sign up for, and keep track of what I still have to do.

## Preconditions

- I hold a valid join link or can scan its QR code ([US-010](../epic-c-publishing-sharing/us-010-share-quiz-via-link-or-qr.md)).
- I can provide a display name. **No account and no sign-in are required (S5).**

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-012.1 | Scanning the QR code with any standard camera app opens the same join link — no in-app scanner is required in Phase 1 | An in-app camera scanner must be built, adding permissions handling and device testing |
| AS-012.2 | Joining adds the quiz to my own list, which is my default landing view and is separate from public discovery | Navigation and information architecture change |
| AS-012.3 | Joining is idempotent for the same session — re-opening or re-scanning the same link on the same device does not create a second entry | Duplicate participation records corrupt the tutor's response view |
| AS-012.4 | Status per joined quiz is Not started / In progress / Submitted, plus a late flag | Additional states (e.g. graded, returned) are required |
| **AS-012.5** | **Resolved by S5:** joining needs a **display name only**, entered fresh each time I follow the link — no sign-in step exists | If persistence across devices or protection against name spoofing is required, an account becomes necessary after all |
| **AS-012.6** | **My "joined quizzes" list is tied to this device/browser** via a locally held session token, not to an account. Clearing browser data or switching devices loses the list (though the tutor's copy of my attempt is unaffected) | **Resolved (DEC-41): no mitigating "create an account" prompt is offered after play** — the limitation stands as-is |
| **AS-012.7** | Display names are **not unique**; two participants may enter the same name. The tutor tells them apart by join time, not identity | If the tutor needs to reliably tell two same-named participants apart, a per-join distinguishing suffix must be added |
| **AS-012.8** | **Retakes are unlimited (DEC-39): a student may play a joined quiz again after submitting, each attempt is recorded separately, and all attempts are visible to the tutor** — there is no single "counted" attempt | If only the latest or best attempt should be shown to the tutor, [US-015](../epic-e-response-review/us-015-review-student-responses.md) needs an attempt-selection rule |

## Workflow notes

- **Main flow:** student scans the QR or opens the link → types a display name → joins immediately → quiz appears in their list → opens it and plays ([US-013](us-013-play-quiz-and-submit-attempt.md)) → the entry shows as submitted.
- **Alternate flow:** student returns to their list later, on the same device, to finish or re-open a submitted quiz.
- **Exception flow:** the link was rotated, closed, or the quiz was taken down; the display name field is left empty.
- Mockup: *TBD*.

## Acceptance criteria

```gherkin
AC1: Join by opening the invitation link
  Given I hold an active invitation link
  When I open it and enter a display name
  Then I am joined to the quiz
  And the quiz appears in my list

AC2: Join by scanning the QR code
  Given a tutor is displaying the QR code for a quiz
  When I scan it with my device camera and follow the link
  Then I reach the same join screen as the link
  And joining produces the same result as AC1

AC3: Display name is required
  Given I am on the join screen
  And I have not entered a display name
  When I attempt to join
  Then I am not joined
  And I am told a display name is required

AC4: See my joined quizzes
  Given I have joined one or more quizzes on this device
  When I open my list
  Then each entry shows the quiz title, the tutor's display name, the due date if set, and my status

AC5: Status reflects my progress
  Given I have not opened a quiz I joined
  When I start it and later submit it
  Then the status moves from "Not started" to "In progress" and then to "Submitted"

AC6: Overdue entries are identifiable
  Given a quiz I joined has a due date in the past and I have not submitted
  When I view my list
  Then the entry is marked as overdue

AC7: Expired, rotated, or closed link
  Given the link I hold has been rotated or the share has been closed
  When I open it
  Then I am told the invitation is no longer valid
  And no quiz content is shown to me

AC8: Re-opening on the same device does not duplicate
  Given I have already joined a quiz on this device
  When I open or scan the same link again on that device
  Then I am taken to the quiz
  And no second entry is created in my list

AC9: Only my own participation is visible
  Given other students joined the same quiz
  When I view my list or the quiz
  Then no other participant's identity, progress, or score is shown to me

AC10: Removed by the tutor
  Given the tutor removes me from the share
  When I refresh my list
  Then the quiz is no longer listed
  And I can no longer start it

AC11: Retake a quiz already submitted
  Given I already submitted an attempt for a joined quiz (DEC-39)
  When I open it again and play
  Then a new attempt is created
  And my previous attempt remains recorded and visible to the tutor
```

## Out of scope

- Searching or browsing the public catalogue ([US-011](us-011-find-a-quiz.md)).
- Push or email reminders (F-17, Phase 2).
- An in-app QR scanner (AS-012.1).
- Archiving completed entries out of the main list — **confirmed out of scope for Phase 1 (DEC-40)**.
- **Guardian-consent enforcement for joiners — not achievable without an account (see Issue I-3 in [US-010](../epic-c-publishing-sharing/us-010-share-quiz-via-link-or-qr.md)).**
- **Persisting a joined-quiz list across devices, or surviving cleared browser data — requires creating an account separately (see [US-001](../epic-a-identity-access-consent/us-001-sign-up-and-sign-in.md), [US-016](../epic-f-student-collections/us-016-save-quizzes-into-collections.md)). No prompt to do so is offered (DEC-41).**
- Tutor-side participant and response views ([US-010](../epic-c-publishing-sharing/us-010-share-quiz-via-link-or-qr.md), [US-015](../epic-e-response-review/us-015-review-student-responses.md)).

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Security | Participation is validated server-side on every request; holding a stale or guessed token must never grant access | §8 Security |
| Security | Join attempts must be rate limited to deter token guessing, now that no account/sign-up friction exists | OWASP — inferred from S5 |
| Privacy | A student must never see another participant's identity or results | §8 Privacy, A-12 |
| Privacy | Display names are self-reported and unverified; treat them as non-authoritative in any audit trail | AS-012.7 |
| Usability | The join flow must work on a phone in one pass: scan → type a name → play | S5 intent |
| Accessibility | The link must be usable without a camera or scanning ability | §8 Accessibility |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | F-11 (joined portion), F-10 |
| Decisions | S4 (link/QR join), **S5 (account-free join, confirmed 2026-08-30), DEC-39 (unlimited retakes), DEC-40 (no archiving), DEC-41 (no account prompt)** |
| Dependencies | [US-010](../epic-c-publishing-sharing/us-010-share-quiz-via-link-or-qr.md). **US-001/US-002 are no longer preconditions of joining** — they remain relevant only if the player later chooses to create an account (e.g. for [US-016](../epic-f-student-collections/us-016-save-quizzes-into-collections.md)) |
| Objective | BO-2, BO-3 |
| **Risks/Issues** | ~~I-3~~ — **Resolved (DEC-15): Sponsor accepts as risk; no consent gate built for this join path. See [US-010](../epic-c-publishing-sharing/us-010-share-quiz-via-link-or-qr.md) for detail.** |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| ~~Q-012.1~~ | ~~Business~~ | ~~Can a student retake a quiz they joined? If so, which attempt counts?~~ | **Resolved (DEC-39): unlimited retakes; every attempt is recorded and all are visible to the tutor — no single "counted" attempt.** |
| ~~Q-012.2~~ | ~~UX~~ | ~~Should completed entries be archived out of the main list after a period?~~ | **Resolved (DEC-40): out of scope for Phase 1 — no auto-archive.** |
| ~~Q-012.3~~ | ~~Business / UX~~ | ~~Should a joiner be offered an optional "create an account" step after playing, to keep their list across devices and unlock collections ([US-016](../epic-f-student-collections/us-016-save-quizzes-into-collections.md))?~~ | **Resolved (DEC-41): not needed.** |
| ~~Q-012.4~~ | ~~Business~~ | ~~Mirrors Q-010.1 — is nickname-only joining expected instead of a signed-in account?~~ | **Already resolved (DEC-8/S5): yes, nickname-only joining is expected. Renumbered here from a duplicate "Q-012.3" for clarity.** |
