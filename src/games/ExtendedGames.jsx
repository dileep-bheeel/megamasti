import { useEffect, useState } from "react";
import { Check, Lightbulb, RotateCw } from "lucide-react";
import { Completion, GameFrame } from "./Common";

const directions = [[-1,0],[0,1],[1,0],[0,-1]];
const opponent = player => player === "B" ? "W" : "B";

function flipsFor(board,index,player) {
  if (board[index]) return [];
  const row = Math.floor(index / 8), column = index % 8, other = opponent(player);
  const flips = [];
  directions.concat([[-1,-1],[-1,1],[1,-1],[1,1]]).forEach(([dr,dc]) => {
    let r=row+dr,c=column+dc,line=[];
    while(r>=0&&r<8&&c>=0&&c<8&&board[r*8+c]===other){line.push(r*8+c);r+=dr;c+=dc;}
    if(line.length&&r>=0&&r<8&&c>=0&&c<8&&board[r*8+c]===player) flips.push(...line);
  });
  return flips;
}
const legalReversi = (board,player) => board.map((_,index) => flipsFor(board,index,player).length ? index : -1).filter(index => index >= 0);
function newReversiBoard(){const board=Array(64).fill(null);board[27]="W";board[28]="B";board[35]="B";board[36]="W";return board;}

export function ReversiArena({game}) {
  const [board,setBoard]=useState(newReversiBoard);
  const [turn,setTurn]=useState("B");
  const [message,setMessage]=useState("Your move. Control corners and protect stable edges.");
  const [moves,setMoves]=useState(0);
  const legal=legalReversi(board,turn);
  const over=legalReversi(board,"B").length===0&&legalReversi(board,"W").length===0;
  const counts={B:board.filter(v=>v==="B").length,W:board.filter(v=>v==="W").length};
  const reset=()=>{setBoard(newReversiBoard());setTurn("B");setMoves(0);setMessage("Your move. Control corners and protect stable edges.");};

  const place=(index,player)=>{
    const flips=flipsFor(board,index,player);
    if(!flips.length)return;
    const next=[...board];next[index]=player;flips.forEach(i=>next[i]=player);
    setBoard(next);setMoves(value=>value+1);setTurn(opponent(player));
  };

  useEffect(()=>{
    if(over)return;
    if(!legal.length){setMessage((turn==="B"?"You have":"The coach has")+" no legal move. Turn passed.");setTurn(opponent(turn));return;}
    if(turn!=="W")return;
    setMessage("Coach is weighing mobility and corners…");
    const timer=setTimeout(()=>{
      const options=legalReversi(board,"W");
      const corners=[0,7,56,63];
      const choice=[...options].sort((a,b)=>(corners.includes(b)?100:0)+flipsFor(board,b,"W").length-(corners.includes(a)?100:0)-flipsFor(board,a,"W").length)[0];
      if(choice!==undefined){
        const flips=flipsFor(board,choice,"W");
        const next=[...board];next[choice]="W";flips.forEach(index=>next[index]="W");
        setBoard(next);setMoves(value=>value+1);setTurn("B");
      }
      setMessage("Your move. Look for corners, edges and forced replies.");
    },420);
    return()=>clearTimeout(timer);
  },[board,turn,over,legal.length]);

  if(over){
    const won=counts.B>counts.W;const xp=won?220:counts.B===counts.W?140:80;
    return <GameFrame game={game} score={xp} onReset={reset}><Completion title={won?"Board controlled.":counts.B===counts.W?"Perfectly balanced.":"The coach held the edge."} text={"Final position: "+counts.B+"–"+counts.W+". Corners and mobility matter more than early piece count."} xp={xp} detail={{value:counts.B+"–"+counts.W,label:"your discs • coach discs"}} onAgain={reset}/></GameFrame>;
  }
  return <GameFrame game={game} score={moves*8} step={turn==="B"?"YOUR TURN":"COACH"} onReset={reset}>
    <div className="reversi-layout"><section className="reversi-panel"><div className="board-score"><span>You <b>{counts.B}</b></span><i>REVERSI</i><span>Coach <b>{counts.W}</b></span></div><div className="reversi-board" aria-label="Reversi board">{board.map((cell,index)=><button key={index} disabled={turn!=="B"} onClick={()=>place(index,"B")} className={legal.includes(index)&&turn==="B"?"legal":""} aria-label={"Square "+(index+1)+(cell?(cell==="B"?" your disc":" coach disc"):" empty")}>{cell&&<i className={cell==="B"?"black":"white"}/>}</button>)}</div><p aria-live="polite">{message}</p></section><aside className="lesson-panel"><span className="panel-label">STRATEGY LENS</span><h2>Win the final position.</h2><p>Every move must trap one or more opposing discs in a straight line. The player with more discs when neither side can move wins.</p><div className="tip"><Lightbulb/>Corners can never be flipped. Avoid giving them away.</div></aside></div>
  </GameFrame>;
}

