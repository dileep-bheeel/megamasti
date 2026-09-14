import { useEffect, useMemo, useState } from "react";
import { Accessibility, ArrowRight, Brain, ChevronRight, Gamepad2, Menu, Search, Sparkles, Star, Trophy, Users, X, Zap } from "lucide-react";
import { BrowserRouter, Link, NavLink, Route, Routes, useParams } from "react-router-dom";
import { featuredIds, gameCategories, games, getGame } from "./data/games";
import GameEngine from "./games/GameEngine";

function Logo() {
  return <Link to="/" className="logo"><span className="logo-symbol">M</span><span>MEGA<strong>MASTI</strong><small>PLAY • LEARN • CREATE</small></span></Link>;
}

function Header({ onAccessibility }) {
  const [open,setOpen] = useState(false);
  return <header className="site-header"><Logo />
    <nav className={open ? "open" : ""}>
      <NavLink to="/" onClick={() => setOpen(false)}>Discover</NavLink>
      <NavLink to="/games" onClick={() => setOpen(false)}>All Games</NavLink>
      <a href="/#how" onClick={() => setOpen(false)}>How it works</a>
      <button className="mobile-close" onClick={() => setOpen(false)}><X /></button>
    </nav>
    <div className="header-tools"><button className="access-button" onClick={onAccessibility}><Accessibility size={18} /> Accessibility</button><Link className="play-button" to="/games">Start playing <ArrowRight size={17} /></Link><button className="menu-button" onClick={() => setOpen(true)}><Menu /></button></div>
  </header>;
}

function GameCard({ game, featured = false }) {
  return <Link to={"/play/" + game.id} className={"game-card " + (featured ? "featured-game" : "")} style={{"--accent":game.accent}}>
    <div className="game-card-top"><span>{game.category}</span><b>{game.ages}</b></div>
    <div className="game-glyph">{game.title.split(" ").map(word => word[0]).slice(0,2).join("")}</div>
    <h3>{game.title}</h3><p>{game.description}</p>
    <div className="skill-row">{game.skills.map(skill => <span key={skill}>{skill}</span>)}</div>
    <div className="game-card-foot"><span>{game.level}</span><b>Play now <ChevronRight size={16} /></b></div>
  </Link>;
}

function Home() {
  const featured = featuredIds.map(getGame);
  return <main>
    <section className="home-hero">
      <div className="hero-grid"/>
      <div className="hero-copy"><div className="edition"><Sparkles size={15} /> The new home of intelligent play</div>
        <h1>Play deeper.<br /><em>Think brighter.</em></h1>
        <p>Thirty beautifully crafted games for curious minds, creative families and competitive friends—across every generation.</p>
        <div className="hero-actions"><Link to="/games" className="mega-cta">Explore 30 games <ArrowRight /></Link><a href="#featured">See flagship games</a></div>
        <div className="trust-row"><span><b>30</b> distinct games</span><span><b>5</b> skill worlds</span><span><b>6–80+</b> designed for everyone</span></div>
      </div>
      <div className="hero-showcase">
        <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
        <Link to="/play/chess-academy" className="showcase-card main"><span>FLAGSHIP 01</span><div className="mini-board">{Array.from({length:16},(_,index) => <i key={index}>{[0,3,5,6,9,10,12,15].includes(index) ? "♟" : ""}</i>)}</div><h3>Chess Academy</h3><p>Learn every move. Understand every idea.</p></Link>
        <Link to="/play/story-forge" className="showcase-card floating"><span>CREATIVITY</span><strong>Story<br />Forge</strong></Link>
        <div className="xp-pill"><Zap /> +2,480 minds playing</div>
      </div>
    </section>

    <section className="audience-strip"><p>Choose your energy</p><div><Link to="/games?for=kids">Young explorers</Link><Link to="/games?for=family">Families</Link><Link to="/games?for=friends">Friends</Link><Link to="/games?for=brain">Brain training</Link><Link to="/games?for=creative">Creative minds</Link></div></section>

    <section className="featured-section" id="featured"><div className="section-heading"><div><span>CURATED STARTING POINTS</span><h2>Four worlds. Infinite ways to grow.</h2></div><Link to="/games">View every game <ArrowRight /></Link></div>
      <div className="featured-grid">{featured.map((game,index) => <div className={"feature-wrap f" + index} key={game.id}><GameCard game={game} featured /></div>)}</div>
    </section>

    <section className="skill-worlds">
      <div className="world-intro"><span>NOT JUST ENTERTAINMENT</span><h2>Every session leaves something behind.</h2><p>MegaMasti combines thoughtful game design with meaningful skills—without turning play into homework.</p></div>
      <div className="world-list">
        <div><Brain /><span><b>Sharper reasoning</b><small>Strategy, deduction and pattern intelligence</small></span><strong>01</strong></div>
        <div><Sparkles /><span><b>Braver creativity</b><small>Stories, ideas, language and invention</small></span><strong>02</strong></div>
        <div><Users /><span><b>Better connection</b><small>Cooperative play across generations</small></span><strong>03</strong></div>
        <div><Trophy /><span><b>Visible progress</b><small>Levels, mastery and meaningful milestones</small></span><strong>04</strong></div>
      </div>
    </section>

    <section className="how-section" id="how"><div><span>ONE PLATFORM • EVERY MOOD</span><h2>Your next great game is three taps away.</h2></div><ol><li><b>01</b><h3>Choose your intention</h3><p>Learn, compete, create, connect or train your brain.</p></li><li><b>02</b><h3>Set your experience</h3><p>Pick age range, difficulty and solo or group play.</p></li><li><b>03</b><h3>Enter the world</h3><p>Start with a guided round and grow at your pace.</p></li></ol></section>
    <section className="closing-cta"><div className="glow"/><span>YOUR MOVE</span><h2>Thirty games.<br />No wasted time.</h2><p>Find the one that changes how you think.</p><Link to="/games">Enter MegaMasti <ArrowRight /></Link></section>
  </main>;
}

