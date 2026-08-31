# US-011 — Find a quiz in the public catalogue

| Field | Value |
| --- | --- |
| Story ID | US-011 |
| Epic / Feature | Epic D — Discovery / F-11 |
| Priority | **Must** (Phase 1) — value depends on seeded content (R-9) |
| Status | Draft |
| Source | S1, F-11, DEC-5, R-9, **DEC-37, DEC-38, DEC-43** |
| Backlog | [Backlog index](../README.md) · [Vision & Scope v0.2](../../../vision-scope/language-learning-quiz-app/vision-and-scope.md) |

## Story statement

> **As a** learner,
> **I want to** search and browse published quizzes,
> **so that** I can quickly find practice material relevant to the language and topic I am studying.

## Preconditions

- At least one quiz is published ([US-009](../epic-c-publishing-sharing/us-009-publish-quiz-publicly.md)).

## Assumptions

| ID | Assumption | Impact if wrong |
| --- | --- | --- |
| AS-011.1 | Browsing and searching the public catalogue does not require sign-in; **playing and saving do require an account (confirmed, DEC-43)** | Anonymous play changes attempt storage and privacy analysis |
| AS-011.2 | Phase 1 search is keyword matching on title/description plus filters for content language and question type; **default browse order is most played, with newest as the secondary order/tiebreaker (DEC-38)** | A ranking/recommendation capability is needed |
| AS-011.3 | Author-supplied tags or topics are **not required in Phase 1 (confirmed, DEC-37)** | Tagging must be added to [US-003](../epic-b-quiz-authoring-media/us-003-create-and-manage-quiz-draft.md) to make filtering useful |

## Workflow notes

- **Main flow:** visitor opens discovery → sees results ordered by **most played, newest as tiebreaker (DEC-38)** → searches by keyword and/or filters by content language → sees a result list → opens a quiz detail view → starts it ([US-013](us-013-play-quiz-and-submit-attempt.md)).
- **Alternate flow:** no results; visitor clears filters or browses recent/popular quizzes.
- **Exception flow:** a quiz is unpublished or taken down between listing and opening.
- Mockup: *TBD*.

## Acceptance criteria

```gherkin
AC1: Search the public catalogue
  Given published quizzes exist
  When I search using a keyword that appears in a quiz title or description
  Then matching published quizzes are listed
  And each result shows the title, content language, question count, and author display name

AC2: Filter by content language
  Given the catalogue contains quizzes in Chinese, Japanese, and English
  When I filter by one content language
  Then only quizzes in that language are listed

AC3: Unpublished and draft quizzes are never listed
  Given a quiz is a draft, unpublished, or taken down
  When I search or browse the catalogue
  Then that quiz does not appear in any result

AC4: Empty result state
  Given my search matches no published quiz
  When the results are returned
  Then I am shown an empty-state message
  And I am offered a way to clear my search and filters

AC5: CJK search terms work
  Given a quiz title contains Chinese or Japanese text
  When I search using a substring of that text
  Then the quiz is returned
  And matching is character-aware rather than space-delimited

AC6: Quiz withdrawn after listing
  Given a quiz appeared in my results
  When it is unpublished or taken down before I open it
  Then opening it shows that the quiz is no longer available
  And no quiz content is returned
```

## Out of scope

- Personalised recommendations and ranking algorithms.
- Ratings, reviews, follower/author subscriptions.
- Tagging taxonomy and curated collections — **confirmed out of scope for Phase 1 (DEC-37)**.
- The student's list of quizzes joined by link or QR code ([US-012](us-012-join-quiz-via-link-or-qr.md)).

## Non-functional requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Internationalization | Search must handle Chinese and Japanese text without space-based tokenisation | C-5, DEC-2 |
| Privacy | Result data must expose only display names, never emails or learner identities | A-12 |
| Performance | Search results should feel instant; threshold *TBD* — owner: Solution Architect | §8 Performance |

## Traceability

| Item | Reference |
| --- | --- |
| Feature | F-11 (public portion) |
| Decisions | DEC-5, **DEC-37 (no tags/topics), DEC-38 (browse order), DEC-43 (sign-in required to play)** |
| Dependencies | [US-009](../epic-c-publishing-sharing/us-009-publish-quiz-publicly.md) |
| Risks | R-9 (cold start) |

## Open questions

| # | Area | Question | Blocks |
| --- | --- | --- | --- |
| ~~Q-011.1~~ | ~~Business~~ | ~~Are author-defined tags/topics required for discovery to be usable at launch?~~ | **Resolved (DEC-37): no.** |
| ~~Q-011.2~~ | ~~Business~~ | ~~What is the default browse order — newest, most played, or curated?~~ | **Resolved (DEC-38): most played, with newest as the secondary/tiebreaker order.** |
| **Q-011.3** | Legal | Should the public catalogue be reachable by unauthenticated minors, or gated behind sign-in? | **Deferred (2026-08-30) — Sponsor marked out of scope for this round; remains open, still blocked by D-6.** |
