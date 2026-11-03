import { useEffect, useState } from 'react';

// Tiny hash router: #/, #/video/:id, #/favorites, #/profile, #/about.
// Hash routes need no server rewrites on Netlify.
export function parseHash(hash) {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (parts[0] === 'video' && parts[1]) return { name: 'video', id: parts[1] };
  if (['favorites', 'profile', 'about'].includes(parts[0])) return { name: parts[0] };
  return { name: 'home' };
}

export function navigate(path) {
  window.location.hash = path;
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
