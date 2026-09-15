import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronRight, Goal, Lightbulb, SlidersHorizontal, Sparkles, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import GameArtwork from "../components/GameArtwork";
import { games } from "../data/games";
import { isPlayable, playableIds, withDetails } from "../data/gameDetails";
import { getDailyGame, getUtcDateKey } from "../utils/daily";

export const sample = list => list[Math.floor(Math.random() * list.length)];
export const shuffle = list => [...list].sort(() => Math.random() - 0.5);

const GameSessionContext = createContext(null);

export function GameFrame({ game, children, onReset, onStart, score = 0, step = "LIVE" }) {
  const { markPlayed, progress } = useProgress();
  const [started,setStarted] = useState(false);
  const previousBest = useRef(Number(progress.bestScores[game.id] || 0)).current;

  return <GameSessionContext.Provider value={{game,previousBest}}>
    <div className="game-screen" style={{ "--game-accent": game.accent }}>
      <div className="game-orb" />
      <div className="game-toolbar">
        <Link to="/games" className="round-button" aria-label="Back to games"><ArrowLeft size={19} /></Link>
        <div className="game-identity"><span>{game.category}</span><strong>{game.title}</strong></div>
        <div className="game-stats"><span aria-live="polite"><Trophy size={15} />{score} XP</span><b>{step}</b>{onReset && <button className="round-button" onClick={onReset} aria-label="Restart game">↻</button>}</div>
      </div>
      <main className="game-stage">
        {!started ? <section className="game-intro">
          <div className="intro-visual"><GameArtwork game={game} compact /><div><span>{game.category}</span><b>{game.level}</b><small>{game.ages}</small></div></div>
          <div className="intro-content"><div className="intro-eyebrow"><div className="intro-icon"><Goal /></div><span className="panel-label">{game.duration} • {game.players}</span></div>
            <h1>{game.title}</h1><p>{game.description}</p>
            <dl><div><dt>Goal</dt><dd>{game.goal}</dd></div><div><dt>Controls</dt><dd>{game.controls}</dd></div><div><dt>Scoring</dt><dd>{game.scoring}</dd></div></dl>
            <aside><Lightbulb /><span><b>Good to know</b>{game.tip}</span></aside>
            {previousBest > 0 && <div className="personal-best"><Trophy /> Personal best: {previousBest} XP</div>}
            <button className="cta intro-start" onClick={() => { markPlayed(game.id); onStart?.(); setStarted(true); }}>Start game <ChevronRight /></button>
          </div>
        </section> : children}
      </main>
    </div>
  </GameSessionContext.Provider>;
}

export function Completion({ title = "Beautifully played.", text, xp = 120, onAgain, detail }) {
  const session = useContext(GameSessionContext);
  const {markCompleted,recordScore,markDailyCompleted,progress} = useProgress();
  const committed = useRef(false);
  const game = session?.game;
  const previousBest = session?.previousBest || 0;
  const score = Math.max(0,Math.round(Number(xp) || 0));
  const isBest = score > previousBest;
  const improvement = previousBest > 0 ? score - previousBest : 0;
  const dailyId = getDailyGame(playableIds);
  const date = getUtcDateKey();

  useEffect(() => {
    if (!game || committed.current) return;
    committed.current = true;
    markCompleted(game.id,score);
    recordScore(game.id,score);
    if (game.id === dailyId && score > 0) markDailyCompleted(date,game.id,score);
  },[dailyId,date,game,markCompleted,markDailyCompleted,recordScore,score]);

  const related = game ? games.filter(item => isPlayable(item.id) && item.category === game.category && item.id !== game.id).map(withDetails) : [];
  const next = related[(progress.completed[game?.id] || 0) % Math.max(1,related.length)];

  return <div className="completion">
    <div className="completion-mark"><Trophy /></div><span>SESSION COMPLETE</span>
    <h2>{title}</h2><p>{text}</p>
    <div className="result-summary">
      <div><small>SCORE</small><strong>{score}</strong><span>XP earned</span></div>
      <div className={isBest ? "best-result" : ""}><small>{isBest ? "PERSONAL BEST" : "BEST"}</small><strong>{Math.max(score,previousBest)}</strong><span>{isBest ? (improvement > 0 ? "+" + improvement + " improvement" : "First score recorded") : "Try again to improve"}</span></div>
      {detail && <div><small>RESULT</small><strong>{detail.value}</strong><span>{detail.label}</span></div>}
    </div>
    {isBest && <div className="best-celebration"><Sparkles /> New personal best saved on this device</div>}
    <div className="result-actions"><button className="cta" onClick={onAgain}>Play again <ChevronRight /></button>{next ? <Link to={"/play/" + next.id}><span>Try next</span>{next.title}<ChevronRight /></Link> : <Link to="/games"><SlidersHorizontal /> Choose another game</Link>}</div>
  </div>;
}
