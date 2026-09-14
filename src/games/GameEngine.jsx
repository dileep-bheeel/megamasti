import ChessAcademy from "./ChessAcademy";
import KnowledgeGame from "./KnowledgeGame";
import { Detective, Mastermind, Sudoku } from "./LogicGames";
import { CreativeStudio, RhythmLab, SocialRound } from "./CreativeSocialGames";
import UniversalChallenge from "./UniversalChallenge";

export default function GameEngine({ game }) {
  const key = game.engine;
  if (key === "chess" || key === "chessPuzzle") return <ChessAcademy game={game} puzzle={key === "chessPuzzle"} />;
  if (key === "mastermind") return <Mastermind game={game} />;
  if (key === "sudoku") return <Sudoku game={game} />;
  if (key === "detective" || key === "escape") return <Detective game={game} escapeMode={key === "escape"} />;
  if (["story","debate","caption","invent","mystery"].includes(key)) return <CreativeStudio game={game} type={key} />;
  if (["charades","forbidden","mission","feud"].includes(key)) return <SocialRound game={game} type={key} />;
  if (key === "rhythm") return <RhythmLab game={game} />;
  if (key.startsWith("quiz")) return <KnowledgeGame game={game} bankKey={key} />;
  return <UniversalChallenge game={game} />;
}
