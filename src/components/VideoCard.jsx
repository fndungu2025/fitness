import { WORKOUT_TYPES, labelOf } from '../data/taxonomy.js';
import { formatViews } from '../lib/useLiveStats.js';
import { IntensityBadges } from './Badges.jsx';
import Thumb from './Thumb.jsx';

export default function VideoCard({ video, live, isFavorite, toggleFavorite }) {
  const title = live?.title ?? video.title;
  return (
    <article className="card">
      <a href={`#/video/${encodeURIComponent(video.id)}`} className="card__link">
        <Thumb video={video} live={live} />
        <div className="card__body">
          <h3 className="card__title">{title}</h3>
          <p className="card__meta">
            {labelOf(WORKOUT_TYPES, video.type)}
            {live?.views != null && <> · {formatViews(live.views)}</>}
          </p>
          <IntensityBadges video={video} />
        </div>
      </a>
      <button
        className={`fav-btn ${isFavorite ? 'is-on' : ''}`}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `Remove ${title} from favorites` : `Save ${title} to favorites`}
        onClick={() => toggleFavorite(video.id)}
      >
        {isFavorite ? '♥' : '♡'}
      </button>
    </article>
  );
}

export function VideoGrid({ videos, favorites, toggleFavorite, stats }) {
  return (
    <div className="grid">
      {videos.map((v) => (
        <VideoCard
          key={v.id}
          video={v}
          live={stats[v.id]}
          isFavorite={favorites.includes(v.id)}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  );
}
