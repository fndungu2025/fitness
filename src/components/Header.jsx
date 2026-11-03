import { AGE_GROUPS, SIZE_BANDS, labelOf } from '../data/taxonomy.js';

const NEXT_THEME = { auto: 'light', light: 'dark', dark: 'auto' };
const THEME_LABEL = { auto: 'Theme: auto', light: 'Theme: light', dark: 'Theme: dark' };

export default function Header({ theme, setTheme, favoriteCount, profile }) {
  const summary = [
    profile?.ageGroup && labelOf(AGE_GROUPS, profile.ageGroup),
    profile?.sizeBand && labelOf(SIZE_BANDS, profile.sizeBand),
  ].filter(Boolean);

  return (
    <header className="header">
      <a href="#/" className="brand">
        <img src="/favicon.svg" alt="" width="28" height="28" />
        <span>Workout Finder</span>
      </a>
      <nav className="header__nav" aria-label="Main">
        <a href="#/profile" className="chip chip--ghost" title="Edit your choices">
          {summary.length ? summary.join(' · ') : 'Set your profile'}
        </a>
        <a href="#/favorites" className="icon-btn" aria-label={`Favorites (${favoriteCount})`}>
          ♥<span className="count">{favoriteCount || ''}</span>
        </a>
        <button className="icon-btn" onClick={() => setTheme(NEXT_THEME[theme])} aria-label={THEME_LABEL[theme]} title={THEME_LABEL[theme]}>
          {theme === 'dark' ? '☾' : theme === 'light' ? '☀' : '◐'}
        </button>
      </nav>
    </header>
  );
}
