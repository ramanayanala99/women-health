import Link from "next/link";

export default function Home() {
  return (
    <div className="maths-home">
      <header className="maths-header">
        <Link className="maths-brand" href="/" aria-label="MathsMadeEasyAI home"><span>m<span className="brand-dot">.</span></span> MathsMadeEasyAI</Link>
        <nav aria-label="Main navigation"><a href="#how-it-works">The learning experience</a><a className="small-cta" href="/tutor/index.html">Enter classroom <span aria-hidden="true">↗</span></a></nav>
      </header>
      <main>
        <section className="maths-hero">
          <div className="hero-copy">
            <p className="eyebrow">ONE LEARNER. ONE CONVERSATION. YOUR PACE.</p>
            <h1>Maths makes sense.<br /><em>When it’s taught<br />for you.</em></h1>
            <p className="hero-description">A patient AI maths tutor that explains, listens, and works through problems with you. Ask again. Try another way. Find your “oh, I get it” moment.</p>
            <a className="hero-cta" href="/tutor/index.html">Let’s learn together <span aria-hidden="true">↗</span></a>
            <p className="hero-note">Prepared lessons · Interactive whiteboard · Voice &amp; text</p>
            <p className="hero-note"><a className="board-preview-link" href="/tutor/index.html?grade8-algebra=1">Open two Grade 8 algebra chalkboard chapters <span aria-hidden="true">↗</span></a></p>
            <p className="hero-note"><a className="board-preview-link" href="/tutor/board-preview.html">Preview one Grade 9 chalkboard class <span aria-hidden="true">↗</span></a></p>
          </div>
          <div className="lesson-preview" aria-label="Example of a step-by-step maths lesson">
            <div className="preview-top"><span className="live-dot" /> YOUR PERSONAL CLASSROOM <span className="lesson-number">01 / LEARN IT</span></div>
            <div className="chalkboard">
              <p className="board-label">Let’s make the unknown, known.</p>
              <div className="board-equation">2<span>𝑥</span> + 4 = 12</div>
              <div className="board-working"><span>Subtract 4 from both sides</span><strong>2𝑥 = 8</strong><span>Now divide both sides by 2</span><strong className="board-answer">𝑥 = 4 <span aria-hidden="true">✓</span></strong></div>
              <div className="board-doodle" aria-hidden="true">understand it,<br />don’t just memorise it <span>↗</span></div>
            </div>
            <div className="sample-conversation"><span className="tutor-symbol" aria-hidden="true">m.</span><p>“Think of an equation like a balanced scale. What we do on one side, we do on the other.”<small>One small step. Then it’s your turn.</small></p></div>
            <div className="preview-footer"><span>✦ A hint, not just the answer</span><span>Illustrative lesson</span></div>
          </div>
        </section>
        <section className="learning-strip" aria-label="Learning approach"><span>LEARN IT</span><span aria-hidden="true">↗</span><span>PRACTISE IT</span><span aria-hidden="true">↗</span><span>USE IT</span><span aria-hidden="true">↗</span><span>BUILD CONFIDENCE</span></section>
        <section id="how-it-works" className="learning-experience">
          <div className="experience-heading"><p className="eyebrow">A LITTLE LESS PRESSURE. A LOT MORE UNDERSTANDING.</p><h2>A classroom with<br /><em>room for your questions.</em></h2><p>Start with your level and a topic. Your tutor takes it from there, one manageable step at a time.</p></div>
          <div className="experience-cards">
            <article><span className="card-number">01</span><h3>See the idea.</h3><p>Clear explanations, worked examples, and diagrams turn abstract maths into something you can follow.</p></article>
            <article><span className="card-number">02</span><h3>Talk it through.</h3><p>Type a question or use your browser’s microphone when supported. Ask for a hint or a simpler explanation.</p></article>
            <article><span className="card-number">03</span><h3>Make it yours.</h3><p>Try guided questions, write on your scratchpad, and practise with worksheets. Return to your saved learning on this browser.</p></article>
          </div>
        </section>
        <section className="start-banner"><div><p className="eyebrow">EVERY GREAT QUESTION STARTS SOMEWHERE.</p><h2>Yours can start here.</h2></div><a className="hero-cta" href="/tutor/index.html">Open my classroom <span aria-hidden="true">↗</span></a></section>
      </main>
      <footer className="maths-footer"><span>MathsMadeEasyAI <span aria-hidden="true">✦</span> Learn at your own pace.</span><p>AI is a learning companion, not a human teacher. Check important answers with a teacher or trusted adult. Prepared lessons work even when the AI connection is unavailable.</p></footer>
    </div>
  );
}
