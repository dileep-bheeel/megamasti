import { ArrowLeft, ChevronRight, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

export const sample = list => list[Math.floor(Math.random() * list.length)];
export const shuffle = list => [...list].sort(() => Math.random() - 0.5);

export function GameFrame({ game, children, onReset, score = 0, step = "LIVE" }) {
  return <div className="game-screen" style={{ "--game-accent": game.accent }}>
    <div className="game-orb" />
    <div className="game-toolbar">
      <Link to="/games" className="round-button" aria-label="Back to games"><ArrowLeft size={19} /></Link>
      <div className="game-identity"><span>{game.category}</span><strong>{game.title}</strong></div>
      <div className="game-stats"><span><Trophy size={15} />{score} XP</span><b>{step}</b>{onReset && <button className="round-button" onClick={onReset} aria-label="Reset game">↻</button>}</div>
    </div>
    <main className="game-stage">{children}</main>
  </div>;
}

export function Completion({ title = "Beautifully played.", text, xp = 120, onAgain }) {
  return <div className="completion">
    <div className="completion-mark"><Trophy /></div><span>ROUND COMPLETE</span>
    <h2>{title}</h2><p>{text}</p><div className="xp-award">+{xp} XP</div>
    <button className="cta" onClick={onAgain}>Play another round <ChevronRight /></button>
  </div>;
}
