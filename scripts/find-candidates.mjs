#!/usr/bin/env node
// Admin script (PRD section 6): find candidate videos for a person to review and tag.
// Runs on the developer's machine only. Nothing here is auto-classified.
//
//   npm run find-candidates -- "glute workout low impact" [--max 25] [--min-minutes 5] [--max-minutes 45]
//
// Reads YOUTUBE_API_KEY from .env or the environment. Writes candidates.json
// (git-ignored) with a draft entry per video; fill in the tags after watching it,
// then copy approved entries into src/data/videos.json.
//
// Quota: search.list is assumed to cost 100 units, videos.list 1 unit (default 10,000/day).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

function loadEnv() {
  if (!existsSync('.env')) return;
  for (const line of readFileSync('.env', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

function parseArgs(argv) {
  const opts = { query: [], max: 25, minMinutes: 3, maxMinutes: 60 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--max') opts.max = Math.min(50, Number(argv[++i]));
    else if (a === '--min-minutes') opts.minMinutes = Number(argv[++i]);
    else if (a === '--max-minutes') opts.maxMinutes = Number(argv[++i]);
    else opts.query.push(a);
  }
  opts.query = opts.query.join(' ').trim();
  return opts;
}

// ISO 8601 duration (PT1H2M3S) to whole minutes.
function minutesOf(iso = '') {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return Math.round((+(m[1] ?? 0) * 3600 + +(m[2] ?? 0) * 60 + +(m[3] ?? 0)) / 60);
}

async function get(url) {
  const res = await fetch(url);
  const body = await res.json();
  if (!res.ok) {
    const reason = body?.error?.errors?.[0]?.reason ?? res.status;
    throw new Error(`YouTube API error: ${reason}${reason === 'quotaExceeded' ? ' (resets at midnight Pacific)' : ''}`);
  }
  return body;
}

async function main() {
  loadEnv();
  const key = process.env.YOUTUBE_API_KEY;
  const opts = parseArgs(process.argv.slice(2));
  if (!key) throw new Error('Set YOUTUBE_API_KEY in .env (see .env.example).');
  if (!opts.query) throw new Error('Usage: npm run find-candidates -- "search words" [--max 25]');

  const search = new URL('https://www.googleapis.com/youtube/v3/search');
  Object.entries({
    part: 'snippet', type: 'video', q: opts.query, maxResults: String(opts.max),
    videoEmbeddable: 'true', safeSearch: 'strict', relevanceLanguage: 'en', regionCode: 'US', key,
  }).forEach(([k, v]) => search.searchParams.set(k, v));
  const found = await get(search);
  const ids = (found.items ?? []).map((i) => i.id.videoId).filter(Boolean);
  if (!ids.length) return console.log('No results.');

  const details = new URL('https://www.googleapis.com/youtube/v3/videos');
  Object.entries({ part: 'snippet,contentDetails,statistics', id: ids.join(','), key })
    .forEach(([k, v]) => details.searchParams.set(k, v));
  const { items = [] } = await get(details);

  const existing = new Set(JSON.parse(readFileSync('src/data/videos.json', 'utf8')).map((v) => v.id));
  const candidates = items
    .map((v) => ({
      id: v.id,
      title: v.snippet.title,
      channel: v.snippet.channelTitle,
      url: `https://www.youtube.com/watch?v=${v.id}`,
      views: Number(v.statistics?.viewCount ?? 0),
      minutes: minutesOf(v.contentDetails?.duration),
      alreadyInLibrary: existing.has(v.id),
      // Draft tags: a reviewer fills these in after watching the whole video.
      ageGroups: [], sizeBands: [], type: '', focus: [], intensity: '', impact: '',
      equipment: [], tips: [], reviewed: null,
    }))
    .filter((c) => c.minutes >= opts.minMinutes && c.minutes <= opts.maxMinutes)
    .sort((a, b) => b.views - a.views);

  writeFileSync('candidates.json', JSON.stringify(candidates, null, 2) + '\n');
  console.log(`Query: "${opts.query}" -> ${candidates.length} candidates written to candidates.json (about 101 quota units used)\n`);
  for (const c of candidates) {
    console.log(`${c.alreadyInLibrary ? '✓' : ' '} ${String(c.minutes).padStart(3)} min  ${c.views.toLocaleString().padStart(12)} views  ${c.title}  [${c.id}]`);
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
