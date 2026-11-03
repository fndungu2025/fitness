import { useMemo, useState } from 'react';
import { DURATIONS, EQUIPMENT, FOCUS_AREAS, INTENSITIES, WORKOUT_TYPES } from '../data/taxonomy.js';
import { EMPTY_FILTERS, filterVideos, hasActiveFilters, parseQuery } from '../lib/filter.js';
import { load, save } from '../lib/storage.js';
import { VideoGrid } from './VideoCard.jsx';

function ChipGroup({ legend, options, selected, onToggle }) {
  return (
    <fieldset className="chip-group">
      <legend>{legend}</legend>
      <div className="chips">
        {options.map((o) => {
          const on = selected.includes(o.id);
          return (
            <button key={o.id} type="button" className={`chip ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => onToggle(o.id)}>
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

const toggleIn = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

export default function Home({ videos, profile, favorites, toggleFavorite, stats }) {
  const [filters, setFilters] = useState(() => ({ ...EMPTY_FILTERS, ...load('filters', {}) }));
  const [showFilters, setShowFilters] = useState(false);
  const update = (patch) =>
    setFilters((f) => {
      const next = { ...f, ...patch };
      save('filters', next);
      return next;
    });

  const results = useMemo(() => filterVideos(videos, profile, filters), [videos, profile, filters]);
  const extraCount = filters.types.length + filters.durations.length + filters.equipment.length + filters.intensities.length;
  const queryFocus = parseQuery(filters.query).tags.focus;
  const showSpotNote = filters.focus === 'core' || queryFocus.includes('core');

  return (
    <>
      <section className="focus" aria-labelledby="focus-h">
        <h1 id="focus-h">What do you want to work on?</h1>
        <div className="focus__grid" role="group" aria-label="Body focus">
          {FOCUS_AREAS.map((a) => {
            const on = filters.focus === a.id;
            return (
              <button
                key={a.id}
                type="button"
                className={`focus__btn ${on ? 'is-on' : ''}`}
                aria-pressed={on}
                onClick={() => update({ focus: on ? null : a.id })}
              >
                <span className="focus__icon" aria-hidden="true">{a.icon}</span>
                <span>{a.label}</span>
                {a.note && <small>{a.note}</small>}
              </button>
            );
          })}
        </div>
      </section>

      <div className="toolbar">
        <label className="search">
          <span className="visually-hidden">Search workouts</span>
          <input
            type="search"
            placeholder='Try "tummy", "booty", "chair yoga"'
            value={filters.query}
            onChange={(e) => update({ query: e.target.value })}
          />
        </label>
        <button className="btn btn--ghost" aria-expanded={showFilters} aria-controls="filters" onClick={() => setShowFilters((s) => !s)}>
          Filters{extraCount ? ` (${extraCount})` : ''}
        </button>
      </div>

      {showFilters && (
        <section id="filters" className="filters">
          <ChipGroup legend="Workout type" options={WORKOUT_TYPES} selected={filters.types} onToggle={(id) => update({ types: toggleIn(filters.types, id) })} />
          <ChipGroup legend="Duration" options={DURATIONS} selected={filters.durations} onToggle={(id) => update({ durations: toggleIn(filters.durations, id) })} />
          <ChipGroup legend="Equipment" options={EQUIPMENT} selected={filters.equipment} onToggle={(id) => update({ equipment: toggleIn(filters.equipment, id) })} />
          <ChipGroup legend="Intensity" options={INTENSITIES} selected={filters.intensities} onToggle={(id) => update({ intensities: toggleIn(filters.intensities, id) })} />
        </section>
      )}

      {showSpotNote && (
        <p className="note">
          Core work strengthens your abs and helps with tummy control, but exercise can't burn fat from one spot.
          Mixing in full-body movement helps most.
        </p>
      )}
      {profile?.ageGroup === 'teen-13-17' && (
        <p className="note">Teen mode: the most intense videos are hidden. Involve a parent, guardian or coach.</p>
      )}

      <div className="results-head">
        <p aria-live="polite">{results.length} {results.length === 1 ? 'workout' : 'workouts'}</p>
        {hasActiveFilters(filters) && (
          <button className="btn btn--small btn--ghost" onClick={() => update({ ...EMPTY_FILTERS })}>
            Clear filters
          </button>
        )}
      </div>

      {results.length ? (
        <VideoGrid videos={results} favorites={favorites} toggleFavorite={toggleFavorite} stats={stats} />
      ) : (
        <div className="empty">
          <p>No workouts match all of these yet.</p>
          <button className="btn" onClick={() => update({ ...EMPTY_FILTERS })}>Clear filters</button>
        </div>
      )}
    </>
  );
}