const nonograms=[
  {name:"Kite",grid:["00100","01110","11111","00100","00100"]},
  {name:"Cup",grid:["10001","10001","10001","01110","00100"]},
  {name:"Tree",grid:["00100","01110","11111","01110","00100"]},
  {name:"Arrow",grid:["00100","00010","11111","00010","00100"]},
  {name:"Window",grid:["11111","10001","10101","10001","11111"]}
];
const clue=line=>{const result=[];let run=0;for(const cell of line){if(cell==="1")run++;else if(run){result.push(run);run=0;}}if(run)result.push(run);return result.length?result:[0];};

export function NonogramStudio({game}){
  const [round,setRound]=useState(0),[cells,setCells]=useState(Array(25).fill(0)),[checks,setChecks]=useState(0),[message,setMessage]=useState("Use the clues to reveal the hidden image.");
  const puzzle=nonograms[round%nonograms.length];
  const columns=Array.from({length:5},(_,c)=>puzzle.grid.map(row=>row[c]).join(""));
  const won=cells.every((value,index)=>(value===1)===(puzzle.grid[Math.floor(index/5)][index%5]==="1"));
  const reset=()=>{setRound(value=>value+1);setCells(Array(25).fill(0));setChecks(0);setMessage("A new picture is hidden in the grid.");};
  const inspect=()=>{setChecks(v=>v+1);setMessage(won?"Pattern complete.":"Not yet. Recheck lines whose filled groups do not match their clues.");};
  if(won)return <GameFrame game={game} score={Math.max(100,220-checks*20)} onReset={reset}><Completion title={puzzle.name+" revealed."} text="You translated numerical constraints into a complete visual pattern." xp={Math.max(100,220-checks*20)} detail={{value:checks||"0",label:"checks used"}} onAgain={reset}/></GameFrame>;
  return <GameFrame game={game} score={cells.filter(v=>v===1).length*5} step={"PUZZLE "+(round%nonograms.length+1)} onReset={reset}><section className="nonogram-stage"><div><span className="panel-label">PIXEL LOGIC</span><h1>Read every line.</h1><p>{message}</p></div><div className="nonogram-wrap"><div/><div className="column-clues">{columns.map((line,i)=><span key={i}>{clue(line).join(" ")}</span>)}</div><div className="row-clues">{puzzle.grid.map((line,i)=><span key={i}>{clue(line).join(" ")}</span>)}</div><div className="nonogram-board">{cells.map((value,index)=><button key={index} className={value===1?"filled":value===2?"crossed":""} onClick={()=>setCells(list=>list.map((cell,i)=>i===index?(cell+1)%3:cell))} aria-label={"Cell "+(index+1)+(value===1?" filled":value===2?" marked empty":" unknown")}>{value===2?"×":""}</button>)}</div></div><div className="puzzle-actions"><p><Lightbulb/>Tap once to fill, twice to mark empty.</p><button className="cta" onClick={inspect}><Check/>Check pattern</button></div></section></GameFrame>;
}

