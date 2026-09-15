import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Sparkles } from "lucide-react";
import { chessLessons } from "../data/content";
import { Completion, GameFrame } from "./Common";

const symbols = { p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚" };

export default function ChessAcademy({ game }) {
  const chessRef = useRef(new Chess());
  const replyTimer = useRef(null);
  const [,setVersion] = useState(0);
  const [selected,setSelected] = useState(null);
  const [lesson,setLesson] = useState(0);
  const [message,setMessage] = useState("White to move. Select a piece.");
  const [xp,setXp] = useState(0);
  const [thinking,setThinking] = useState(false);
  const [promotion,setPromotion] = useState("q");
  const chess = chessRef.current;
  const board = chess.board();

  useEffect(() => () => { if (replyTimer.current) clearTimeout(replyTimer.current); },[]);

  const reset = () => {
    if (replyTimer.current) clearTimeout(replyTimer.current);
    chessRef.current = new Chess();
    setVersion(value => value + 1); setSelected(null); setMessage("White to move. Select a piece."); setXp(0); setThinking(false);
  };

  const play = (row,column) => {
    if (thinking || chess.isGameOver()) return;
    const square = "abcdefgh"[column] + (8 - row);
    if (!selected) {
      const piece = chess.get(square);
      if (piece && piece.color === "w") {
        setSelected(square);
        setMessage("Selected " + piece.type.toUpperCase() + " on " + square + ". Choose a highlighted destination.");
      }
      return;
    }
    try {
      const move = chess.move({from:selected,to:square,promotion});
      if (!move) return;
      setXp(value => value + 15); setMessage(move.san + " — checking the reply."); setSelected(null); setVersion(value => value + 1);
      if (!chess.isGameOver()) {
        setThinking(true);
        replyTimer.current = setTimeout(() => {
          const current = chessRef.current;
          if (!current.isGameOver()) {
            const candidates=current.moves({verbose:true}).map(candidate=>{
              const value={p:1,n:3,b:3,r:5,q:9,k:0}[candidate.captured]||0;
              const centre=["d4","e4","d5","e5"].includes(candidate.to)?0.6:0;
              const forcing=/[+#]/.test(candidate.san)?1.2:0;
              return {candidate,score:value+centre+forcing+Math.random()*.25};
            });
            candidates.sort((a,b)=>b.score-a.score);
            if(candidates[0])current.move(candidates[0].candidate);
          }
          setThinking(false); setVersion(value => value + 1);
          setMessage(current.isGameOver() ? "The match is complete." : current.inCheck() ? "Your king is in check. Find a legal defence." : "Your turn. Scan checks, captures, then threats.");
        },420);
      }
    } catch {
      setMessage("That move is not legal. Choose another destination.");
      setSelected(null);
    }
  };

  const legal = selected ? chess.moves({square:selected,verbose:true}).map(move => move.to) : [];
  const history=chess.history({verbose:true});
  const capturedWhite=history.filter(move=>move.color==="b"&&move.captured).map(move=>symbols[move.captured]);
  const capturedBlack=history.filter(move=>move.color==="w"&&move.captured).map(move=>symbols[move.captured]);
  const result = chess.isCheckmate() ? (chess.turn() === "b" ? "You delivered checkmate." : "The coach delivered checkmate.") : chess.isDraw() ? "The position is drawn." : null;

  return <GameFrame game={game} score={xp} step={thinking ? "COACH THINKING" : "ACADEMY"} onReset={reset}>
    {result ? <Completion title={result} text="Review the principles, reset the board and try to improve your development and king safety." xp={xp} onAgain={reset} /> :
    <div className="chess-layout">
      <section className="chess-panel">
        <div className="chess-head"><span>GUIDED MATCH</span><strong>{thinking ? "Coach thinking…" : "Your move"}</strong></div>
        <div className="chess-board" aria-label="Interactive chess board">
          {board.flatMap((row,rowIndex) => row.map((piece,columnIndex) => {
            const square = "abcdefgh"[columnIndex] + (8 - rowIndex);
            const className = ((rowIndex + columnIndex) % 2 ? "dark" : "light") + (selected === square ? " selected" : "") + (legal.includes(square) ? " legal" : "");
            return <button key={square} onClick={() => play(rowIndex,columnIndex)} className={className} aria-label={square + (piece ? " " + (piece.color === "w" ? "white " : "black ") + piece.type : " empty")}>
              {piece && <span className={piece.color === "w" ? "white-piece" : "black-piece"}>{symbols[piece.type]}</span>}
              <small>{columnIndex === 0 ? 8 - rowIndex : ""}{rowIndex === 7 ? "abcdefgh"[columnIndex] : ""}</small>
            </button>;
          }))}
        </div>
        <div className="captured-row"><span aria-label="Black pieces captured">{capturedBlack.join(" ") || "No captures"}</span><span aria-label="White pieces captured">{capturedWhite.join(" ") || "No captures"}</span></div>
        <div className="coach-message" aria-live="polite"><Sparkles /><span>{message}</span></div>
      </section>
      <aside className="lesson-panel"><span className="panel-label">LEARNING PATH {lesson + 1}/{chessLessons.length}</span><h2>{chessLessons[lesson].title}</h2><p>{chessLessons[lesson].body}</p><button onClick={() => setLesson(value => (value + 1) % chessLessons.length)}>Next lesson →</button>
        <label className="promotion-choice">Pawn promotion<select value={promotion} onChange={event=>setPromotion(event.target.value)}><option value="q">Queen</option><option value="r">Rook</option><option value="b">Bishop</option><option value="n">Knight</option></select></label>
        <div className="move-history"><strong>Moves</strong><p>{history.length?history.slice(-10).map(move=>move.san).join("  "):"Your move history will appear here."}</p></div>
        <div className="analysis-list"><div><i />Legal move validation</div><div><i />Check and checkmate</div><div><i />Castling and en passant</div></div>
      </aside>
    </div>}
  </GameFrame>;
}
