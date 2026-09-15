import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Clock3, Lightbulb, Volume2, XCircle } from "lucide-react";
import { prompts } from "../data/content";
import { Completion, GameFrame } from "./Common";
import { useProgress } from "../context/ProgressContext";

export function CreativeStudio({ game, type }) {
  const [round,setRound]=useState(0);
  const [text,setText]=useState("");
  const [done,setDone]=useState(false);
  const reset=()=>{setRound(value=>value+1);setText("");setDone(false);};
  let label="CREATIVE BRIEF",title="",brief="",guidance="Build a clear beginning, meaningful change, and memorable final idea.",minimum=80;

  if(type==="story"){
    const source=prompts.story;
    title="Forge an original world.";
    brief="Your protagonist is "+source.characters[round%source.characters.length]+" in "+source.worlds[(round+1)%source.worlds.length]+". The protagonist "+source.conflicts[(round+2)%source.conflicts.length]+". Twist: "+source.twists[(round+3)%source.twists.length]+".";
    minimum=140;
  }
  if(type==="debate"){
    label="ARGUMENT LAB";title=prompts.debate[round%prompts.debate.length];
    brief="Take the less obvious position. Build a claim, evidence, counterargument and conclusion.";
    guidance="Answer the strongest opposing argument, not the easiest one.";minimum=120;
  }
  if(type==="caption"){
    title="Write the line nobody expects.";brief=prompts.caption[round%prompts.caption.length];
    guidance="Aim for surprise without cruelty. Specific observations beat generic jokes.";minimum=30;
  }
  if(type==="invent"){
    const idea=prompts.inventions[round%prompts.inventions.length];
    title="Invent beyond the obvious.";brief="Combine "+idea[0]+" with "+idea[1]+" to "+idea[2]+". Explain the mechanism, user and trade-off.";
    guidance="A real constraint makes an imaginative idea more convincing.";minimum=100;
  }
  if(type==="mystery"){
    const mystery=prompts.mysteries[round%prompts.mysteries.length];
    title="Write a solvable mystery.";brief=mystery;
    guidance="The answer should surprise the reader, then feel inevitable when the clues are reviewed.";minimum=150;
  }

  const words=text.trim()?text.trim().split(/\s+/).length:0;
  const score=Math.min(240,Math.round(text.trim().length*.8)+words*2);
  if(done)return <GameFrame game={game} score={score} onReset={reset}><Completion title="Idea captured." text="You worked within a constraint, made deliberate choices and completed an original response." xp={score} detail={{value:words,label:"words created"}} onAgain={reset}/></GameFrame>;

  return <GameFrame game={game} score={score} step="STUDIO" onReset={reset}>
    <section className="studio-card"><span className="panel-label">{label}</span><h1>{title}</h1><div className="brief">{brief}</div>
      <textarea value={text} onChange={event=>setText(event.target.value)} placeholder="Shape your response here…" aria-label="Creative response"/>
      <div className="creation-meter"><i style={{width:Math.min(100,text.trim().length/minimum*100)+"%"}}/><span>{text.trim().length} / {minimum} character foundation</span></div>
      <div className="studio-foot"><p><Lightbulb/>{guidance}</p><button className="cta" disabled={text.trim().length<minimum} onClick={()=>setDone(true)}>Complete creation →</button></div>
    </section>
  </GameFrame>;
}

export function SocialRound({ game,type }) {
  const [card,setCard]=useState(0),[rounds,setRounds]=useState(0),[wins,setWins]=useState(0);
  const [revealed,setRevealed]=useState(false),[seconds,setSeconds]=useState(60);
  useEffect(()=>{
    if(!revealed||seconds<=0)return;
    const timer=setInterval(()=>setSeconds(value=>Math.max(0,value-1)),1000);
    return()=>clearInterval(timer);
  },[revealed,seconds]);
  const reset=()=>{setCard(value=>value+1);setRounds(0);setWins(0);setRevealed(false);setSeconds(60);};
  const next=success=>{if(success)setWins(value=>value+1);setRounds(value=>value+1);setCard(value=>value+1);setRevealed(false);setSeconds(60);};
  let title="",detail="",hidden="";
  if(type==="charades"){title="Act it. Never say it.";hidden=prompts.charades[card%prompts.charades.length];detail="One performer • Everyone else guesses • No words or pointing";}
  if(type==="forbidden"){const item=prompts.forbidden[card%prompts.forbidden.length];title="Describe the secret word.";hidden=item.word;detail="Forbidden: "+item.banned.join(" • ");}
  if(type==="mission"){title="Your private mission.";hidden=prompts.missions[card%prompts.missions.length];detail="Keep the screen private. Complete it naturally before time runs out.";}
  if(type==="feud"){const item=prompts.feud[card%prompts.feud.length];title=item.q;hidden=item.answers.map(answer=>answer[0]+" — "+answer[1]).join("  •  ");detail="The host keeps the answer board private. Teams alternate spoken guesses.";}

  if(rounds>=5){
    const xp=wins*60;
    return <GameFrame game={game} score={xp} onReset={reset}><Completion title={wins>=4?"Brilliant group run.":"Five rounds played."} text="Good group play rewards expression, listening and shared laughter—not endless sessions." xp={xp} detail={{value:wins+"/5",label:"successful rounds"}} onAgain={reset}/></GameFrame>;
  }

  return <GameFrame game={game} score={wins*60} step={"ROUND "+(rounds+1)+"/5"} onReset={reset}>
    <section className="social-stage"><span className="panel-label">GROUP ROUND</span><h1>{title}</h1><p>{detail}</p>
      <button className={"reveal-card "+(revealed?"open":"")} onClick={()=>!revealed&&setRevealed(true)}>{revealed?<strong>{hidden}</strong>:<><span>Private card</span><strong>Tap when only the active player can see</strong></>}</button>
      {revealed&&<><div className="timer-line"><Clock3/><i style={{width:(seconds/60*100)+"%"}}/></div>{seconds===0&&<p className="time-up" aria-live="polite">Time is up. Record the outcome and pass the device.</p>}<div className="outcome-actions"><button onClick={()=>next(false)}><XCircle/>Pass</button><button onClick={()=>next(true)}><CheckCircle2/>Success</button></div></>}
      {!revealed&&<button className="text-action" onClick={()=>next(false)}>Skip this card</button>}
    </section>
  </GameFrame>;
}

