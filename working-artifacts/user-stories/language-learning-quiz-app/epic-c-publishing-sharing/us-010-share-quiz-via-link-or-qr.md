# US-010 — Share a quiz by invitation link or QR code

| Field | Value |
| --- | --- |
| Story ID | US-010 |
| Epic / Feature | Epic C — Publishing & Sharing / F-10 |
| Priority | **Must** (Phase 1) — the primary Phase 1 value path (R-9 mitigation) |
| Status | Draft — **supersedes roster-based assignment (S4)**; **join is account-free (S5)** |
| Source | S1, F-10, DEC-4, **S4 — stakeholder change 2026-08-30: no student list; join by QR scan or invitation link**, **S5 — stakeholder decision 2026-08-30: no account required to join; enter a display name to play**, **DEC-32, DEC-33, DEC-34, DEC-35, DEC-36** |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.2](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** language tutor,
> **I want to** hand my students a join link or a QR code for a quiz,
> **so that** they can start practising immediately and I never have to build or maintain a list of students.

## Preconditions

- I own a quiz containing at least one valid question ([US-003](../epic-b-quiz-authoring-media/us-003-create-and-manage-quiz-draft.md)).
- I am signed in ([US-001](../epic-a-identity-access-consent/us-001-sign-up-and-sign-in.md)).

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-010.1 | Distribution is by a **share link**; the QR code encodes that same link. There is no roster, no per-student targeting, and no email invitation list (S4 — supersedes A-4) | Per-student assignment and a contact list must be reinstated |
| AS-010.2 | A quiz has **one active share link at a time**; the author can rotate it, which immediately invalidates the previous link | Multiple concurrent links (e.g. one per class) require link-set management and per-link reporting |
| AS-010.3 | A shared quiz is playable **only by holders of the link** and is not publicly discoverable; public visibility is a separate act ([US-009](us-009-publish-quiz-publicly.md)) | The visibility model must be reworked |
| AS-010.4 | **Resolved by S5:** a joiner needs **no account**. They enter a display name each time they join, and that name is what identifies their attempt to the author. There is no identity verification | Response attribution is only as reliable as the name typed; anyone can claim any name |
| AS-010.5 | The participant list is **emergent**: it is whoever joined via the link, not who was invited | Pre-defined recipients and "who has not started" reporting are impossible under this model |
| AS-010.6 | An optional due date applies to the share as a whole; late attempts are accepted and flagged | Hard cut-off logic and per-student dates must be built |
| AS-010.7 | Anyone holding the link can forward it; the author's controls are link rotation and participant removal, not prevention | Access control must move to per-person invitation, undoing S4 |
| **AS-010.8** | **Because joining needs no account, the app has no way to know a joiner's age. The guardian-consent gate required by DEC-3 cannot be technically enforced on this path — see Issue I-3 below** | If this is unacceptable, joining must require an account after all, reopening AS-010.4 |
| **AS-010.9** | **A short human-readable join code is offered alongside the link/QR, for devices that cannot scan (DEC-33)** | If not needed, the join screen only needs the link/QR |

## Workflow notes

- **Main flow:** author opens a quiz → creates the share → sees the join link and its QR code → displays the QR (full screen, for classroom scanning) or copies the link → students join ([US-012](../epic-d-discovery-play/us-012-join-quiz-via-link-or-qr.md)) → author sees the participants who joined and their responses ([US-015](../epic-e-response-review/us-015-review-student-responses.md)).
- **Alternate flow:** author sets or changes the due date, rotates the link, removes a participant, or closes the share.
- **Exception flow:** the link is opened after it was rotated, closed, or the quiz was taken down.
- Mockup: *TBD* — needs a QR display/projection view.

## Acceptance criteria

```gherkin
AC1: Create a join link and QR code
  Given I own a valid quiz
  When I create a share for it
  Then a unique join link is generated
  And a QR code encoding that same link is shown alongside it

AC2: Present the QR code for scanning
  Given a share exists for my quiz
  When I open the share view
  Then I can display the QR code large enough to be scanned from across a room
  And I can copy the join link and download the QR code as an image

AC3: The link grants access to a quiz that is not public
  Given my quiz is not published publicly
  When someone opens the join link and joins
  Then the quiz becomes playable for them
  And someone who does not hold the link cannot open or play it

AC4: Rotate the link
  Given a share link is active
  When I rotate it
  Then the previous link no longer allows anyone to join
  And participants who already joined keep their access

AC5: Close the share
  Given a share is active
  When I close it
  Then no one can join or start the quiz through the link
  And a participant with an attempt in progress can still complete and submit it

AC6: Optional due date and late flagging
  Given I set a due date on the share
  When a participant submits after that date
  Then the attempt is accepted
  And it is marked as late in my response review

AC7: See who has joined
  Given several people have joined through my link
  When I open the share view
  Then each participant is listed with their display name and join time
  And I can see whether they have started or submitted

AC8: Remove a participant
  Given someone joined my quiz who should not have
  When I remove them from the share
  Then they immediately lose access to the quiz
  And any attempt they already submitted remains visible to me

AC9: Only the owner can manage the share
  Given a quiz belongs to another author
  When I attempt to create, rotate, or close its share
  Then the action is rejected

AC10: Join using a human-readable code
  Given a share exists for my quiz
  When I view the share view
  Then a short human-readable join code is shown alongside the link and QR code (DEC-33)
  And a participant can join by typing that code instead of scanning or opening the link
```

## Out of scope

- Class/roster/group management and institutional admin (**closed by DEC-4**).
- **Assigning to a named list of students, and email invitations to specific addresses (removed by S4).**
- Multiple concurrent links per quiz (e.g. one per class) — **confirmed out of scope (DEC-35)**.
- Live synchronous game mode with a lobby and shared timer (out of scope, §6.2).
- Public discovery ([US-009](us-009-publish-quiz-publicly.md)).
- Attempt limits and time limits per share — **confirmed out of scope (DEC-34)**.
- Automatic share-link expiry — **confirmed out of scope (DEC-32)**.
- **Guardian-consent enforcement for joiners (not achievable without an account — see Issue I-3).**

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Security | The join token must be high-entropy and unguessable; access is validated server-side on every request, never inferred from the client | §8 Security, OWASP |
| Security | Join attempts must be rate limited to prevent token guessing and link scraping | OWASP — inferred from AS-010.7 |
| Privacy | Participants must not see each other's identities, attempts, or scores | §8 Privacy, A-12 |
| Privacy | Display names are unverified and self-reported; the author is told this is not a verified identity | AS-010.4 |
| Accessibility | Joining must be possible without scanning — the link itself, or a typed short code, is an equivalent path | §8 Accessibility |
| Performance | The QR display must render legibly on a projector; scan-to-join target *TBD* | §8 Performance |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | F-10 (re-shaped by S4 — the Vision & Scope still describes roster-based assignment; see the drift note in the [backlog index](../README.md)) |
| Decisions | DEC-4 (independent tutors), S4 (link/QR distribution), **S5 (account-free join, confirmed 2026-08-30), DEC-32 (no link expiry), DEC-33 (join code), DEC-34 (no attempt/time limits), DEC-35 (single link only), DEC-36 (no extra leak remedy needed)** |
| Dependencies | [US-003](../epic-b-quiz-authoring-media/us-003-create-and-manage-quiz-draft.md), [US-001](../epic-a-identity-access-consent/us-001-sign-up-and-sign-in.md) — **D-3 (email provider) is no longer required by this story** |
| Objective | BO-1 (fast time to distribute), BO-2 (closed feedback loop) |
| **Risks/Issues** | ~~**I-3**: S5 makes the DEC-3 guardian-consent gate unenforceable for joiners.~~ **Resolved (DEC-15): Sponsor accepts this as a risk. No consent gate will be built for the account-free join path; retained for audit trail.** |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| ~~Q-010.1~~ | ~~Business / Legal~~ | ~~Must a joiner have an account, or can they play with a nickname only?~~ | **Resolved (S5, 2026-08-30): no account; enter a display name to play. See Issue I-3 for the consequence.** |
| ~~I-3~~ | ~~Legal (Issue, not a question)~~ | ~~DEC-3 requires guardian consent for minors; S5 provides no mechanism to identify or gate a minor joining anonymously.~~ | **Resolved (DEC-15, Vision & Scope): Sponsor accepts this as a risk — no consent gate will be built for the account-free join path. Retained here for audit trail, not an open blocker.** |
| ~~Q-010.2~~ | ~~Business~~ | ~~Should a share link expire automatically? If so, what is the default lifetime?~~ | **Resolved (DEC-32): no automatic expiry.** |
| ~~Q-010.3~~ | ~~UX~~ | ~~Is a short human-readable join code needed alongside the QR, for devices that cannot scan?~~ | **Resolved (DEC-33): yes — see AS-010.9, AC10.** |
| ~~Q-010.4~~ | ~~Business~~ | ~~Are attempt limits or time limits required per share?~~ | **Resolved (DEC-34): no.** |
| ~~Q-010.5~~ | ~~Business~~ | ~~Does a tutor teaching several groups need more than one active link per quiz to tell the groups apart in reporting?~~ | **Resolved (DEC-35): no — a single active link per quiz is sufficient.** |
| ~~Q-010.6~~ | ~~Ops~~ | ~~If a link leaks publicly, is link rotation plus participant removal a sufficient remedy?~~ | **Resolved (DEC-36): yes, no further remedy needed.** |
