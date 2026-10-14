---
platform: linkedin, blog
---

# Posting schedule

One LinkedIn post a fortnight, and a blog post roughly once a month. The slots are an order, not a calendar: when a
slot is ready it goes out on the next posting day, and a slot that isn't ready waits without holding up the next one.

## How it works

- **Blog first for anything with depth.** A topic that needs more than a few short paragraphs is written as a blog
  post on codesthings.com. A LinkedIn post follows two or three days later: the one idea worth taking away, an image
  or a short video, and the link.
- **LinkedIn only for the short ones.** Something made, a photo set, a small finding. These need no blog post.
- **Alternate the two kinds.** An engineering post, then something made or photographed, then engineering again.
  The feed should look like a person who builds things, not a stream of opinions.
- **Every post carries media.** A screenshot, a photo, a diagram drawn in the site's style, or a 10 to 30 second
  screen recording. Never a stock image, never a text-only post.
- **Posting day:** Tuesday to Thursday, around 08:00 to 09:00 UK time.
- **Drafts** live in `posts/<yyyy-mm>-<slug>/post.md` next to their images. James posts them himself.

## What a post sounds like

- Quietly confident. Say what was done and what it changed, with real numbers where they exist.
- One idea per post. If there are two, it's two posts.
- No hashtags, no "I'm excited to announce", no lesson-of-the-day framing, no engagement questions at the end.
- Facts come from the CV data (`cv/data/*.json`) or the repos themselves, never from memory.
- Standing rules: no phone number; never link the Reddit profile; "senior or principal", never "staff"; Coventry,
  UK. On Songtradr: the old search service was a legacy Solr service that was good for its time; the 30s+ queries
  belonged to the stalled rebuild, never to Solr. Ingestion "moved away from" Kafka.
- Nothing confidential from an employer: describe the problem and the approach, not internal names, figures that
  weren't public, or anyone else's work as mine.

## Slots

| # | Topic | Where | Media |
|---|---|---|---|
| 1 | The new CV and site | LinkedIn | Four screenshots, desktop and phone, both themes (drafted) |
| 2 | Making my site fast: before and after Lighthouse numbers, what moved them, the check on every deploy | Blog (written, marked draft) then LinkedIn | Before and after score cards side by side |
| 3 | Lab Archive, Vol. I: building film-look filters for the CampSnap Pro | Blog then LinkedIn | The mountain tile showing one photo through several filters; a photo of the camera |
| 4 | How this site works, rewritten for the multi-repo setup: submodules, branch builds, the daily smoke check | Blog (rewrite of the March post) then LinkedIn | A diagram of the repos and where each one deploys, drawn in the site's style |
| 5 | Something made: the Dome canopy or the PicoCalc grip | LinkedIn | Photos, plus the MakerWorld link |
| 6 | From 250k to over a million releases a day: what re-engineering an ingestion pipeline taught me | Blog then LinkedIn | A simple throughput diagram, no internal names |
| 7 | Rescuing a stalled search rebuild: pinning down the real requirements before writing code | Blog then LinkedIn | A requirements-to-result diagram |
| 8 | A photo set | LinkedIn | Three to five photos |
| 9 | Using AI coding agents with guardrails: branch per change, secrets and phone checks before every commit, a human on anything public | Blog then LinkedIn | A screen recording of a change going from branch to live |
| 10 | Rescuing a mobile app that crashed in most sessions, and the NativeScript plugins that came out of it | Blog then LinkedIn | Plugin README screenshots, crash rate before and after if it can be shared |
| 11 | Motion you only miss when it's gone: the day arc and the sundial theme | Blog then LinkedIn | A 15 second recording of the buttons and cards through one day |
| 12 | ZeroCalc | LinkedIn (the blog post exists) | Photos from the post |

New topics go to the end unless one is time-sensitive.

## Prompt for drafting a slot

Paste this into a Claude Code session started in `~/projects/codesthings.com`, with the slot number filled in.

    Draft slot <N> from resources/profiles/linkedin/schedule.md.

    Read the schedule's "How it works" and "What a post sounds like" sections first and follow them. Read the
    sources the topic needs: cv/data/*.json for anything about past roles, the base-website and campsnap-filters
    repos for anything about those projects, and any existing post in base-website/data/blog on the same topic.
    Use only facts you can point to in those files.

    If the slot says Blog: write the post in base-website/data/blog/<yyyy-mm-dd>-<slug>.md with a summary line in
    the front matter and draft: true, on a branch in base-website, following its CLAUDE.md. Then write the
    LinkedIn post that follows it.

    For the LinkedIn post: write resources/profiles/linkedin/posts/<yyyy-mm>-<slug>/post.md in the same shape as
    posts/2026-10-launch/post.md (text, alt text per image, notes). Make or capture the media the slot lists and
    put it next to the post: screenshots and recordings of the live sites, or diagrams drawn as SVG in the site's
    colours and fonts and exported to PNG.

    Don't post anything, publish the blog post or merge to main. Show me the drafts and the images, then wait.