const wordRounds=[
  {letters:"CREATIVE",words:["active","cater","cave","cite","crave","create","race","rate","react","rice","tier","tire","trace"]},
  {letters:"PLANETS",words:["least","panel","pants","plant","planet","planets","plate","seat","slate","stale","steal"]},
  {letters:"BRAINY",words:["airy","barn","binary","brain","brainy","bray","rain","rainy"]},
  {letters:"MARKETS",words:["maker","market","markets","rate","smart","stake","stark","steam","task","team"]},
  {letters:"JOURNEY",words:["enjoy","jury","journey","rune","your","yore"]},
  {letters:"FAMILY",words:["aim","fail","family","film","lay","mail","may"]},
  {letters:"ORCHARD",words:["arch","card","char","chord","hard","hoard","orchard","road"]},
  {letters:"BRIGHTEN",words:["begin","bright","eight","height","night","right","their","thing"]},
  {letters:"CAPTURE",words:["acute","cape","capture","carpet","crate","pace","pure","react","trace"]},
  {letters:"WONDER",words:["down","drew","owner","redo","rowed","wonder","word","worn"]}
];
const canBuild=(word,letters)=>{const pool=letters.toLowerCase().split("");return word.split("").every(char=>{const i=pool.indexOf(char);if(i<0)return false;pool.splice(i,1);return true;});};

export function WordArchitect({game}){
  const [round,setRound]=useState(()=>Math.floor(Math.random()*wordRounds.length));
  const [entry,setEntry]=useState(""),[found,setFound]=useState([]),[seconds,setSeconds]=useState(90),[message,setMessage]=useState("Build words of three letters or more."),[active,setActive]=useState(false);
  const data=wordRounds[round%wordRounds.length];
  const score=found.reduce((sum,word)=>sum+word.length*word.length*3,0);
  useEffect(()=>{if(!active||seconds<=0)return;const timer=setTimeout(()=>setSeconds(v=>v-1),1000);return()=>clearTimeout(timer);},[active,seconds]);
  const reset=()=>{setRound(value=>(value+1)%wordRounds.length);setEntry("");setFound([]);setSeconds(90);setMessage("A fresh letter set is ready.");setActive(true);};
  const submit=()=>{
    const word=entry.trim().toLowerCase();setEntry("");
    if(word.length<3){setMessage("Use at least three letters.");return;}
    if(!canBuild(word,data.letters)){setMessage("That word uses letters outside the rack.");return;}
    if(found.includes(word)){setMessage("Already found. Build a different word.");return;}
    if(!data.words.includes(word)){setMessage("That word is not in this round’s curated dictionary.");return;}
    setFound(list=>[...list,word]);setMessage(word.length>=6?"Excellent structure—long words earn a strong bonus.":"Valid word. Keep combining.");
  };
  if(seconds===0)return <GameFrame game={game} score={score} onReset={reset}><Completion title="Blueprint complete." text={"You found "+found.length+" of "+data.words.length+" curated words."} xp={score} detail={{value:found.length+"/"+data.words.length,label:"words discovered"}} onAgain={reset}/></GameFrame>;
  return <GameFrame game={game} score={score} step={seconds+"s"} onReset={reset} onStart={()=>setActive(true)}><section className="word-stage"><span className="panel-label">VOCABULARY CONSTRUCTION</span><h1>Build beyond the obvious.</h1><div className="letter-rack">{data.letters.split("").map((letter,index)=><span key={index}>{letter}<small>{index+1}</small></span>)}</div><form onSubmit={event=>{event.preventDefault();submit();}}><input value={entry} onChange={event=>setEntry(event.target.value.replace(/[^a-z]/gi,""))} placeholder="Type a word…" autoComplete="off" aria-label="Word"/><button className="cta">Add word</button></form><p className="word-message" aria-live="polite">{message}</p><div className="found-words">{found.length?found.map(word=><span key={word}>{word}<b>+{word.length*word.length*3}</b></span>):<i>Your valid words will appear here.</i>}</div><button className="text-action" onClick={()=>setSeconds(0)}>Finish round</button></section></GameFrame>;
}

