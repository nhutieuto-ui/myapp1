# US-007 — Attach an image or audio clip to a question

| Field | Value |
| --- | --- |
| Story ID | US-007 |
| Epic / Feature | Epic B — Media Library / F-06, F-07 |
| Priority | **Must** (Phase 1) |
| Status | Draft |
| Source | S1, F-06, F-07, DEC-1, A-7, A-9, C-2, C-3, **DEC-25, DEC-26, DEC-27** |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.2](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** language tutor,
> **I want to** upload an image or an audio clip and attach it to a question, option, or flashcard side,
> **so that** my students get visual context and listening practice that plain text cannot provide.

## Preconditions

- I am editing a quiz draft ([US-003](us-003-create-and-manage-quiz-draft.md)).
- Media storage/CDN is provisioned (D-1 — **gating**).

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-007.1 | Media is uploaded by the teacher and warranted as rights-cleared by them (A-7); **that warranty is confirmed once, at sign-up, not per upload (DEC-27, [US-001](../epic-a-identity-access-consent/us-001-sign-up-and-sign-in.md) AC8)** | Copyright exposure, worsened by public discoverability (DEC-5) |
| AS-007.2 | Clips are short; **supported image formats are the usual web formats (JPEG, PNG, GIF, WebP) and supported audio formats are MP3, WAV, and OGG (common formats — BA default); every file, image or audio, is capped at 2MB (DEC-25)** | Storage/bandwidth cost and a different upload architecture |
| AS-007.3 | Binary media is stored in object storage, not Postgres (C-3), and upload does not run inside a request handler (C-2) | Serverless timeouts and database bloat |
| AS-007.4 | Uploaded media is reusable across questions within the author's own library | Re-upload per question; more storage consumed |
| **AS-007.5** | **Each author is limited to 50 quizzes in total (DEC-26, enforced in [US-003](us-003-create-and-manage-quiz-draft.md) AC10)** — this is a quiz-count quota, not a media storage-size quota | If total media storage per author still needs its own cap, that is a separate, unresolved control |

## Workflow notes

- **Main flow:** author chooses upload → selects an image or audio file → file is validated and stored → media is attached to the target question/option/card side → author sees a preview.
- **Alternate flow:** author detaches media or replaces it with a different file.
- **Exception flow:** unsupported file type, oversized file, or failed upload.
- Mockup: *TBD*.

## Acceptance criteria

```gherkin
AC1: Attach an image to a question
  Given I am editing a question
  When I upload a supported image file within the size limit
  Then the image is stored and attached to the question
  And I see a preview of it in the editor

AC2: Attach an audio clip to a question
  Given I am editing a question
  When I upload a supported audio file within the size and duration limits
  Then the audio is attached
  And I can play it back in the editor

AC3: Reject an unsupported file type
  Given I am uploading media
  When the file type is not in the supported list
  Then the upload is rejected
  And I am told which file types are supported

AC4: Reject an oversized or over-length file
  Given I am uploading media
  When the file exceeds the configured size or duration limit
  Then the upload is rejected
  And I am told the applicable limit

AC5: Handle a failed upload
  Given an upload fails or is interrupted
  When I return to the editor
  Then no partial media is attached to the question
  And I can retry the upload

AC6: Replace or remove attached media
  Given a question already has media attached
  When I replace it with another file or remove it
  Then the question reflects the change
  And the question remains valid and playable

AC7: Media on a private quiz is not publicly reachable
  Given a quiz is still a draft
  When an unauthenticated visitor requests its media
  Then the media is not served

AC8: Content rights were confirmed at sign-up
  Given I am a tutor who confirmed content rights at sign-up ([US-001](../epic-a-identity-access-consent/us-001-sign-up-and-sign-in.md) AC8, DEC-27)
  When I upload media for a question
  Then the media is attached without a separate per-upload rights prompt
  And the asset is linked to my account-level rights confirmation for takedown review purposes
```

## Out of scope

- Learner-side audio recording or upload (**closed by DEC-1**).
- Video upload ([US-008](us-008-attach-video.md) — **fully descoped for Phase 1, DEC-28**, not just deferred).
- Media editing (cropping, trimming, transcoding presets).
- Automatic captions or transcripts (accessibility baseline handled manually — see NFR).

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Performance | Media should begin playback quickly on mobile networks; threshold *TBD* — owner: Solution Architect | §8 Performance |
| Architecture | Media in object storage + CDN; no long-running processing in a request handler | C-2, C-3, D-1 |
| Accessibility | Images require alternative text; audio requires a transcript or caption field | §8 Accessibility |
| Content rights | Rights confirmation is recorded per asset and is retrievable during a takedown review ([US-018](../epic-g-trust-safety/us-018-review-reports-and-take-down.md)) | §8 Content rights, A-7 |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | F-06, F-07 |
| Decisions | DEC-1, **DEC-25 (formats/size cap), DEC-26 (author quota), DEC-27 (rights confirmation timing)** |
| Dependencies | **D-1 media storage (gating)**, [US-003](us-003-create-and-manage-quiz-draft.md), [US-001](../epic-a-identity-access-consent/us-001-sign-up-and-sign-in.md) |
| Risks | R-4 (media cost), A-9 |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| ~~Q-007.1~~ | ~~Technical~~ | ~~What are the supported formats and the size/duration caps for images and audio?~~ | **Resolved (DEC-25): usual image formats (JPEG/PNG/GIF/WebP) and common audio formats (MP3/WAV/OGG, BA default); 2MB cap per file for both.** |
| ~~Q-007.2~~ | ~~Business~~ | ~~Is a per-author storage quota required?~~ | **Resolved (DEC-26): yes — 50 quizzes per author. Note: a quiz-count cap, not a storage-size cap; see AS-007.5.** |
| ~~Q-007.3~~ | ~~Legal~~ | ~~Is an explicit rights confirmation per upload required, or once per account at sign-up?~~ | **Resolved (DEC-27): once per account, at sign-up — see [US-001](../epic-a-identity-access-consent/us-001-sign-up-and-sign-in.md) AC8.** |
