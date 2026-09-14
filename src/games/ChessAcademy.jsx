import { useRef, useState } from "react";
import { Chess } from "chess.js";
import { Sparkles } from "lucide-react";
import { chessLessons } from "../data/content";
import { GameFrame, sample } from "./Common";

const symbols = { p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚" };

export default function ChessAcademy({ game, puzzle = false }) {
  const chessRef = useRef(new Chess());
  const [, setVersion] = useState(0);
  const [selected, setSelected] = useState(null);
  const [lesson, setLesson] = useState(0);
  const [message, setMessage] = useState(puzzle ? "Find the strongest move." : "White to move. Select a piece.");
  const [xp, setXp] = useState(0);
  const chess = chessRef.current;
  const board = chess.board();

  const reset = () => {
    chessRef.current = new Chess();
    setVersion(value => value + 1);
    setSelected(null);
    setMessage(puzzle ? "Find the strongest move." : "White to move. Select a piece.");
    setXp(0);
  };

  const play = (row, column) => {
    const square = "abcdefgh"[column] + (8 - row);
    if (!selected) {
      const piece = chess.get(square);
      if (piece && piece.color === "w") {
        setSelected(square);
        setMessage("Selected " + piece.type.toUpperCase() + " on " + square + ". Choose its destination.");
      }
      return;
    }
    try {
      const move = chess.move({ from: selected, to: square, promotion: "q" });
      if (!move) return;
      setXp(value => value + 15);
      setMessage(move.san + " — now examine your opponent’s forcing replies.");
      setSelected(null);
      setVersion(value => value + 1);
      if (!chess.isGameOver()) {
        setTimeout(() => {
          const moves = chessRef.current.moves();
          chessRef.current.move(sample(moves));
          setVersion(value => value + 1);
          setMessage("Your turn. Scan checks, captures, then threats.");
        }, 380);
      }
    } catch {
      setMessage("That move is not legal. Look for another route.");
      setSelected(null);
    }
  };

  const legal = selected ? chess.moves({ square: selected, verbose: true }).map(move => move.to) : [];

  return <GameFrame game={game} score={xp} step={puzzle ? "TACTICS" : "ACADEMY"} onReset={reset}>
    <div className="chess-layout">
      <section className="chess-panel">
        <div className="chess-head"><span>GUIDED MATCH</span><strong>{chess.turn() === "w" ? "Your move" : "Coach thinking…"}</strong></div>
        <div className="chess-board">
          {board.flatMap((row, rowIndex) => row.map((piece, columnIndex) => {
            const square = "abcdefgh"[columnIndex] + (8 - rowIndex);
            const className = ((rowIndex + columnIndex) % 2 ? "dark" : "light") + (selected === square ? " selected" : "") + (legal.includes(square) ? " legal" : "");
            return <button key={square} onClick={() => play(rowIndex, columnIndex)} className={className} aria-label={square}>
              {piece && <span className={piece.color === "w" ? "white-piece" : "black-piece"}>{symbols[piece.type]}</span>}
              <small>{columnIndex === 0 ? 8 - rowIndex : ""}{rowIndex === 7 ? "abcdefgh"[columnIndex] : ""}</small>
            </button>;
          }))}
        </div>
        <div className="coach-message"><Sparkles /><span>{message}</span></div>
      </section>
      <aside className="lesson-panel">
        <span className="panel-label">MICRO LESSON {lesson + 1}/{chessLessons.length}</span>
        <h2>{chessLessons[lesson].title}</h2><p>{chessLessons[lesson].body}</p>
        <button onClick={() => setLesson(value => (value + 1) % chessLessons.length)}>Next principle →</button>
        <div className="analysis-list"><div><i />Development</div><div><i />King safety</div><div><i />Centre control</div></div>
      </aside>
    </div>
  </GameFrame>;
}