const rowSums=[13,14,18],columnSums=[10,20,15];
export function KakuroVault({game}){
  const [values,setValues]=useState(Array(9).fill(0)),[selected,setSelected]=useState(0),[checks,setChecks]=useState(0),[message,setMessage]=useState("Fill each run with unique digits that match its sum.");
  const groupsValid=(lines,sums)=>lines.every((line,i)=>line.reduce((a,b)=>a+b,0)===sums[i]&&new Set(line).size===3);
  const rows=Array.from({length:3},(_,r)=>values.slice(r*3,r*3+3));
  const columns=Array.from({length:3},(_,c)=>[values[c],values[c+3],values[c+6]]);
  const won=values.every(Boolean)&&groupsValid(rows,rowSums)&&groupsValid(columns,columnSums);
  const reset=()=>{setValues(Array(9).fill(0));setSelected(0);setChecks(0);setMessage("The vault has reset.");};
  const inspect=()=>{setChecks(v=>v+1);setMessage(won?"Every sum aligns.":"At least one run has the wrong sum or repeats a digit.");};
  if(won)return <GameFrame game={game} score={Math.max(100,240-checks*20)} onReset={reset}><Completion title="Vault unlocked." text="Every crossing run balances without repeating a digit." xp={Math.max(100,240-checks*20)} detail={{value:checks||"0",label:"checks used"}} onAgain={reset}/></GameFrame>;
  return <GameFrame game={game} score={values.filter(Boolean).length*8} step="SUM GRID" onReset={reset}><section className="kakuro-stage"><span className="panel-label">INTERSECTING SUMS</span><h1>Every crossing matters.</h1><p>{message}</p><div className="kakuro-grid"><div className="clue dark"/>{columnSums.map(sum=><div className="clue" key={sum}>↓ {sum}</div>)}{rows.map((row,r)=><div className="kakuro-row" key={r}><div className="clue">→ {rowSums[r]}</div>{row.map((value,c)=>{const index=r*3+c;return <button key={index} className={selected===index?"selected":""} onClick={()=>setSelected(index)}>{value||""}</button>;})}</div>)}</div><div className="number-pad">{[1,2,3,4,5,6,7,8,9].map(number=><button key={number} onClick={()=>setValues(list=>list.map((v,i)=>i===selected?number:v))}>{number}</button>)}</div><div className="puzzle-actions"><p><Lightbulb/>Digits may not repeat within a run.</p><button className="cta" onClick={inspect}><Check/>Check sums</button></div></section></GameFrame>;
}

const bitFor=(from,to)=>{const dr=to[0]-from[0],dc=to[1]-from[1];if(dr===-1)return 1;if(dc===1)return 2;if(dr===1)return 4;return 8;};
const rotateMask=(mask,times=1)=>{let result=mask;for(let i=0;i<times;i++)result=((result<<1)&15)|((result>>3)&1);return result;};
function circuitPath(){
  const path=[];for(let r=0;r<5;r++){const cols=r%2?[4,3,2,1,0]:[0,1,2,3,4];cols.forEach(c=>path.push([r,c]));}
  return path.map((cell,index)=>(index?bitFor(cell,path[index-1]):0)|(index<path.length-1?bitFor(cell,path[index+1]):0));
}
const solvedCircuit=circuitPath();
const scrambledCircuit=()=>solvedCircuit.map(mask=>rotateMask(mask,1+Math.floor(Math.random()*3)));
const circuitGlyph=mask=>({1:"╵",2:"╶",3:"└",4:"╷",5:"│",6:"┌",7:"├",8:"╴",9:"┘",10:"─",11:"┴",12:"┐",13:"┤",14:"┬",15:"┼"}[mask]||"•");

export function CircuitArchitect({game}){
  const [tiles,setTiles]=useState(scrambledCircuit),[moves,setMoves]=useState(0);
  const won=tiles.every((mask,index)=>mask===solvedCircuit[index]);
  const reset=()=>{setTiles(scrambledCircuit());setMoves(0);};
  if(won)return <GameFrame game={game} score={Math.max(100,300-moves*3)} onReset={reset}><Completion title="Signal restored." text="One continuous route now carries power through every terminal." xp={Math.max(100,300-moves*3)} detail={{value:moves,label:"rotations"}} onAgain={reset}/></GameFrame>;
  return <GameFrame game={game} score={Math.max(0,120-moves)} step={moves+" ROTATIONS"} onReset={reset}><section className="circuit-stage"><span className="panel-label">SYSTEMS PUZZLE</span><h1>Route one clean signal.</h1><p>Rotate every component until the route flows from the green source to the final terminal.</p><div className="circuit-board">{tiles.map((mask,index)=><button key={index} className={index===0?"source":index===24?"terminal":""} onClick={()=>{setTiles(list=>list.map((tile,i)=>i===index?rotateMask(tile):tile));setMoves(v=>v+1);}} aria-label={"Rotate circuit tile "+(index+1)}><span>{circuitGlyph(mask)}</span></button>)}</div><div className="tip"><RotateCw/>Corners need two connected sides; straight pieces connect opposite sides.</div></section></GameFrame>;
}
