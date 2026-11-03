import { describe, expect, it } from 'vitest';
import videos from '../data/videos.json';
import { EMPTY_FILTERS, filterVideos, parseQuery } from './filter.js';

const f = (over = {}) => ({ ...EMPTY_FILTERS, ...over });

describe('parseQuery', () => {
  it('maps everyday words to tags', () => {
    expect(parseQuery('tummy').tags.focus).toEqual(['core']);
    expect(parseQuery('Booty with bands').tags).toMatchObject({ focus: ['glutes'], equipment: ['bands'] });
    expect(parseQuery('full body').tags.focus).toEqual(['full-body']);
  });
  it('keeps unknown words for title search', () => {
    expect(parseQuery('morning tummy').rest).toEqual(['morning']);
  });
});

describe('filterVideos', () => {
  it('returns everything with no profile or filters', () => {
    expect(filterVideos(videos, null, f())).toHaveLength(videos.length);
  });

  it('teen mode never shows intense videos', () => {
    const r = filterVideos(videos, { ageGroup: 'teen-13-17' }, f());
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((v) => v.intensity !== 'intense' && v.ageGroups.includes('teen-13-17'))).toBe(true);
  });

  it('filters by focus area and search alias alike', () => {
    const byPicker = filterVideos(videos, null, f({ focus: 'core' }));
    const bySearch = filterVideos(videos, null, f({ query: 'tummy' }));
    expect(byPicker.map((v) => v.id)).toEqual(bySearch.map((v) => v.id));
    expect(byPicker.every((v) => v.focus.includes('core'))).toBe(true);
  });

  it('combines duration, equipment and intensity filters', () => {
    const r = filterVideos(videos, null, f({ durations: ['10-20'], equipment: ['chair'], intensities: ['gentle'] }));
    expect(r.length).toBeGreaterThan(0);
    for (const v of r) {
      expect(v.minutes).toBeGreaterThanOrEqual(10);
      expect(v.minutes).toBeLessThanOrEqual(20);
      expect(v.equipment).toContain('chair');
      expect(v.intensity).toBe('gentle');
    }
  });

  it('puts low-impact videos first for the comfort band', () => {
    const r = filterVideos(videos, { sizeBand: 'comfort' }, f());
    const firstHigh = r.findIndex((v) => v.impact === 'high');
    const lastLow = r.map((v) => v.impact).lastIndexOf('low');
    if (firstHigh !== -1) expect(lastLow).toBeLessThan(firstHigh);
  });

  it('every focus area has at least one sample video', () => {
    for (const focus of ['glutes', 'core', 'legs', 'arms', 'back', 'full-body']) {
      expect(filterVideos(videos, null, f({ focus })).length).toBeGreaterThan(0);
    }
  });
});
