import { DURATIONS, SEARCH_ALIASES, WEIGHT_RANGES } from '../data/taxonomy.js';

export const EMPTY_FILTERS = {
  focus: null, // single focus area id
  types: [],
  durations: [],
  equipment: [],
  intensities: [],
  query: '',
};

export const hasActiveFilters = (f) =>
  Boolean(f.focus || f.types.length || f.durations.length || f.equipment.length || f.intensities.length || f.query.trim());

/**
 * Turn a free-text query into tag filters (F7). "tummy chair" -> { focus: ['core'], equipment: ['chair'] }.
 * Words that are not aliases are kept in `rest` and matched against titles.
 */
export function parseQuery(query) {
  const tags = { focus: [], type: [], equipment: [], intensity: [], impact: [] };
  let text = ` ${query.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ')} `;
  // Longest aliases first so "full body" wins over "body".
  const aliases = Object.keys(SEARCH_ALIASES).sort((a, b) => b.length - a.length);
  for (const alias of aliases) {
    const needle = ` ${alias} `;
    if (text.includes(needle)) {
      for (const [dim, value] of Object.entries(SEARCH_ALIASES[alias])) {
        if (!tags[dim].includes(value)) tags[dim].push(value);
      }
      text = text.split(needle).join(' ');
    }
  }
  const rest = text.split(/\s+/).filter(Boolean);
  return { tags, rest };
}

const durationMatches = (minutes, ids) =>
  ids.some((id) => {
    const d = DURATIONS.find((x) => x.id === id);
    return d && minutes >= d.min && minutes <= d.max;
  });

const anyOverlap = (a, b) => a.some((x) => b.includes(x));

export function prefersLowImpact(profile) {
  if (!profile) return false;
  if (profile.ageGroup === 'senior-60') return true;
  if (profile.sizeBand === 'comfort') return true;
  return Boolean(WEIGHT_RANGES.find((w) => w.id === profile.weightRange)?.preferLowImpact);
}

/** Videos the profile may see at all, before user filters (PRD section 4 and 8). */
export function allowedForProfile(video, profile) {
  if (!profile) return true;
  if (profile.ageGroup) {
    if (!video.ageGroups.includes(profile.ageGroup)) return false;
    // Teen mode: no max-intensity content.
    if (profile.ageGroup === 'teen-13-17' && video.intensity === 'intense') return false;
  }
  if (profile.sizeBand && !video.sizeBands.includes(profile.sizeBand)) return false;
  return true;
}

export function filterVideos(videos, profile, filters) {
  const { tags, rest } = parseQuery(filters.query || '');
  const focus = [filters.focus, ...tags.focus].filter(Boolean);
  const types = [...filters.types, ...tags.type];
  const equipment = [...filters.equipment, ...tags.equipment];
  const intensities = [...filters.intensities, ...tags.intensity];

  const result = videos.filter((v) => {
    if (!allowedForProfile(v, profile)) return false;
    if (focus.length && !anyOverlap(focus, v.focus)) return false;
    if (types.length && !types.includes(v.type)) return false;
    if (equipment.length && !anyOverlap(equipment, v.equipment)) return false;
    if (intensities.length && !intensities.includes(v.intensity)) return false;
    if (tags.impact.length && !tags.impact.includes(v.impact)) return false;
    if (filters.durations.length && !durationMatches(v.minutes, filters.durations)) return false;
    if (rest.length) {
      const hay = `${v.title} ${v.channel ?? ''}`.toLowerCase();
      if (!rest.every((w) => hay.includes(w))) return false;
    }
    return true;
  });

  // Size band and weight range steer impact: low-impact picks first when preferred.
  if (prefersLowImpact(profile)) {
    result.sort((a, b) => (a.impact === 'low' ? 0 : 1) - (b.impact === 'low' ? 0 : 1));
  }
  return result;
}
