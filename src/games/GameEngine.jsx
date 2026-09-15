import { lazy, Suspense } from "react";

const ChessAcademy = lazy(() => import("./ChessAcademy"));
const KnowledgeGame = lazy(() => import("./KnowledgeGame"));
const Mastermind = lazy(() => import("./LogicGames").then(module => ({default:module.Mastermind})));
const Sudoku = lazy(() => import("./LogicGames").then(module => ({default:module.Sudoku})));
const Detective = lazy(() => import("./LogicGames").then(module => ({default:module.Detective})));
const CreativeStudio = lazy(() => import("./CreativeSocialGames").then(module => ({default:module.CreativeStudio})));
const SocialRound = lazy(() => import("./CreativeSocialGames").then(module => ({default:module.SocialRound})));
const RhythmLab = lazy(() => import("./CreativeSocialGames").then(module => ({default:module.RhythmLab})));
const ReversiArena = lazy(() => import("./ExtendedGames").then(module => ({default:module.ReversiArena})));
const NonogramStudio = lazy(() => import("./ExtendedGames").then(module => ({default:module.NonogramStudio})));
const KakuroVault = lazy(() => import("./ExtendedGames").then(module => ({default:module.KakuroVault})));
const CircuitArchitect = lazy(() => import("./ExtendedGames").then(module => ({default:module.CircuitArchitect})));
const WordArchitect = lazy(() => import("./ExtendedGames").then(module => ({default:module.WordArchitect})));

function EngineLoading({ title }) {
  return <div className="engine-loading" role="status"><div /><span>Loading {title}…</span></div>;
}

export default function GameEngine({ game }) {
  const key = game.engine;
  let experience = null;
  if (key === "chess") experience = <ChessAcademy game={game} />;
  if (key === "mastermind") experience = <Mastermind game={game} />;
  if (key === "reversi") experience = <ReversiArena game={game} />;
  if (key === "nonogram") experience = <NonogramStudio game={game} />;
  if (key === "kakuro") experience = <KakuroVault game={game} />;
  if (key === "circuit") experience = <CircuitArchitect game={game} />;
  if (key === "words") experience = <WordArchitect game={game} />;
  if (key === "sudoku") experience = <Sudoku game={game} />;
  if (key === "detective") experience = <Detective game={game} />;
  if (["story","debate","caption","invent","mystery"].includes(key)) experience = <CreativeStudio game={game} type={key} />;
  if (["charades","forbidden","mission","feud"].includes(key)) experience = <SocialRound game={game} type={key} />;
  if (key === "rhythm") experience = <RhythmLab game={game} />;
  if (key.startsWith("quiz") || key === "science") experience = <KnowledgeGame game={game} bankKey={key} />;
  if (!experience) throw new Error(`No production game engine is registered for ${game.id}`);
  return <Suspense fallback={<EngineLoading title={game.title} />}>{experience}</Suspense>;
}
