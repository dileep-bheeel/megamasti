import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Accessibility, ArrowRight, Brain, ChevronRight, Gamepad2, Heart, Menu, Search, Sparkles, Trophy, Users, X, Zap } from "lucide-react";
import { BrowserRouter, Link, NavLink, Outlet, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { featuredIds, gameCategories, games, getGame } from "./data/games";
import { isPlayable, withDetails } from "./data/gameDetails";
import { useProgress } from "./context/ProgressContext";
import usePageMeta from "./hooks/usePageMeta";

const GameEngine = lazy(() => import("./games/GameEngine"));
const playableGames = games.filter(game => isPlayable(game.id)).map(withDetails);

function Logo() {
  return <Link to="/" className="logo"><span className="logo-symbol">M</span><span>MEGA<strong>MASTI</strong><small>PLAY • LEARN • CREATE</small></span></Link>;
}

function Header({ onAccessibility }) {
  const [open,setOpen] = useState(false);
  return <header className="site-header"><Logo />
    <nav className={open ? "open" : ""} aria-label="Primary navigation">
      <NavLink to="/" onClick={() => setOpen(false)}>Discover</NavLink>
      <NavLink to="/games" onClick={() => setOpen(false)}>Games</NavLink>
      <a href="/#how" onClick={() => setOpen(false)}>How it works</a>
      <button className="mobile-close" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
    </nav>
    <div className="header-tools"><button className="access-button" onClick={onAccessibility}><Accessibility size={18} /> Accessibility</button><Link className="play-button" to="/games">Start playing <ArrowRight size={17} /></Link><button className="menu-button" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button></div>
  </header>;
}

function GameCard({ game, featured = false }) {
  const {progress,toggleFavorite} = useProgress();
  const favorite = progress.favorites.includes(game.id);
  return <article className={"game-card " + (featured ? "featured-game" : "")} style={{"--accent":game.accent}}>
    <div className="game-card-top"><span>{game.category}</span><b>{game.ages}</b></div>
    <button className={"favorite-button " + (favorite ? "active" : "")} onClick={() => toggleFavorite(game.id)} aria-label={(favorite ? "Remove " : "Add ") + game.title + (favorite ? " from" : " to") + " favorites"}><Heart fill={favorite ? "currentColor" : "none"} /></button>
    <Link to={"/play/" + game.id} className="game-card-link">
      <div className="game-glyph">{game.title.split(" ").map(word => word[0]).slice(0,2).join("")}</div>
      <h3>{game.title}</h3><p>{game.description}</p>
      <div className="skill-row">{game.skills.map(skill => <span key={skill}>{skill}</span>)}</div>
      <div className="game-card-foot"><span>{game.duration} • {game.players}</span><b>Play <ChevronRight size={16} /></b></div>
    </Link>
  </article>;
}

function useDailyGame() {
  return useMemo(() => {
    const date = new Date();
    const key = Number(String(date.getUTCFullYear()) + String(date.getUTCMonth() + 1).padStart(2,"0") + String(date.getUTCDate()).padStart(2,"0"));
    return playableGames[key % playableGames.length];
  },[]);
}

function Home() {
  usePageMeta({title:"MegaMasti — Play Deeper. Think Brighter.",description:"Premium strategy, logic, knowledge, creativity and social games for every generation."});
  const navigate = useNavigate();
  const {progress} = useProgress();
  const daily = useDailyGame();
  const featured = featuredIds.map(id => playableGames.find(game => game.id === id)).filter(Boolean);
  const recent = progress.recent.map(id => playableGames.find(game => game.id === id)).filter(Boolean);
  const quickPlay = () => {
    const candidates = playableGames.filter(game => !progress.recent.slice(0,2).includes(game.id));
    const pool = candidates.length ? candidates : playableGames;
    navigate("/play/" + pool[Math.floor(Math.random() * pool.length)].id);
  };

  return <main>
    <section className="home-hero">
      <div className="hero-grid" />
      <div className="hero-copy"><div className="edition"><Sparkles size={15} /> Thoughtful play for every generation</div>
        <h1>Play deeper.<br /><em>Think brighter.</em></h1>
        <p>Premium games for strategy, knowledge, creativity and memorable time together—designed to be understood quickly and replayed often.</p>
        <div className="hero-actions"><button onClick={quickPlay} className="mega-cta">Quick play <Zap /></button><Link to="/games">Browse all playable games</Link></div>
        <div className="trust-row"><span><b>{playableGames.length}</b> playable experiences</span><span><b>5</b> skill worlds</span><span><b>6–80+</b> designed for everyone</span></div>
      </div>
      <div className="hero-showcase">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <Link to="/play/chess-academy" className="showcase-card main"><span>EDITOR’S PICK</span><div className="mini-board">{Array.from({length:16},(_,index) => <i key={index}>{[0,3,5,6,9,10,12,15].includes(index) ? "♟" : ""}</i>)}</div><h3>Chess Academy</h3><p>Learn every move. Understand every idea.</p></Link>
        <Link to="/play/story-forge" className="showcase-card floating"><span>CREATIVITY</span><strong>Story<br />Forge</strong></Link>
        <div className="xp-pill"><Gamepad2 /> No sign-up. No pressure.</div>
      </div>
    </section>

    <section className="audience-strip"><p>Choose your energy</p><div><Link to="/games">Young explorers</Link><Link to="/games">Families</Link><Link to="/games">Friends</Link><Link to="/games">Brain training</Link><Link to="/games">Creative minds</Link></div></section>

    {recent.length > 0 && <section className="continue-section"><div className="section-heading"><div><span>PICK UP WHERE YOU LEFT OFF</span><h2>Continue playing.</h2></div></div><div className="compact-game-row">{recent.slice(0,4).map(game => <GameCard game={game} key={game.id} />)}</div></section>}

    <section className="daily-section"><div><span>DAILY PICK</span><h2>One thoughtful game.<br />A fresh pick every day.</h2><p>Today’s selection is determined by the date—no fake popularity or pressure.</p></div><GameCard game={daily} featured /></section>

    <section className="featured-section" id="featured"><div className="section-heading"><div><span>CURATED STARTING POINTS</span><h2>Strong places to begin.</h2></div><Link to="/games">View playable games <ArrowRight /></Link></div>
      <div className="featured-grid">{featured.map((game,index) => <div className={"feature-wrap f" + index} key={game.id}><GameCard game={game} featured /></div>)}</div>
    </section>

    <section className="skill-worlds">
      <div className="world-intro"><span>NOT JUST ENTERTAINMENT</span><h2>Every session leaves something behind.</h2><p>MegaMasti combines thoughtful game design with meaningful skills—without turning play into homework.</p></div>
      <div className="world-list"><div><Brain /><span><b>Sharper reasoning</b><small>Strategy, deduction and pattern intelligence</small></span><strong>01</strong></div><div><Sparkles /><span><b>Braver creativity</b><small>Stories, ideas, language and invention</small></span><strong>02</strong></div><div><Users /><span><b>Better connection</b><small>Cooperative play across generations</small></span><strong>03</strong></div><div><Trophy /><span><b>Visible progress</b><small>Personal bests stored on your device</small></span><strong>04</strong></div></div>
    </section>

    <section className="how-section" id="how"><div><span>ONE PLATFORM • EVERY MOOD</span><h2>Your next great game is three taps away.</h2></div><ol><li><b>01</b><h3>Choose your intention</h3><p>Learn, compete, create, connect or train your brain.</p></li><li><b>02</b><h3>Read the essentials</h3><p>Every game explains its goal, controls, scoring and one useful tip.</p></li><li><b>03</b><h3>Play immediately</h3><p>No compulsory account, data collection or unnecessary setup.</p></li></ol></section>
    <section className="closing-cta"><div className="glow" /><span>YOUR MOVE</span><h2>Play with purpose.<br />Leave with more.</h2><p>Find the game that changes how you think.</p><Link to="/games">Enter MegaMasti <ArrowRight /></Link></section>
  </main>;
}

function Catalogue() {
  usePageMeta({title:"Games — MegaMasti",description:"Browse MegaMasti’s production-ready strategy, logic, knowledge, creativity and social games.",path:"/games"});
  const [category,setCategory] = useState("All games");
  const [query,setQuery] = useState("");
  const {progress} = useProgress();
  const filtered = useMemo(() => playableGames.filter(game => (category === "All games" || game.category === category) && (game.title + game.description + game.skills.join(" ")).toLowerCase().includes(query.toLowerCase())),[category,query]);
  const favorites = progress.favorites.map(id => playableGames.find(game => game.id === id)).filter(Boolean);

  return <main className="catalogue-page">
    <section className="catalogue-head"><span>PLAYABLE NOW</span><h1>Choose a challenge.<br /><em>Build a skill.</em></h1><p>Only complete, functional experiences appear here. More games will join the library after passing gameplay and quality review.</p></section>
    {favorites.length > 0 && <section className="favorites-strip"><span>YOUR FAVORITES</span><div>{favorites.map(game => <Link key={game.id} to={"/play/" + game.id}>{game.title}<ChevronRight /></Link>)}</div></section>}
    <section className="filters"><div className="catalogue-search"><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search games or skills…" aria-label="Search games" /></div><div className="filter-tabs">{gameCategories.map(item => <button key={item} onClick={() => setCategory(item)} className={category === item ? "active" : ""}>{item}</button>)}</div></section>
    <div className="catalogue-meta"><span>{filtered.length} playable experiences</span><b>Designed for ages 6–80+</b></div>
    <section className="games-grid">{filtered.map(game => <GameCard game={game} key={game.id} />)}</section>
    {!filtered.length && <section className="empty-state"><Search /><h2>No games match that search.</h2><button onClick={() => {setQuery("");setCategory("All games");}}>Clear filters</button></section>}
  </main>;
}

function PlayPage() {
  const {gameId} = useParams();
  const base = getGame(gameId);
  const game = base && isPlayable(base.id) ? withDetails(base) : null;
  usePageMeta({title:game ? game.title + " — MegaMasti" : "Game unavailable — MegaMasti",description:game ? game.description + " Learn how to play and start immediately." : "This MegaMasti game is not available.",path:game ? "/play/" + game.id : "/games"});
  if (!game) return <NotFound title="This game is not ready to play." />;
  return <Suspense fallback={<main className="loading-state"><div /><span>Preparing {game.title}…</span></main>}><GameEngine game={game} /></Suspense>;
}

function NotFound({title="That page wandered off the board."}) {
  usePageMeta({title:"Page not found — MegaMasti",description:"Return to the MegaMasti game library.",path:"/404"});
  return <main className="not-found-page"><span>404</span><h1>{title}</h1><p>Nothing is broken. This address simply does not lead to a playable experience.</p><Link to="/games">Browse playable games <ArrowRight /></Link></main>;
}

function Footer() {
 return <footer className="site-footer"><Logo /><p>Intelligent entertainment for every generation.</p><div><Link to="/games">Games</Link><a href="/#how">How it works</a><a href="mailto:hello@megamasti.com">Contact</a></div><small>© 2026 MegaMasti. Play thoughtfully.</small></footer>;
}

function Layout() {
  const [accessOpen,setAccessOpen] = useState(false);
  const {progress,setPreference} = useProgress();
  const preferences = progress.preferences;
  useEffect(() => {
    document.body.classList.toggle("large-text",preferences.largeText);
    document.body.classList.toggle("high-contrast",preferences.highContrast);
    document.body.classList.toggle("reduced-motion",preferences.reducedMotion);
  },[preferences]);
  return <div className="site-shell"><Header onAccessibility={() => setAccessOpen(true)} /><Outlet /><Footer />
    {accessOpen && <div className="drawer-backdrop" onMouseDown={event => event.target === event.currentTarget && setAccessOpen(false)}><section className="access-drawer" role="dialog" aria-modal="true" aria-labelledby="access-title"><button onClick={() => setAccessOpen(false)} aria-label="Close accessibility settings"><X /></button><span>ACCESSIBILITY</span><h2 id="access-title">Make MegaMasti yours.</h2><label><input type="checkbox" checked={preferences.largeText} onChange={event => setPreference("largeText",event.target.checked)} /> Larger text</label><label><input type="checkbox" checked={preferences.highContrast} onChange={event => setPreference("highContrast",event.target.checked)} /> Higher contrast</label><label><input type="checkbox" checked={preferences.reducedMotion} onChange={event => setPreference("reducedMotion",event.target.checked)} /> Reduced motion</label><label><input type="checkbox" checked={preferences.sound} onChange={event => setPreference("sound",event.target.checked)} /> Sound when available</label></section></div>}
  </div>;
}

export default function App() {
 return <BrowserRouter><Routes><Route element={<Layout />}><Route index element={<Home />} /><Route path="/games" element={<Catalogue />} /></Route><Route path="/play/:gameId" element={<PlayPage />} /><Route path="*" element={<NotFound />} /></Routes></BrowserRouter>;
}
