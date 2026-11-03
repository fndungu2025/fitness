import { useEffect, useState } from 'react';

// Optional live metadata from the edge function. If it is not deployed or fails,
// the app quietly falls back to the static data in videos.json.
export function useLiveStats(videos) {
  const [stats, setStats] = useState({});
  useEffect(() => {
    const ids = videos.filter((v) => !v.placeholder).map((v) => v.id);
    if (!ids.length) return;
    const controller = new AbortController();
    const chunks = [];
    for (let i = 0; i < ids.length; i += 50) chunks.push(ids.slice(i, i + 50));
    Promise.all(
      chunks.map((c) =>
        fetch(`/api/video-stats?ids=${encodeURIComponent(c.join(','))}`, { signal: controller.signal })
          .then((r) => (r.ok ? r.json() : { videos: {} }))
          .catch(() => ({ videos: {} })),
      ),
    ).then((results) => {
      if (!controller.signal.aborted) setStats(Object.assign({}, ...results.map((r) => r.videos ?? {})));
    });
    return () => controller.abort();
  }, [videos]);
  return stats;
}

export const formatViews = (n) =>
  n == null ? null : new Intl.NumberFormat('en', { notation: 'compact' }).format(n) + ' views';
