import SafetyNote from './SafetyNote.jsx';

export default function About() {
  return (
    <section className="prose">
      <h1>Safety &amp; privacy</h1>
      <SafetyNote />
      <h2>How videos are chosen</h2>
      <p>
        Every workout is watched by a person and tagged by age group, impact, intensity and body focus before it
        appears here. Nothing is picked automatically. If something looks wrong, use the report link on the video page.
      </p>
      <h2>About body focus</h2>
      <p>
        Exercise strengthens the muscles you target, but it can't burn fat from one area. That's why focus areas are
        named after muscle groups, like Core, and why we describe effort and impact rather than body size.
      </p>
      <h2>Your privacy</h2>
      <p>
        Your age group, movement style, optional weight range, filters and favorites are stored only in this browser
        (localStorage). No account, and nothing is sent to our server. Clearing your browser data removes them.
      </p>
      <p>
        Videos play through YouTube's privacy-enhanced embed (youtube-nocookie.com). When you play a video, YouTube's
        own <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a> and{' '}
        <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">terms of service</a> apply.
      </p>
      <p><a className="btn btn--ghost" href="#/profile">Change your choices</a></p>
    </section>
  );
}
