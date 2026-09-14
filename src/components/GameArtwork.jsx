const artKind = game => {
  if (game.engine === "chess") return "chess";
  if (game.engine === "sudoku") return "sudoku";
  if (game.engine === "mastermind") return "code";
  if (game.engine === "detective") return "detective";
  if (game.engine === "rhythm") return "rhythm";
  if (game.engine?.startsWith("quiz") || game.engine === "science") return "knowledge";
  if (["story","debate","caption","invent","mystery"].includes(game.engine)) return "creative";
  return "social";
};

const artworks = {
  chess: <div className="art-chess"><span>♞</span><i /><i /><i /><i /><b>♜</b></div>,
  sudoku: <div className="art-sudoku">{["8","","3","","6","1","","4",""].map((n,i) => <i key={i}>{n}</i>)}</div>,
  code: <div className="art-code">{["#ff6b6b","#ffd166","#52d6b2","#8e7dff","#52d6b2","#ff6b6b"].map((color,i) => <i key={i} style={{background:color}} />)}</div>,
  detective: <div className="art-detective"><i>CASE</i><span>07</span><b /><b /><b /></div>,
  rhythm: <div className="art-rhythm">{[42,76,55,92,64,34,82].map((height,i) => <i key={i} style={{height:height + "%"}} />)}</div>,
  knowledge: <div className="art-knowledge"><span>24°</span><i /><b>?</b><small>EXPLORE</small></div>,
  creative: <div className="art-creative"><i>Once upon<br/>a different idea…</i><span>✦</span><b /></div>,
  social: <div className="art-social"><span>YOUR TURN</span><i /><i /><i /><b>!</b></div>
};

export default function GameArtwork({ game, compact = false }) {
  const kind = artKind(game);
  return <div className={"game-artwork art-" + kind + (compact ? " compact" : "")} aria-hidden="true">
    <div className="art-index">{game.category.slice(0,3).toUpperCase()}</div>
    {artworks[kind]}
    <div className="art-title">{game.title}</div>
  </div>;
}
