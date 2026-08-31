# US-008 — Attach a video clip to a question

> **DESCOPED (DEC-28, 2026-08-30).** Video upload will not be built in Phase 1 at all. This supersedes the earlier "Should, first trim candidate" priority (DEC-6) with an outright removal. Kept in the backlog, unmodified below, for audit trail — do not implement without a new Sponsor decision reopening this story.

| Field | Value |
| --- | --- |
| Story ID | US-008 |
| Epic / Feature | Epic B — Media Library / F-08 |
| Priority | ~~**Should** (Phase 1, DEC-6) — first trim candidate under timeline pressure~~ **Descoped (DEC-28)** |
| Status | ~~Draft~~ **Descoped — not building in Phase 1** |
| Source | S1, F-08, DEC-6, R-4, **DEC-28** |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.2](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** language tutor,
> **I want to** attach a short video clip to a question,
> **so that** my students can practise with authentic contextual and cultural material.

## Preconditions

- [US-007](us-007-attach-image-or-audio.md) is delivered (media upload pipeline exists).
- Video storage, delivery, and cost caps are confirmed (D-1, R-4).

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-008.1 | Videos are short clips with a hard duration and size cap (A-9) | Streaming, transcoding, and cost profile change materially |
| AS-008.2 | Videos are served directly from storage/CDN with no server-side transcoding in Phase 1 | A transcoding pipeline and additional cost/latency are added |
| AS-008.3 | Only a limited set of browser-playable formats is accepted; unsupported formats are rejected rather than converted | Authors are blocked by their source files; conversion becomes necessary |

## Workflow notes

- **Main flow:** as [US-007](us-007-attach-image-or-audio.md), with video-specific format, size, and duration validation.
- **Exception flow:** unsupported codec/container, oversized file, playback failure on the student device.
- Mockup: *TBD*.

## Acceptance criteria

```gherkin
AC1: Attach a video to a question
  Given I am editing a question
  When I upload a supported video file within the size and duration limits
  Then the video is attached
  And I can play it back in the editor

AC2: Reject an unsupported or oversized video
  Given I am uploading a video
  When the format is unsupported or the file exceeds the size or duration cap
  Then the upload is rejected
  And I am told the supported formats and the applicable limits

AC3: Video plays during a quiz attempt
  Given a published quiz contains a question with an attached video
  When a student plays that question on a supported browser
  Then the video is playable with standard controls
  And the student can answer without leaving the question

AC4: Graceful degradation when video cannot play
  Given a student's device or network cannot play the attached video
  When the question is displayed
  Then the question text and answer input remain usable
  And the student is shown that the media could not be played
```

## Out of scope

- Server-side transcoding and adaptive bitrate streaming.
- Embedding third-party videos by URL (YouTube, Vimeo) — raise separately if wanted (Q-008.2).
- Automatic captions.

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Cost | Per-file duration/size caps must bound storage and bandwidth cost | R-4 mitigation |
| Accessibility | A caption or transcript field must be available for video | §8 Accessibility |
| Performance | Playback should start quickly on mobile networks; threshold *TBD* | §8 Performance |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | F-08 |
| Decisions | DEC-6 (superseded), **DEC-28 (fully descoped for Phase 1)** |
| Dependencies | [US-007](us-007-attach-image-or-audio.md), D-1 |
| Risks | ~~R-4~~ **Closed (DEC-28) — no video cost risk remains** |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| ~~Q-008.1~~ | ~~Technical~~ | ~~What are the video duration/size caps and accepted formats?~~ | **Moot (DEC-28): story descoped, not building in Phase 1.** |
| ~~Q-008.2~~ | ~~Business~~ | ~~Would embedding an external video URL satisfy the need at far lower cost?~~ | **Moot (DEC-28): story descoped; revisit only if this story is reopened.** |
| ~~Q-008.3~~ | ~~Business~~ | ~~If Phase 1 is time-constrained, is dropping this story pre-approved?~~ | **Resolved (DEC-28): yes — dropped outright, answering this question directly.** |
