import { useEffect, useState } from "react";
import { Clock3, Lightbulb, Volume2 } from "lucide-react";
import { prompts } from "../data/content";
import { Completion, GameFrame } from "./Common";

export function CreativeStudio({ game, type }) {
  const [round,setRound] = useState(0);
  const [text,setText] = useState("");
  const [done,setDone] = useState(false);
  const reset = () => { setRound(value => value + 1); setText(""); setDone(false); };
  let label = "CREATIVE BRIEF", title = "", brief = "", guidance = "Build a clear beginning, meaningful change, and memorable final idea.";

  if (type === "story") {
    const source = prompts.story;
    title = "Forge an original world.";
    brief = "Your protagonist is " + source.characters[round % source.characters.length] + " in " + source.worlds[(round + 1) % source.worlds.length] + ". They " + source.conflicts[(round + 2) % source.conflicts.length] + ". Twist: " + source.twists[(round + 3) % source.twists.length] + ".";
  }
  if (type === "debate") {
    label = "ARGUMENT LAB"; title = prompts.debate[round % prompts.debate.length];
    brief = "You have been assigned the opposite position from your first instinct. Build a claim, evidence, counterargument and conclusion.";
    guidance = "Strong arguments acknowledge the best opposing point before responding.";
  }
  if (type === "caption") {
    title = "Write the line nobody expects."; brief = prompts.caption[round % prompts.caption.length];
    guidance = "Aim for surprise without cruelty. Specific observations beat generic jokes.";
  }
  if (type === "invent") {
    const idea = prompts.inventions[round % prompts.inventions.length];
    title = "Invent beyond the obvious."; brief = "Combine " + idea[0] + " with " + idea[1] + " to " + idea[2] + ". Explain how it works and who benefits.";
    guidance = "Consider usefulness, simplicity, sustainability and an unexpected constraint.";
  }
  if (type === "mystery") {
    title = "Write a solvable mystery.";
    brief = "A valuable object disappears from a locked public place. Plant three fair clues, one believable distraction and a motive that changes how the reader sees the event.";
    guidance = "The solution must be surprising in meaning, but inevitable in hindsight.";
  }

  if (done) return <GameFrame game={game} score={150} onReset={reset}><Completion title="Idea captured." text="Creativity grows through constraints, revision and courage." xp={150} onAgain={reset} /></GameFrame>;

  return <GameFrame game={game} score={Math.min(100, Math.floor(text.length / 3))} step="STUDIO" onReset={reset}>
    <section className="studio-card"><span className="panel-label">{label}</span><h1>{title}</h1><div className="brief">{brief}</div>
      <textarea value={text} onChange={event => setText(event.target.value)} placeholder="Shape your response here…" />
      <div className="studio-foot"><p><Lightbulb />{guidance}</p><button className="cta" disabled={text.trim().length < 40} onClick={() => setDone(true)}>Complete creation →</button></div>
    </section>
  </GameFrame>;
}

export function SocialRound({ game, type }) {
  const [round,setRound] = useState(0);
  const [revealed,setRevealed] = useState(false);
  const [seconds,setSeconds] = useState(60);
  useEffect(() => {
    if (!revealed || seconds <= 0) return;
    const timer = setInterval(() => setSeconds(value => value - 1),1000);
    return () => clearInterval(timer);
  },[revealed,seconds]);
  const reset = () => { setRound(value => value + 1); setRevealed(false); setSeconds(60); };
  let title = "", detail = "", hidden = "";

  if (type === "charades") { title = "Act it. Never say it."; hidden = prompts.charades[round % prompts.charades.length]; detail = "One performer • Everyone else guesses • No words or pointing"; }
  if (type === "forbidden") { const item = prompts.forbidden[round % prompts.forbidden.length]; title = "Describe the secret word."; hidden = item.word; detail = "Forbidden: " + item.banned.join(" • "); }
  if (type === "mission") { title = "Your private mission."; hidden = prompts.missions[round % prompts.missions.length]; detail = "Keep the screen private. Complete it naturally before time runs out."; }
  if (type === "feud") { const item = prompts.feud[round % prompts.feud.length]; title = item.q; hidden = item.answers.map(answer => answer[0] + " — " + answer[1]).join("  •  "); detail = "Teams alternate. Three misses end the round."; }

  return <GameFrame game={game} score={revealed ? 80 : 0} step={revealed ? seconds + "s" : "PASS DEVICE"} onReset={reset}>
    <section className="social-stage"><span className="panel-label">GROUP ROUND</span><h1>{title}</h1><p>{detail}</p>
      <button className={"reveal-card " + (revealed ? "open" : "")} onClick={() => setRevealed(true)}>{revealed ? <strong>{hidden}</strong> : <><span>Private card</span><strong>Tap when only you can see</strong></>}</button>
      {revealed && <div className="timer-line"><Clock3 /><i style={{width:(seconds / 60 * 100) + "%"}} /></div>}
      <button className="cta" onClick={reset}>{revealed ? "Complete round" : "Skip card"} →</button>
    </section>
  </GameFrame>;
}

export function RhythmLab({ game }) {
  const pads = ["#d8ff52","#8a7dff","#ff718e","#5edfd5"];
  const [sequence,setSequence] = useState([0,2,1]);
  const [input,setInput] = useState([]);
  const [flash,setFlash] = useState(null);
  const [status,setStatus] = useState("Listen, then repeat the sequence.");
  const play = () => {
    setInput([]);
    sequence.forEach((pad,index) => setTimeout(() => { setFlash(pad); setTimeout(() => setFlash(null),260); },index * 430));
  };
  const hit = index => {
    const next = [...input,index]; setInput(next);
    if (index !== sequence[next.length - 1]) { setStatus("Pattern broken. Reset your attention and try again."); setInput([]); }
    else if (next.length === sequence.length) { setStatus("Perfect rhythm. A new beat has been added."); setSequence(value => [...value,Math.floor(Math.random()*4)]); setInput([]); }
  };
  const reset = () => { setSequence([0,2,1]); setInput([]); setStatus("Listen, then repeat the sequence."); };
  return <GameFrame game={game} score={(sequence.length - 3) * 50} step={"LEVEL " + (sequence.length - 2)} onReset={reset}>
    <section className="rhythm-stage"><div className="challenge-kicker"><Volume2 /> Audio-visual memory</div><h1>Hear the pattern.<br />Become the pattern.</h1><p>{status}</p>
      <div className="rhythm-pads">{pads.map((color,index) => <button key={color} onClick={() => hit(index)} className={flash === index ? "flash" : ""} style={{"--pad":color}}><span>{index + 1}</span></button>)}</div>
      <button className="cta" onClick={play}><Volume2 /> Play sequence</button>
    </section>
  </GameFrame>;
}