function Catalogue() {
  const [category,setCategory] = useState("All games");
  const [query,setQuery] = useState("");
  const filtered = useMemo(() => games.filter(game => (category === "All games" || game.category === category) && (game.title + game.description + game.skills.join(" ")).toLowerCase().includes(query.toLowerCase())),[category,query]);
  return <main className="catalogue-page">
    <section className="catalogue-head"><span>THE COMPLETE COLLECTION</span><h1>Thirty games.<br /><em>Five ways to grow.</em></h1><p>Every experience is designed around a real skill, a clear purpose and the joy of getting better.</p></section>
    <section className="filters"><div className="catalogue-search"><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search games or skills…" /></div><div className="filter-tabs">{gameCategories.map(item => <button key={item} onClick={() => setCategory(item)} className={category === item ? "active" : ""}>{item}</button>)}</div></section>
    <div className="catalogue-meta"><span>{filtered.length} experiences</span><b>Designed for ages 6–80+</b></div>
    <section className="games-grid">{filtered.map(game => <GameCard game={game} key={game.id} />)}</section>
  </main>;
}

function PlayPage() {
  const {gameId} = useParams();
  const game = getGame(gameId);
  if (!game) return <main className="not-found"><h1>Game not found.</h1><Link to="/games">Explore all games</Link></main>;
  return <GameEngine game={game} />;
}

function Footer() {
 return <footer className="site-footer"><Logo /><p>Intelligent entertainment for every generation.</p><div><Link to="/games">Games</Link><a href="/#how">How it works</a><a href="mailto:hello@megamasti.com">Contact</a></div><small>© 2026 MegaMasti. Play thoughtfully.</small></footer>;
}

function Site() {
  const [accessOpen,setAccessOpen] = useState(false);
  const [largeText,setLargeText] = useState(false);
  const [contrast,setContrast] = useState(false);
  const [reducedMotion,setReducedMotion] = useState(false);
  useEffect(() => { document.body.classList.toggle("large-text",largeText);document.body.classList.toggle("high-contrast",contrast);document.body.classList.toggle("reduced-motion",reducedMotion); },[largeText,contrast,reducedMotion]);
  return <><Routes>
    <Route path="/play/:gameId" element={<PlayPage />} />
    <Route path="*" element={<div className="site-shell"><Header onAccessibility={() => setAccessOpen(true)} /><Routes><Route path="/" element={<Home />} /><Route path="/games" element={<Catalogue />} /><Route path="*" element={<Home />} /></Routes><Footer /></div>} />
  </Routes>
  {accessOpen && <div className="access-drawer"><button onClick={() => setAccessOpen(false)}><X /></button><span>ACCESSIBILITY</span><h2>Make MegaMasti yours.</h2><label><input type="checkbox" checked={largeText} onChange={event => setLargeText(event.target.checked)} /> Larger text</label><label><input type="checkbox" checked={contrast} onChange={event => setContrast(event.target.checked)} /> Higher contrast</label><label><input type="checkbox" checked={reducedMotion} onChange={event => setReducedMotion(event.target.checked)} /> Reduced motion</label></div>}
  </>;
}

export default function App() {
 return <BrowserRouter><Site /></BrowserRouter>;
}
