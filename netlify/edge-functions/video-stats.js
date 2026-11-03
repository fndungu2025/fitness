// Netlify Edge Function: live view counts, thumbnails and durations for approved videos.
//
// GET /api/video-stats?ids=ID1,ID2,...
//
// The YouTube Data API key comes from the YOUTUBE_API_KEY environment variable,
// set in the Netlify UI (Site configuration > Environment variables). It is read
// here on the server and never sent to the browser.
//
// Only ids listed in src/data/videos.json are looked up, so the endpoint cannot
// be used as an open proxy that burns quota. One videos.list call costs 1 unit
// for up to 50 ids, and responses are cached at the CDN for an hour.

import videos from '../../src/data/videos.json' with { type: 'json' };

const APPROVED = new Set(videos.filter((v) => !v.placeholder).map((v) => v.id));
const ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const MAX_IDS = 50;

const json = (body, status = 200, cache = 'no-store') =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': cache,
      'netlify-cdn-cache-control': cache === 'no-store' ? 'no-store' : 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });

export default async (request) => {
  if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405);

  const apiKey = Netlify.env.get('YOUTUBE_API_KEY');
  if (!apiKey) return json({ error: 'YOUTUBE_API_KEY is not configured' }, 500);

  const requested = (new URL(request.url).searchParams.get('ids') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const ids = [...new Set(requested)]
    .filter((id) => ID_PATTERN.test(id) && APPROVED.has(id))
    .sort()
    .slice(0, MAX_IDS);
  if (ids.length === 0) return json({ videos: {} }, 200, 'public, max-age=3600');

  const api = new URL('https://www.googleapis.com/youtube/v3/videos');
  api.searchParams.set('part', 'snippet,contentDetails,statistics');
  api.searchParams.set('id', ids.join(','));
  api.searchParams.set(
    'fields',
    'items(id,snippet(title,channelTitle,thumbnails(medium,high)),contentDetails(duration),statistics(viewCount,likeCount))',
  );
  api.searchParams.set('key', apiKey);

  let res;
  try {
    res = await fetch(api, { headers: { accept: 'application/json' } });
  } catch {
    return json({ error: 'YouTube API unreachable' }, 502);
  }
  if (!res.ok) {
    // 403 quotaExceeded lands here; do not leak the upstream body (it can echo the request URL).
    return json({ error: 'YouTube API error', status: res.status }, 502);
  }

  const data = await res.json();
  const out = {};
  for (const item of data.items ?? []) {
    out[item.id] = {
      title: item.snippet?.title,
      channel: item.snippet?.channelTitle,
      thumbnail: item.snippet?.thumbnails?.high?.url ?? item.snippet?.thumbnails?.medium?.url,
      duration: item.contentDetails?.duration,
      views: Number(item.statistics?.viewCount ?? 0),
      likes: item.statistics?.likeCount == null ? null : Number(item.statistics.likeCount),
    };
  }
  return json({ videos: out }, 200, 'public, max-age=3600');
};

export const config = { path: '/api/video-stats', cache: 'manual' };
