import { IMPACTS, INTENSITIES, labelOf } from '../data/taxonomy.js';

export function IntensityBadges({ video }) {
  return (
    <span className="badges">
      <span className={`badge badge--${video.intensity}`}>{labelOf(INTENSITIES, video.intensity)}</span>
      <span className={`badge badge--impact-${video.impact}`}>{labelOf(IMPACTS, video.impact)}</span>
    </span>
  );
}
