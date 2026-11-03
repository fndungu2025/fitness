# Workout Finder (Fitness Workout Classifier)

A static web app that helps people find YouTube workout videos that fit them. Pick an age group, how you like to move and a body focus area, and get a short, classified list with intensity and impact on every card. No database, no accounts. See `docs/` for the PRD and API notes.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # filter and classification tests
npm run build    # outputs dist/
```

## Deploy on Netlify

1. In Netlify, **Add new site → Import from Git** and choose this repo, branch `main`. `netlify.toml` already sets the build command (`npm run build`) and publish folder (`dist`).
2. Add the YouTube key: **Site configuration → Environment variables → Add a variable**
   - Key: `YOUTUBE_API_KEY`
   - Value: your YouTube Data API v3 key (restricted to that API only)
   - Scope: at least *Functions* (edge functions read it at runtime)
3. Redeploy so the edge function picks up the variable.

The key lives only in Netlify's environment. The edge function `netlify/edge-functions/video-stats.js` reads it on the server, so it never ships to the browser or into git. **Do not paste the key into any file in this repo.**

## How it fits together

| Piece | What it does |
| --- | --- |
| `src/data/videos.json` | The video library and its tags. Source of truth. |
| `src/data/taxonomy.js` | The tag set: age groups, size bands, types, focus areas, intensity, duration, equipment, search aliases. |
| `src/lib/filter.js` | Filtering, teen-mode rules, low-impact preference, search-alias parsing. |
| `netlify/edge-functions/video-stats.js` | `GET /api/video-stats?ids=...` returns live views, likes and thumbnails for approved ids. Cached for an hour at the CDN. Only ids in `videos.json` are looked up, so it can't be abused to burn quota. |
| `scripts/find-candidates.mjs` | Run on your machine to search YouTube for candidates to review. |

User choices, filters and favorites are stored in the browser's localStorage only.

## Adding real videos

The library currently holds **16 sample entries** (`"placeholder": true`) so every screen works. Before launch, replace them with videos a person has watched and tagged:

```bash
cp .env.example .env    # then put your key in .env (git-ignored)
```

```bash
npm run find-candidates -- "low impact glute workout" --max 25
```

That writes `candidates.json` (git-ignored, about 101 quota units per run). Watch each video, fill in its tags, set `"reviewed"` to today's date, and copy approved entries into `src/data/videos.json` without the `placeholder` field. Example entry:

```json
{
  "id": "VIDEO_ID", "title": "…", "channel": "…",
  "ageGroups": ["adult-18-39", "adult-40-59"], "sizeBands": ["comfort", "standard"],
  "type": "strength", "focus": ["glutes"], "intensity": "moderate", "impact": "low",
  "minutes": 15, "equipment": ["none"], "tips": ["…"], "reviewed": "2026-11-03"
}
```

Launch target from the PRD: 150+ reviewed videos, at least 10 per focus area.

## Before launch

- Replace the sample videos (above).
- Set the real feedback address in `src/components/VideoPage.jsx` (`REPORT_EMAIL`).
- Rotate the YouTube API key if it was ever shared in a chat or file, and restrict it to the YouTube Data API v3.
