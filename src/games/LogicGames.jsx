import { useState } from "react";
import { Brain, Lightbulb } from "lucide-react";
import { prompts } from "../data/content";
import { Completion, GameFrame, shuffle } from "./Common";

const puzzle = [5,3,0,0,7,0,0,0,0,6,0,0,1,9,5,0,0,0,0,9,8,0,0,0,0,6,0,8,0,0,0,6,0,0,0,3,4,0,0,8,0,3,0,0,1,7,0,0,0,2,0,0,0,6,0,6,0,0,0,0,2,8,0,0,0,0,4,1,9,0,0,5,0,0,0,0,8,0,0,7,9];
const solution = [5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9];

export function Sudoku({ game }) {
  const [grid, setGrid] = useState([...puzzle]);
  const [selected, setSelected] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const complete = grid.every((number, index) => number === solution[index]);
  const reset = () => { setGrid([...puzzle]); setSelected(null); setMistakes(0); };
  const enter = number => {
    if (selected === null || puzzle[selected]) return;
    if (solution[selected] !== number) setMistakes(value => value + 1);
    setGrid(values => values.map((value, index) => index === selected ? number : value));
  };

  if (complete) return <GameFrame game={game} score={180 - mistakes * 10} onReset={reset}><Completion title="Grid mastered." text={"Completed with " + mistakes + " mistakes. Your pattern discipline is getting stronger."} xp={180 - mistakes * 10} onAgain={reset} /></GameFrame>;

  return <GameFrame game={game} score={Math.max(0, 80 - mistakes * 10)} step={mistakes + " MISTAKES"} onReset={reset}>
    <div className="sudoku-layout">
      <section><div className="challenge-kicker"><Brain /> Classic expert logic</div><h1>Every digit has one place.</h1>
        <div className="sudoku-board">{grid.map((number, index) => <button key={index} className={(puzzle[index] ? "given " : "") + (selected === index ? "selected" : "")} onClick={() => setSelected(index)}>{number || ""}</button>)}</div>
        <div className="number-pad">{[1,2,3,4,5,6,7,8,9].map(number => <button key={number} onClick={() => enter(number)}>{number}</button>)}</div>
      </section>
      <aside className="lesson-panel"><span className="panel-label">COACH’S NOTE</span><h2>Scan before guessing.</h2><p>Examine the row, column and 3×3 box. The missing digit must satisfy all three.</p><div className="tip"><Lightbulb /> Start with rows containing five or more digits.</div></aside>
    </div>
  </GameFrame>;
}

export function Mastermind({ game }) {
  const colors = ["#ff6577","#ffca5c","#5ee6a8","#6ca5ff","#bf85ff","#ff8ad8"];
  const [secret, setSecret] = useState(() => shuffle(colors).slice(0,4));
  const [guess, setGuess] = useState([]);
  const [rows, setRows] = useState([]);
  const [won, setWon] = useState(false);
  const reset = () => { setSecret(shuffle(colors).slice(0,4)); setGuess([]); setRows([]); setWon(false); };
  const submit = () => {
    if (guess.length !== 4) return;
    const exact = guess.filter((color,index) => color === secret[index]).length;
    const remaining = secret.filter((color,index) => color !== guess[index]);
    let partial = 0;
    guess.forEach((color,index) => {
      if (color !== secret[index]) {
        const found = remaining.indexOf(color);
        if (found >= 0) { partial += 1; remaining.splice(found,1); }
      }
    });
    setRows(value => [...value,{guess:[...guess],exact,partial}]);
    setGuess([]);
    if (exact === 4) setWon(true);
  };

  if (won) return <GameFrame game={game} score={160} onReset={reset}><Completion title="Code broken." text={"You solved the sequence in " + rows.length + " attempts."} xp={160} onAgain={reset} /></GameFrame>;

  return <GameFrame game={game} score={rows.length * 10} step={(8 - rows.length) + " ATTEMPTS"} onReset={reset}>
    <section className="challenge-card compact"><div className="challenge-kicker"><Brain /> Deductive reasoning</div><h1>Break the hidden sequence.</h1><p>Black markers mean exact position. White means the right colour in another position.</p>
      <div className="code-rows">{rows.map((row,index) => <div className="code-row" key={index}><div>{row.guess.map((color,i) => <i key={i} style={{background:color}} />)}</div><span>● {row.exact} &nbsp; ○ {row.partial}</span></div>)}<div className="code-row current"><div>{[0,1,2,3].map(index => <i key={index} style={{background:guess[index] || "#25232d"}} />)}</div><span>Your move</span></div></div>
      <div className="palette">{colors.map(color => <button key={color} style={{background:color}} onClick={() => guess.length < 4 && setGuess(value => [...value,color])} />)}</div>
      <div className="inline-actions"><button onClick={() => setGuess(value => value.slice(0,-1))}>Undo</button><button className="cta" onClick={submit}>Test code</button></div>
    </section>
  </GameFrame>;
}

export function Detective({ game, escapeMode = false }) {
  const [caseIndex, setCaseIndex] = useState(0);
  const [chosen, setChosen] = useState(null);
  const item = prompts.detective[caseIndex % prompts.detective.length];
  const reset = () => { setCaseIndex(value => value + 1); setChosen(null); };
  return <GameFrame game={game} score={chosen === item.answer ? 140 : 0} step={escapeMode ? "ROOM 01" : "CASE FILE"} onReset={reset}>
    <section className="case-file"><div className="case-number">0{caseIndex + 1}</div><span className="panel-label">{escapeMode ? "ESCAPE SEQUENCE" : "ACTIVE INVESTIGATION"}</span><h1>{item.title}</h1><p className="case-setup">{item.setup}</p>
      <div className="evidence">{item.clues.map((clue,index) => <div key={clue}><span>{index + 1}</span><p>{clue}</p></div>)}</div><h3>{item.question}</h3>
      <div className="case-options">{item.options.map((option,index) => <button key={option} onClick={() => setChosen(index)} className={chosen === null ? "" : index === item.answer ? "correct" : index === chosen ? "wrong" : ""}>{option}</button>)}</div>
      {chosen !== null && <div className="explanation"><Lightbulb /><p><strong>{chosen === item.answer ? "Evidence connected." : "Review the contradiction."}</strong>{item.why}</p><button onClick={reset}>Next case →</button></div>}
    </section>
  </GameFrame>;
}
