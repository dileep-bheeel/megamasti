import ChessAcademy from "./ChessAcademy";
import KnowledgeGame from "./KnowledgeGame";
import { Detective, Mastermind, Sudoku } from "./LogicGames";
import { CreativeStudio, RhythmLab, SocialRound } from "./CreativeSocialGames";

export default function GameEngine({ game }) {
  const key = game.engine;
  if (key === "chess") return <ChessAcademy game={game} />;
  if (key === "mastermind") return <Mastermind game={game} />;
  if (key === "sudoku") return <Sudoku game={game} />;
  if (key === "detective") return <Detective game={game} />;
  if (["story","debate","caption","invent","mystery"].includes(key)) return <CreativeStudio game={game} type={key} />;
  if (["charades","forbidden","mission","feud"].includes(key)) return <SocialRound game={game} type={key} />;
  if (key === "rhythm") return <RhythmLab game={game} />;
  if (key.startsWith("quiz") || key === "science") return <KnowledgeGame game={game} bankKey={key} />;
  throw new Error(`No production game engine is registered for ${game.id}`);
}
