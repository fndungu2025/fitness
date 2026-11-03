import { useEffect, useMemo, useState } from 'react';
import videos from './data/videos.json';
import { load, save } from './lib/storage.js';
import { useHashRoute, navigate } from './lib/router.js';
import { useLiveStats } from './lib/useLiveStats.js';
import Onboarding from './components/Onboarding.jsx';
import Home from './components/Home.jsx';
import VideoPage from './components/VideoPage.jsx';
import Favorites from './components/Favorites.jsx';
import About from './components/About.jsx';
import Header from './components/Header.jsx';

export default function App() {
  const route = useHashRoute();
  // undefined = never answered (show onboarding); {} = skipped.
  const [profile, setProfile] = useState(() => load('profile', undefined));
  const [favorites, setFavorites] = useState(() => load('favorites', []));
  const [theme, setTheme] = useState(() => load('theme', 'auto'));
  const [noticeSeen, setNoticeSeen] = useState(() => load('noticeSeen', false));
  const stats = useLiveStats(videos);

  useEffect(() => save('profile', profile), [profile]);
  useEffect(() => save('favorites', favorites), [favorites]);
  useEffect(() => save('noticeSeen', noticeSeen), [noticeSeen]);
  useEffect(() => {
    save('theme', theme);
    if (theme === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const byId = useMemo(() => Object.fromEntries(videos.map((v) => [v.id, v])), []);
  const toggleFavorite = (id) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const shared = { profile, favorites, toggleFavorite, stats };

  let page;
  if (profile === undefined || route.name === 'profile') {
    page = (
      <Onboarding
        initial={profile}
        firstRun={profile === undefined}
        onDone={(p) => {
          setProfile(p);
          navigate('/');
        }}
      />
    );
  } else if (route.name === 'video') {
    page = <VideoPage video={byId[route.id]} {...shared} />;
  } else if (route.name === 'favorites') {
    page = <Favorites videos={favorites.map((id) => byId[id]).filter(Boolean)} {...shared} />;
  } else if (route.name === 'about') {
    page = <About />;
  } else {
    page = <Home videos={videos} {...shared} />;
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header theme={theme} setTheme={setTheme} favoriteCount={favorites.length} profile={profile} />
      {!noticeSeen && (
        <div className="notice notice--first" role="region" aria-label="Safety notice">
          <p>
            <strong>General fitness information, not medical advice.</strong> Check with a doctor before starting,
            especially with an injury, a health condition, pregnancy or if you are older. Your choices are stored
            only on this device.
          </p>
          <button className="btn btn--small" onClick={() => setNoticeSeen(true)}>Got it</button>
        </div>
      )}
      <main id="main" tabIndex={-1}>{page}</main>
      <footer className="footer">
        <a href="#/about">Safety &amp; privacy</a>
        <span>Videos play from YouTube. Not medical advice.</span>
      </footer>
    </>
  );
}
