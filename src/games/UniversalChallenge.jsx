import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { GameFrame } from "./Common";

export default function UniversalChallenge({ game }) {
  const [round,setRound] = useState(0);
  const [done,setDone] = useState(false);
  const variants = {
    reversi:["Corner Control","Secure two opposite corners while limiting your rival’s mobility.","Think in edges and future moves, not immediate captures."],
    mancala:["Chain Capture","Plan a sowing sequence that returns the final stone to your store.","Count forward, then test the opponent’s strongest reply."],
    territory:["Control the Crossroads","Claim connected zones without letting the rival surround your centre.","Every placement affects influence two turns later."],
    nonogram:["Pixel Logic","Use the sequence 1–3–1 to identify guaranteed spaces in a nine-cell line.","Separate groups by at least one empty cell."],
    kakuro:["Intersecting Sums","Find two different digits totalling 16, then use the crossing clue to determine order.","Possible pairs narrow dramatically when digits cannot repeat."],
    circuit:["Restore the Signal","Rotate the junctions so power reaches every terminal without forming a short circuit.","Trace from the source and lock confirmed paths."],
    science:["Predict, then explain","Two identical bottles—one wrapped in dark paper, one in foil—sit under a lamp. Which warms faster and why?","Separate your prediction from the mechanism that explains it."],
    words:["Build under pressure","Create the highest-value word from: R, E, A, C, T, I, V, E.","Longer is useful; precision and rarity earn bonuses."],
    tournament:["Five disciplines. One champion.","Strategy, knowledge, creativity, memory and teamwork combine in a rotating group match.","Choose teams, pass the device, and record the winner of each discipline."]
  };
  const variant = variants[game.engine] || ["Think beyond the first answer.",game.description,"Explain the reasoning behind your choice."];
  const reset = () => { setRound(0); setDone(false); };

  return <GameFrame game={game} score={done ? 120 : round * 20} step={"ROUND " + (round + 1)} onReset={reset}>
    <section className="universal-stage"><span className="panel-label">{game.skills.join(" • ")}</span><h1>{variant[0]}</h1><p>{variant[1]}</p>
      <div className="strategy-canvas">
        <div className="canvas-grid">{Array.from({length:25},(_,index) => <button key={index} className={(index + round) % 7 === 0 ? "marked" : ""} onClick={() => setRound(value => value + 1)} />)}</div>
        <aside><Lightbulb /><strong>Expert lens</strong><p>{variant[2]}</p></aside>
      </div>
      <button className="cta" onClick={() => setDone(true)}>{done ? "Challenge complete" : "Commit strategy"} →</button>
    </section>
  </GameFrame>;
}
