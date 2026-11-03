import { useState } from 'react';
import { AGE_GROUPS, SIZE_BANDS, WEIGHT_RANGES } from '../data/taxonomy.js';

// F1: pick age group and size band in under 30 seconds; skippable; editable any time.
export default function Onboarding({ initial, firstRun, onDone }) {
  const [ageGroup, setAgeGroup] = useState(initial?.ageGroup ?? null);
  const [sizeBand, setSizeBand] = useState(initial?.sizeBand ?? null);
  const [weightRange, setWeightRange] = useState(initial?.weightRange ?? '');

  return (
    <section className="onboarding">
      <h1>{firstRun ? 'Find workouts that fit you' : 'Your choices'}</h1>
      <p className="muted">Two quick choices. They stay on this device and you can change them any time.</p>

      <fieldset>
        <legend>Age group</legend>
        <div className="choice-row">
          {AGE_GROUPS.map((a) => (
            <button
              key={a.id}
              type="button"
              className={`choice ${ageGroup === a.id ? 'is-on' : ''}`}
              aria-pressed={ageGroup === a.id}
              onClick={() => setAgeGroup(ageGroup === a.id ? null : a.id)}
            >
              {a.label}
            </button>
          ))}
        </div>
        {ageGroup === 'teen-13-17' && (
          <p className="note">Teen mode hides the most intense videos. Please involve a parent, guardian or coach.</p>
        )}
      </fieldset>

      <fieldset>
        <legend>How do you like to move?</legend>
        <div className="choice-row">
          {SIZE_BANDS.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`choice choice--tall ${sizeBand === b.id ? 'is-on' : ''}`}
              aria-pressed={sizeBand === b.id}
              onClick={() => setSizeBand(sizeBand === b.id ? null : b.id)}
            >
              <strong>{b.label}</strong>
              <small>{b.hint}</small>
            </button>
          ))}
        </div>
      </fieldset>

      <details className="optional">
        <summary>Optional: weight range</summary>
        <p className="muted small">Used only to suggest low-impact options first. Never shared, no BMI.</p>
        <label className="select-label">
          <span className="visually-hidden">Weight range</span>
          <select value={weightRange} onChange={(e) => setWeightRange(e.target.value)}>
            <option value="">Prefer not to say</option>
            {WEIGHT_RANGES.map((w) => (
              <option key={w.id} value={w.id}>{w.label}</option>
            ))}
          </select>
        </label>
      </details>

      <div className="actions">
        <button className="btn" onClick={() => onDone({ ageGroup, sizeBand, weightRange: weightRange || null })}>
          Show my workouts
        </button>
        <button className="btn btn--ghost" onClick={() => onDone(firstRun ? {} : initial ?? {})}>
          {firstRun ? 'Skip for now' : 'Cancel'}
        </button>
      </div>
    </section>
  );
}
