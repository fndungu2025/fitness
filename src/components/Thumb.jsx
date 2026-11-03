import { FOCUS_AREAS } from '../data/taxonomy.js';

export default function Thumb({ video, live }) {
  if (video.placeholder) {
    const icon = FOCUS_AREAS.find((f) => f.id === video.focus[0])?.icon ?? '⭐';
    return (
      <div className={`thumb thumb--placeholder thumb--${video.focus[0]}`} aria-hidden="true">
        <span className="thumb__icon">{icon}</span>
        <span className="thumb__tag">Sample</span>
        <span className="thumb__time">{video.minutes} min</span>
      </div>
    );
  }
  const src = live?.thumbnail ?? `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`;
  return (
    <div className="thumb">
      <img src={src} alt="" loading="lazy" decoding="async" width="320" height="180" />
      <span className="thumb__time">{video.minutes} min</span>
    </div>
  );
}
