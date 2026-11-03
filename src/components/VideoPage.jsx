import { AGE_GROUPS, EQUIPMENT, FOCUS_AREAS, WORKOUT_TYPES, labelOf } from '../data/taxonomy.js';
import { formatViews } from '../lib/useLiveStats.js';
import { allowedForProfile } from '../lib/filter.js';
import { IntensityBadges } from './Badges.jsx';
import SafetyNote from './SafetyNote.jsx';

const REPORT_EMAIL = 'feedback@example.com'; // TODO: replace with the real feedback address before launch.

export default function VideoPage({ video, profile, favorites, toggleFavorite, stats }) {
  if (!video) {
    return (
      <div className="empty">
        <p>That video isn't in the library.</p>
        <a className="btn" href="#/">Back to workouts</a>
      </div>
    );
  }
  // A shared link must not bypass teen mode.
  if (!allowedForProfile(video, profile) && profile?.ageGroup === 'teen-13-17') {
    return (
      <div className="empty">
        <p>This workout isn't available in teen mode.</p>
        <a className="btn" href="#/">Back to workouts</a>
      </div>
    );
  }

  const live = stats[video.id];
  const title = live?.title ?? video.title;
  const isFav = favorites.includes(video.id);
  const reportHref = `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(`Report video ${video.id}`)}&body=${encodeURIComponent(`Video: ${title}\nWhat's wrong:\n`)}`;

  return (
    <article className="video-page">
      <a href="#/" className="back">← All workouts</a>

      {video.placeholder ? (
        <div className="player player--placeholder">
          <p><strong>Sample entry.</strong> Replace it with a reviewed YouTube video id in <code>src/data/videos.json</code>.</p>
        </div>
      ) : (
        <div className="player">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}?rel=0`}
            title={title}
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      )}

      <div className="video-page__head">
        <div>
          <h1>{title}</h1>
          <p className="muted">
            {live?.channel ?? video.channel}
            {live?.views != null && <> · {formatViews(live.views)}</>}
            {!video.placeholder && (
              <> · <a href={`https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`} target="_blank" rel="noopener noreferrer">Watch on YouTube</a></>
            )}
          </p>
        </div>
        <button className={`btn ${isFav ? '' : 'btn--ghost'}`} aria-pressed={isFav} onClick={() => toggleFavorite(video.id)}>
          {isFav ? '♥ Saved' : '♡ Save'}
        </button>
      </div>

      <IntensityBadges video={video} />

      {!video.placeholder && !video.reviewed && (
        <p className="note small">
          <strong>Pending review.</strong> These tags were assigned from the video's title and description. A
          reviewer hasn't watched it all the way through yet, so check the intensity for yourself.
        </p>
      )}

      <dl className="tags">
        <div><dt>Type</dt><dd>{labelOf(WORKOUT_TYPES, video.type)}</dd></div>
        <div><dt>Focus</dt><dd>{video.focus.map((f) => labelOf(FOCUS_AREAS, f)).join(', ')}</dd></div>
        <div><dt>Length</dt><dd>{video.minutes} min</dd></div>
        <div><dt>Equipment</dt><dd>{video.equipment.map((e) => labelOf(EQUIPMENT, e)).join(', ')}</dd></div>
        <div><dt>Suits</dt><dd>{video.ageGroups.map((a) => labelOf(AGE_GROUPS, a)).join(', ')}</dd></div>
      </dl>

      {video.tips?.length > 0 && (
        <section>
          <h2>Make it work for you</h2>
          <ul className="tips">
            {video.tips.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </section>
      )}

      <SafetyNote />
      <p className="small"><a href={reportHref}>Report a problem with this video</a></p>
    </article>
  );
}