const newRhythm=()=>Array.from({length:3},()=>Math.floor(Math.random()*4));
export function RhythmLab({ game }) {
  const {progress}=useProgress();
  const timeouts=useRef([]);
  const pads=["#d8ff52","#8a7dff","#ff718e","#5edfd5"];
  const [sequence,setSequence]=useState(newRhythm);
  const [input,setInput]=useState([]),[flash,setFlash]=useState(null);
  const [phase,setPhase]=useState("idle"),[strikes,setStrikes]=useState(0),[finished,setFinished]=useState(null);
  useEffect(()=>()=>timeouts.current.forEach(clearTimeout),[]);
  const tone=index=>{
    if(!progress.preferences.sound)return;
    try{
      const AudioContext=window.AudioContext||window.webkitAudioContext;
      const context=new AudioContext(),oscillator=context.createOscillator(),gain=context.createGain();
      oscillator.frequency.value=[261.63,329.63,392,523.25][index];
      gain.gain.setValueAtTime(.075,context.currentTime);gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+.2);
      oscillator.connect(gain);gain.connect(context.destination);oscillator.start();oscillator.stop(context.currentTime+.21);oscillator.onended=()=>context.close();
    }catch{/* Sound is optional; visual feedback remains complete. */}
  };
  const clearTimers=()=>{timeouts.current.forEach(clearTimeout);timeouts.current=[];};
  const play=()=>{
    if(phase==="showing")return;
    clearTimers();setInput([]);setPhase("showing");
    sequence.forEach((pad,index)=>{
      timeouts.current.push(setTimeout(()=>{setFlash(pad);tone(pad);timeouts.current.push(setTimeout(()=>setFlash(null),230));},index*430));
    });
    timeouts.current.push(setTimeout(()=>setPhase("input"),sequence.length*430+80));
  };
  const hit=index=>{
    if(phase!=="input")return;
    tone(index);setFlash(index);timeouts.current.push(setTimeout(()=>setFlash(null),130));
    const next=[...input,index];
    if(index!==sequence[next.length-1]){
      const nextStrikes=strikes+1;setStrikes(nextStrikes);setInput([]);setPhase("idle");
      if(nextStrikes>=3)setFinished("lost");
      return;
    }
    if(next.length===sequence.length){
      if(sequence.length>=8){setFinished("won");return;}
      setSequence(value=>[...value,Math.floor(Math.random()*4)]);setInput([]);setPhase("idle");
    }else setInput(next);
  };
  const reset=()=>{clearTimers();setSequence(newRhythm());setInput([]);setFlash(null);setPhase("idle");setStrikes(0);setFinished(null);};
  if(finished){
    const xp=finished==="won"?300:Math.max(60,(sequence.length-3)*50);
    return <GameFrame game={game} score={xp} onReset={reset}><Completion title={finished==="won"?"Rhythm mastered.":"Three patterns slipped."} text={finished==="won"?"You held an eight-step sequence in working memory.":"Memory improves through recovery. Replay with smaller mental chunks."} xp={xp} detail={{value:sequence.length,label:"longest sequence"}} onAgain={reset}/></GameFrame>;
  }
  const status=phase==="showing"?"Listen—input is locked.":phase==="input"?"Your turn. Repeat the pattern.":sequence.length>3?"Level cleared. Play the longer pattern.":"Press Play sequence when ready.";
  return <GameFrame game={game} score={(sequence.length-3)*50} step={"LEVEL "+(sequence.length-2)} onReset={reset}>
    <section className="rhythm-stage"><div className="challenge-kicker"><Volume2/>Audio-visual memory <span className="strikes">{strikes}/3 slips</span></div><h1>Hear the pattern.<br/>Become the pattern.</h1><p aria-live="polite">{status}</p>
      <div className={"rhythm-pads "+(phase==="showing"?"locked":"")}>{pads.map((color,index)=><button key={color} disabled={phase!=="input"} onClick={()=>hit(index)} className={flash===index?"flash":""} style={{"--pad":color}}><span>{index+1}</span></button>)}</div>
      <button className="cta" disabled={phase==="showing"} onClick={play}><Volume2/>{phase==="showing"?"Playing…":"Play sequence"}</button>
    </section>
  </GameFrame>;
}
