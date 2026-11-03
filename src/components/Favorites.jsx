import { VideoGrid } from './VideoCard.jsx';

export default function Favorites({ videos, favorites, toggleFavorite, stats }) {
  const total = videos.reduce((sum, v) => sum + v.minutes, 0);
  return (
    <section>
      <h1>Favorites</h1>
      {videos.length ? (
        <>
          <p className="muted">{videos.length} saved · {total} minutes in total · stored on this device only</p>
          <VideoGrid videos={videos} favorites={favorites} toggleFavorite={toggleFavorite} stats={stats} />
        </>
      ) : (
        <div className="empty">
          <p>Tap ♡ on any workout to save it here.</p>
          <a className="btn" href="#/">Browse workouts</a>
        </div>
      )}
    </section>
  );
}
