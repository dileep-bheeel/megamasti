import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, Goal, Lightbulb, SlidersHorizontal, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import GameArtwork from "../components/GameArtwork";

export const sample = list => list[Math.floor(Math.random() * list.length)];
export const shuffle = list => [...list].sort(() => Math.random() - 0.5);

export function GameFrame({ game, children, onReset, score = 0, step = "LIVE" }) {
  const { markPlayed, recordScore, progress } = useProgress();
  const [started,setStarted] = useState(false);
  useEffect(() => { recordScore(game.id,score); },[game.id,recordScore,score]);

  return <div className="game-screen" style={{ "--game-accent": game.accent }}>
    <div className="game-orb" />
    <div className="game-toolbar">
      <Link to="/games" className="round-button" aria-label="Back to games"><ArrowLeft size={19} /></Link>
      <div className="game-identity"><span>{game.category}</span><strong>{game.title}</strong></div>
      <div className="game-stats"><span><Trophy size={15} />{score} XP</span><b>{step}</b>{onReset && <button className="round-button" onClick={onReset} aria-label="Restart game">↻</button>}</div>
    </div>
    <main className="game-stage">
      {!started ? <section className="game-intro">
        <div className="intro-visual"><GameArtwork game={game} compact /><div><span>{game.category}</span><b>{game.level}</b><small>{game.ages}</small></div></div>
        <div className="intro-content"><div className="intro-eyebrow"><div className="intro-icon"><Goal /></div><span className="panel-label">{game.duration} • {game.players}</span></div>
          <h1>{game.title}</h1><p>{game.description}</p>
          <dl><div><dt>Goal</dt><dd>{game.goal}</dd></div><div><dt>Controls</dt><dd>{game.controls}</dd></div><div><dt>Scoring</dt><dd>{game.scoring}</dd></div></dl>
          <aside><Lightbulb /><span><b>Good to know</b>{game.tip}</span></aside>
          {progress.bestScores[game.id] && <div className="personal-best"><Trophy /> Personal best: {progress.bestScores[game.id]} XP</div>}
          <button className="cta intro-start" onClick={() => { markPlayed(game.id); setStarted(true); }}>Start game <ChevronRight /></button>
        </div>
      </section> : children}
    </main>
  </div>;
}

export function Completion({ title = "Beautifully played.", text, xp = 120, onAgain }) {
  return <div className="completion">
    <div className="completion-mark"><Trophy /></div><span>ROUND COMPLETE</span>
    <h2>{title}</h2><p>{text}</p><div className="xp-award">+{xp} XP</div>
    <div className="result-actions"><button className="cta" onClick={onAgain}>Play again <ChevronRight /></button><Link to="/games"><SlidersHorizontal /> Choose another game</Link></div>
  </div>;
}
