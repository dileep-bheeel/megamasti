import { useMemo, useState } from "react";
import { Brain, Lightbulb } from "lucide-react";
import { prompts } from "../data/content";
import { Completion, GameFrame, shuffle } from "./Common";

const basePuzzle=[5,3,0,0,7,0,0,0,0,6,0,0,1,9,5,0,0,0,0,9,8,0,0,0,0,6,0,8,0,0,0,6,0,0,0,3,4,0,0,8,0,3,0,0,1,7,0,0,0,2,0,0,0,6,0,6,0,0,0,0,2,8,0,0,0,0,4,1,9,0,0,5,0,0,0,0,8,0,0,7,9];
const baseSolution=[5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9];
function makeSudoku(level,seed){
  const map=value=>value?((value+seed-1)%9)+1:0;
  const solution=baseSolution.map(map);
  let puzzle=basePuzzle.map(map);
  if(level==="Easy")puzzle=puzzle.map((value,index)=>value||(index+seed)%4===0?solution[index]:0);
  if(level==="Hard")puzzle=puzzle.map((value,index)=>value&&(index+seed)%3!==0?value:0);
  return {puzzle,solution};
}

export function Sudoku({game}){
  const [level,setLevel]=useState("Medium"),[seed,setSeed]=useState(()=>Math.floor(Math.random()*9));
  const board=useMemo(()=>makeSudoku(level,seed),[level,seed]);
  const [grid,setGrid]=useState(()=>[...board.puzzle]),[selected,setSelected]=useState(null),[mistakes,setMistakes]=useState(0),[message,setMessage]=useState("Choose a cell and reason across its row, column and box.");
  const complete=grid.every((number,index)=>number===board.solution[index]);
  const restart=(nextLevel=level,nextSeed=seed)=>{const next=makeSudoku(nextLevel,nextSeed);setGrid([...next.puzzle]);setSelected(null);setMistakes(0);setMessage("Fresh grid. Start where the most digits are already visible.");};
  const chooseLevel=next=>{setLevel(next);restart(next,seed);};
  const reset=()=>{const next=(seed+1)%9;setSeed(next);restart(level,next);};
  const enter=number=>{
    if(selected===null||board.puzzle[selected])return;
    if(board.solution[selected]!==number){setMistakes(value=>value+1);setMessage("That digit conflicts with this grid. Recheck all three units.");return;}
    setGrid(values=>values.map((value,index)=>index===selected?number:value));setMessage("Correct placement. Use it to unlock the next deduction.");
  };
  if(complete){const xp=Math.max(60,({Easy:190,Medium:240,Hard:300}[level])-mistakes*15);return <GameFrame game={game} score={xp} onReset={reset}><Completion title="Grid mastered." text={"Completed "+level.toLowerCase()+" mode with "+mistakes+" mistake"+(mistakes===1?"":"s")+". A fresh digit transformation is ready."} xp={xp} detail={{value:mistakes,label:"mistakes"}} onAgain={reset}/></GameFrame>;}
  const filled=grid.filter(Boolean).length-board.puzzle.filter(Boolean).length;
  return <GameFrame game={game} score={filled*4} step={level.toUpperCase()+" • "+mistakes+" MISTAKES"} onReset={reset}>
    <div className="sudoku-layout"><section><div className="challenge-kicker"><Brain/>Sudoku journey <div className="mode-tabs">{["Easy","Medium","Hard"].map(item=><button key={item} className={level===item?"active":""} onClick={()=>chooseLevel(item)}>{item}</button>)}</div></div><h1>Every digit has one place.</h1>
      <div className="sudoku-board" onKeyDown={event=>{const number=Number(event.key);if(number>=1&&number<=9)enter(number);}}>{grid.map((number,index)=><button key={index} className={(board.puzzle[index]?"given ":"")+(selected===index?"selected":"")} onClick={()=>!board.puzzle[index]&&setSelected(index)} aria-label={"Row "+(Math.floor(index/9)+1)+", column "+(index%9+1)+(number?", "+number:" empty")}>{number||""}</button>)}</div>
      <div className="number-pad">{[1,2,3,4,5,6,7,8,9].map(number=><button key={number} onClick={()=>enter(number)}>{number}</button>)}</div><p className="game-message" aria-live="polite">{message}</p>
    </section><aside className="lesson-panel"><span className="panel-label">COACH’S NOTE</span><h2>Scan before guessing.</h2><p>Examine the row, column and 3×3 box. A candidate is valid only when it satisfies all three.</p><div className="tip"><Lightbulb/>Start with units containing the most digits.</div></aside></div>
  </GameFrame>;
}

const mastermindColors=[
  {hex:"#ff6577",name:"coral"},{hex:"#ffca5c",name:"gold"},{hex:"#5ee6a8",name:"mint"},
  {hex:"#6ca5ff",name:"blue"},{hex:"#bf85ff",name:"violet"},{hex:"#ff8ad8",name:"pink"}
];
const newSecret=()=>Array.from({length:4},()=>mastermindColors[Math.floor(Math.random()*mastermindColors.length)].hex);
export function Mastermind({game}){
  const [secret,setSecret]=useState(newSecret),[guess,setGuess]=useState([]),[rows,setRows]=useState([]),[won,setWon]=useState(false);
  const lost=rows.length>=8&&!won;
  const reset=()=>{setSecret(newSecret());setGuess([]);setRows([]);setWon(false);};
  const submit=()=>{
    if(guess.length!==4||rows.length>=8||won)return;
    const exact=guess.filter((color,index)=>color===secret[index]).length;
    const secretCounts={},guessCounts={};
    secret.forEach((color,index)=>{if(color!==guess[index])secretCounts[color]=(secretCounts[color]||0)+1;});
    guess.forEach((color,index)=>{if(color!==secret[index])guessCounts[color]=(guessCounts[color]||0)+1;});
    const partial=Object.keys(guessCounts).reduce((sum,color)=>sum+Math.min(guessCounts[color],secretCounts[color]||0),0);
    setRows(value=>[...value,{guess:[...guess],exact,partial}]);setGuess([]);if(exact===4)setWon(true);
  };
  if(won){const xp=Math.max(100,280-(rows.length-1)*20);return <GameFrame game={game} score={xp} onReset={reset}><Completion title="Code broken." text={"You solved a repeat-enabled sequence in "+rows.length+" attempt"+(rows.length===1?"":"s")+"."} xp={xp} detail={{value:rows.length,label:"attempts"}} onAgain={reset}/></GameFrame>;}
  if(lost){const names=secret.map(hex=>mastermindColors.find(color=>color.hex===hex).name).join(", ");return <GameFrame game={game} score={50} onReset={reset}><Completion title="The code held this time." text={"The sequence was "+names+". Compare the exact and misplaced clues before trying a new code."} xp={50} detail={{value:"8",label:"attempts"}} onAgain={reset}/></GameFrame>;}
  return <GameFrame game={game} score={rows.length*12} step={(8-rows.length)+" ATTEMPTS"} onReset={reset}>
    <section className="challenge-card compact"><div className="challenge-kicker"><Brain/>Deductive reasoning</div><h1>Break the hidden sequence.</h1><p>Colours may repeat. Solid markers mean exact position; rings mean correct colour in another position.</p>
      <div className="code-rows">{rows.map((row,index)=><div className="code-row" key={index}><div>{row.guess.map((color,i)=><i key={i} style={{background:color}}/>)}</div><span>● {row.exact} &nbsp; ○ {row.partial}</span></div>)}<div className="code-row current"><div>{[0,1,2,3].map(index=><i key={index} style={{background:guess[index]||"#25232d"}}/>)}</div><span>Your move</span></div></div>
      <div className="palette">{mastermindColors.map(color=><button key={color.hex} aria-label={color.name} style={{background:color.hex}} onClick={()=>guess.length<4&&setGuess(value=>[...value,color.hex])}/>)}</div>
      <div className="inline-actions"><button onClick={()=>setGuess(value=>value.slice(0,-1))}>Undo</button><button className="cta" disabled={guess.length!==4} onClick={submit}>Test code</button></div>
    </section>
  </GameFrame>;
}

export function Detective({game}){
  const makeCases=()=>shuffle(prompts.detective).slice(0,5);
  const [cases,setCases]=useState(makeCases),[index,setIndex]=useState(0),[chosen,setChosen]=useState(null),[correct,setCorrect]=useState(0);
  const item=cases[index];
  const reset=()=>{setCases(makeCases());setIndex(0);setChosen(null);setCorrect(0);};
  const answer=choice=>{if(chosen!==null)return;setChosen(choice);if(choice===item.answer)setCorrect(value=>value+1);};
  const next=()=>{setIndex(value=>value+1);setChosen(null);};
  if(index>=cases.length){const xp=correct*55;return <GameFrame game={game} score={xp} onReset={reset}><Completion title={correct===5?"Casework flawless.":"Investigation closed."} text="Strong detectives distinguish direct contradiction from details that are merely unusual." xp={xp} detail={{value:correct+"/5",label:"cases solved"}} onAgain={reset}/></GameFrame>;}
  return <GameFrame game={game} score={correct*55} step={"CASE "+(index+1)+"/5"} onReset={reset}>
    <section className="case-file"><div className="case-number">0{index+1}</div><span className="panel-label">ACTIVE INVESTIGATION</span><h1>{item.title}</h1><p className="case-setup">{item.setup}</p>
      <div className="evidence">{item.clues.map((clue,clueIndex)=><div key={clue}><span>{clueIndex+1}</span><p>{clue}</p></div>)}</div><h3>{item.question}</h3>
      <div className="case-options">{item.options.map((option,optionIndex)=><button key={option} onClick={()=>answer(optionIndex)} disabled={chosen!==null} className={chosen===null?"":optionIndex===item.answer?"correct":optionIndex===chosen?"wrong":""}>{option}</button>)}</div>
      {chosen!==null&&<div className="explanation" aria-live="polite"><Lightbulb/><p><strong>{chosen===item.answer?"Evidence connected.":"Review the logic."}</strong>{item.why}</p><button onClick={next}>Next case →</button></div>}
    </section>
  </GameFrame>;
}
