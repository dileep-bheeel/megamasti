import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Accessibility, ArrowRight, Brain, ChevronRight, Gamepad2, Heart, Menu, Search, Sparkles, Trophy, Users, X, Zap } from "lucide-react";
import { BrowserRouter, Link, NavLink, Outlet, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { featuredIds, gameCategories, games, getGame } from "./data/games";
import { isPlayable, withDetails } from "./data/gameDetails";
import { useProgress } from "./context/ProgressContext";
import usePageMeta from "./hooks/usePageMeta";
import GameArtwork from "./components/GameArtwork";
import { getDailyGame, getUtcDateKey } from "./utils/daily";

const GameEngine = lazy(() => import("./games/GameEngine"));
const playableGames = games.filter(game => isPlayable(game.id)).map(withDetails);
const websiteSchema = {"@context":"https://schema.org","@type":"WebSite",name:"MegaMasti",url:"https://megamasti.com",description:"Premium strategy, logic, knowledge, creativity and social games for every generation.",inLanguage:"en"};
const librarySchema = {"@context":"https://schema.org","@type":"CollectionPage",name:"MegaMasti Game Library",url:"https://megamasti.com/games",description:"Browse 25 free strategy, logic, knowledge, creativity and social games.",isPartOf:{"@type":"WebSite",name:"MegaMasti",url:"https://megamasti.com"}};

function Logo() {
  return <Link to="/" className="logo"><span className="logo-symbol">M</span><span>MEGA<strong>MASTI</strong><small>PLAY • LEARN • CREATE</small></span></Link>;
}

function Header({ onAccessibility }) {
  const [open,setOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const menuCloseRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const close = () => setOpen(false);
    const onKeyDown = event => {
      if (event.key === "Escape") close();
      if (event.key === "Tab") {
        const items = document.querySelectorAll("#primary-navigation a, #primary-navigation button");
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown",onKeyDown);
    menuCloseRef.current?.focus();
    return () => { document.removeEventListener("keydown",onKeyDown); previous?.focus?.(); };
  },[open]);
  return <header className="site-header"><Logo />
    <nav id="primary-navigation" className={open ? "open" : ""} aria-label="Primary navigation">
      <NavLink end to="/" onClick={() => setOpen(false)}>Home</NavLink>
      <NavLink to="/games" onClick={() => setOpen(false)}>Games</NavLink>
      <Link to="/#categories" onClick={() => setOpen(false)}>Categories</Link>
      <Link to="/#daily" onClick={() => setOpen(false)}>Daily pick</Link>
      <button ref={menuCloseRef} type="button" className="mobile-close" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
    </nav>
    <div className="header-tools"><button type="button" className="access-button" onClick={onAccessibility}><Accessibility size={18} /> Accessibility</button><Link className="play-button" to="/games">Start playing <ArrowRight size={17} /></Link><button ref={menuButtonRef} type="button" className="menu-button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-controls="primary-navigation"><Menu /></button></div>
  </header>;
}

function GameCard({ game, featured = false, label }) {
  const {progress,toggleFavorite} = useProgress();
  const favorite = progress.favorites.includes(game.id);
  return <article className={"game-card card-" + game.category.toLowerCase() + (featured ? " featured-game" : "")} style={{"--accent":game.accent}}>
    <div className="game-card-top"><span>{label || game.category}</span><b>{game.ages}</b></div>
    <button className={"favorite-button " + (favorite ? "active" : "")} onClick={() => toggleFavorite(game.id)} aria-label={(favorite ? "Remove " : "Add ") + game.title + (favorite ? " from" : " to") + " favorites"}><Heart fill={favorite ? "currentColor" : "none"} /></button>
    <Link to={"/play/" + game.id} className="game-card-link" aria-label={"Play " + game.title}>
      <GameArtwork game={game} />
      <div className="game-copy"><div className="game-title-row"><h3>{game.title}</h3><span>{game.level}</span></div><p>{game.description}</p></div>
      <div className="skill-row">{game.skills.map(skill => <span key={skill}>{skill}</span>)}</div>
      <div className="game-card-foot"><span>{game.duration}<i />{game.players}</span><b>Open game <ChevronRight size={16} /></b></div>
    </Link>
  </article>;
}

function useDailyGame() {
  return useMemo(() => getDailyGame(playableGames),[]);
}

const categoryWorlds = [
  {name:"Strategy",number:"01",note:"Plan ahead. Read the board.",icon:"♞"},
  {name:"Logic",number:"02",note:"Notice patterns. Find the proof.",icon:"◇"},
  {name:"Knowledge",number:"03",note:"Explore the world one answer at a time.",icon:"◎"},
  {name:"Creativity",number:"04",note:"Write, invent and surprise yourself.",icon:"✦"},
  {name:"Social",number:"05",note:"Bring everyone into the game.",icon:"◌"}
];

function CategoryShowcase() {
  return <section className="category-showcase" id="categories">
    <div className="section-heading"><div><span>FIVE WAYS TO PLAY</span><h2>Follow your curiosity.</h2></div><p>Pick a world now. Change your mind whenever you like.</p></div>
    <div className="category-rail">{categoryWorlds.map(world => <Link key={world.name} to={"/games?category=" + world.name} className={"category-tile category-" + world.name.toLowerCase()}>
      <div><small>{world.number}</small><i>{world.icon}</i></div><h3>{world.name}</h3><p>{world.note}</p><span>{playableGames.filter(game => game.category === world.name).length} games <ArrowRight /></span>
    </Link>)}</div>
  </section>;
}

function Home() {
  usePageMeta({title:"MegaMasti — Play Deeper. Think Brighter.",description:"Play 25 free strategy, logic, knowledge, creativity and social games for curious minds of every generation.",structuredData:websiteSchema});
  const navigate = useNavigate();
  const {progress} = useProgress();
  const daily = useDailyGame();
  const dailyComplete = progress.daily?.date === getUtcDateKey() && progress.daily?.gameId === daily.id && progress.daily?.completed && Number(progress.daily?.score || 0) > 0;
  const featured = featuredIds.map(id => playableGames.find(game => game.id === id)).filter(Boolean);
  const recent = progress.recent.map(id => playableGames.find(game => game.id === id)).filter(Boolean);
  const quickPlay = () => {
    const candidates = playableGames.filter(game => !progress.recent.slice(0,2).includes(game.id));
    const pool = candidates.length ? candidates : playableGames;
    navigate("/play/" + pool[Math.floor(Math.random() * pool.length)].id);
  };

  return <main id="main-content" tabIndex="-1">
    <section className="home-hero">
      <div className="hero-grid" />
      <div className="hero-copy"><div className="edition"><Sparkles size={15} /> Games for curious minds, ages 6–80+</div>
        <h1>A world of play.<br /><em>Made for every mind.</em></h1>
        <p>Strategy, stories, puzzles, knowledge and group fun—{playableGames.length} thoughtful games, ready whenever you are.</p>
        <div className="hero-actions"><button onClick={quickPlay} className="mega-cta">Start playing <Zap /></button><Link to="/games">Explore the collection <ArrowRight /></Link></div>
        <div className="trust-row"><span><b>{playableGames.length}</b> games ready now</span><span><b>5</b> distinct worlds</span><span><b>0</b> sign-up steps</span></div>
      </div>
      <div className="hero-showcase" aria-label="Featured MegaMasti games">
        <div className="showcase-caption"><span>THE PLAY TABLE</span><b>Choose a card. Begin anywhere.</b></div>
        <Link to="/play/chess-academy" className="showcase-card main"><GameArtwork game={playableGames.find(game => game.id === "chess-academy")} compact /><div><span>EDITOR’S PICK</span><h3>Chess Academy</h3><p>Learn every move. Understand every idea.</p></div></Link>
        <Link to="/play/story-forge" className="showcase-card floating"><GameArtwork game={playableGames.find(game => game.id === "story-forge")} compact /><span>CREATIVE PLAY</span><strong>Make the story only you could tell.</strong></Link>
        <div className="xp-pill"><Gamepad2 /> Play first. No account needed.</div>
      </div>
    </section>

    <section className="brand-marquee" aria-label="MegaMasti game types"><span>STRATEGY</span><i>✦</i><span>PUZZLES</span><i>✦</i><span>STORIES</span><i>✦</i><span>KNOWLEDGE</span><i>✦</i><span>TOGETHER</span></section>

    <CategoryShowcase />

    {recent.length > 0 && <section className="continue-section"><div className="section-heading"><div><span>PICK UP WHERE YOU LEFT OFF</span><h2>Continue playing.</h2></div></div><div className="compact-game-row">{recent.slice(0,4).map(game => <GameCard game={game} key={game.id} />)}</div></section>}

    {progress.totalXp > 0 && <section className="progress-shelf"><div><span>YOUR PLAY JOURNEY</span><h2>{progress.totalXp.toLocaleString()} XP</h2><p>{Object.keys(progress.completed).length} games explored • {Object.values(progress.completed).reduce((sum,value)=>sum+value,0)} sessions completed</p></div><div className="achievement-row">{progress.achievements.length ? progress.achievements.map(item=><span key={item}><Trophy/>{item}</span>) : <p>Your first achievement appears after a completed session.</p>}</div></section>}

    <section className={"daily-section "+(dailyComplete?"daily-complete":"")} id="daily"><div><span>{dailyComplete?"DAILY PICK COMPLETE":"DAILY PICK"}</span><h2>{dailyComplete?"Today’s challenge is in the books.":"One thoughtful game. A fresh pick every day."}</h2><p>{dailyComplete?"You scored "+progress.daily.score+" XP. Replay for mastery or explore another world.":"The same date-based selection appears for every visitor. Complete it to save today’s score."}</p></div><GameCard game={daily} featured label={dailyComplete?"COMPLETED TODAY":"TODAY’S CHALLENGE"} /></section>

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
  usePageMeta({title:"25 Free Brain & Family Games — MegaMasti",description:"Browse 25 complete strategy, logic, knowledge, creativity and social games. Play immediately with no compulsory account.",path:"/games",structuredData:librarySchema});
  const [params] = useSearchParams();
  const requestedCategory = params.get("category");
  const [category,setCategory] = useState(gameCategories.includes(requestedCategory) ? requestedCategory : "All games");
  const [query,setQuery] = useState("");
  const {progress} = useProgress();
  const filtered = useMemo(() => playableGames.filter(game => (category === "All games" || game.category === category) && (game.title + game.description + game.skills.join(" ")).toLowerCase().includes(query.toLowerCase())),[category,query]);
  const favorites = progress.favorites.map(id => playableGames.find(game => game.id === id)).filter(Boolean);

  return <main id="main-content" tabIndex="-1" className="catalogue-page">
    <section className="catalogue-head"><span>PLAYABLE NOW</span><h1>Choose a challenge.<br /><em>Build a skill.</em></h1><p>Only complete, functional experiences appear here. More games will join the library after passing gameplay and quality review.</p></section>
    {favorites.length > 0 && <section className="favorites-strip" id="favorites"><span>YOUR FAVORITES</span><div>{favorites.map(game => <Link key={game.id} to={"/play/" + game.id}>{game.title}<ChevronRight /></Link>)}</div></section>}
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
  const gameSchema = useMemo(() => game ? {"@context":"https://schema.org","@type":"VideoGame",name:game.title,url:"https://megamasti.com/play/"+game.id,description:game.description,applicationCategory:"Browser game",gamePlatform:"Web browser",playMode:game.players.includes("Solo")?"SinglePlayer":"MultiPlayer",isAccessibleForFree:true,inLanguage:"en",audience:{"@type":"PeopleAudience",suggestedMinAge:parseInt(game.ages,10)}} : null,[game]);
  usePageMeta({title:game ? game.title + " — Play Free | MegaMasti" : "Game unavailable — MegaMasti",description:game ? "Play "+game.title+" free on MegaMasti. "+game.goal : "This MegaMasti game is not available.",path:game ? "/play/" + game.id : "/404",robots:game?"index, follow":"noindex, nofollow",structuredData:gameSchema});
  if (!game) return <NotFound title="This game is not ready to play." />;
  return <Suspense fallback={<main id="main-content" tabIndex="-1" className="loading-state" role="status"><div /><span>Preparing {game.title}…</span></main>}><GameEngine game={game} /></Suspense>;
}

function NotFound({title="That page wandered off the board."}) {
  const location = useLocation();
  usePageMeta({title:"Page not found — MegaMasti",description:"Return to the MegaMasti game library.",path:location.pathname,robots:"noindex, nofollow"});
  return <main id="main-content" tabIndex="-1" className="not-found-page"><span>404</span><h1>{title}</h1><p>Nothing is broken. This address simply does not lead to a playable experience.</p><Link to="/games">Browse playable games <ArrowRight /></Link></main>;
}

function Footer() {
 return <footer className="site-footer"><Logo /><p>Intelligent entertainment for every generation.</p><div><Link to="/games">Games</Link><Link to="/#how">How it works</Link><a href="mailto:hello@megamasti.com">Contact</a></div><small>© 2026 MegaMasti. Play thoughtfully.</small></footer>;
}

function RouteEffects() {
  const location = useLocation();
  const firstRender = useRef(true);
  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
      return;
    }
    window.scrollTo({top:0,left:0,behavior:"auto"});
    if (firstRender.current) { firstRender.current = false; return; }
    requestAnimationFrame(() => document.getElementById("main-content")?.focus({preventScroll:true}));
  },[location.pathname,location.hash]);
  return null;
}

function AccessibilityDialog({ open, onClose, preferences, setPreference }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = event => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const items = dialogRef.current?.querySelectorAll("button, input");
        if (!items?.length) return;
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown",onKeyDown);
    return () => {
      document.removeEventListener("keydown",onKeyDown);
      document.body.style.overflow = previousOverflow;
      previous?.focus?.();
    };
  },[open,onClose]);
  if (!open) return null;
  return <div className="drawer-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}><section ref={dialogRef} className="access-drawer" role="dialog" aria-modal="true" aria-labelledby="access-title">
    <button ref={closeRef} type="button" onClick={onClose} aria-label="Close accessibility settings"><X /></button><span>ACCESSIBILITY</span><h2 id="access-title">Make MegaMasti yours.</h2>
    <label><input type="checkbox" checked={preferences.largeText} onChange={event => setPreference("largeText",event.target.checked)} /> Larger text</label>
    <label><input type="checkbox" checked={preferences.highContrast} onChange={event => setPreference("highContrast",event.target.checked)} /> Higher contrast</label>
    <label><input type="checkbox" checked={preferences.reducedMotion} onChange={event => setPreference("reducedMotion",event.target.checked)} /> Reduced motion</label>
    <label><input type="checkbox" checked={preferences.sound} onChange={event => setPreference("sound",event.target.checked)} /> Sound when available</label>
  </section></div>;
}

function Layout() {
  const [accessOpen,setAccessOpen] = useState(false);
  const closeAccessibility = useCallback(() => setAccessOpen(false),[]);
  const {progress,setPreference} = useProgress();
  const preferences = progress.preferences;
  useEffect(() => {
    document.body.classList.toggle("large-text",preferences.largeText);
    document.body.classList.toggle("high-contrast",preferences.highContrast);
    document.body.classList.toggle("reduced-motion",preferences.reducedMotion);
  },[preferences]);
  return <div className="site-shell"><a className="skip-link" href="#main-content">Skip to main content</a><Header onAccessibility={() => setAccessOpen(true)} /><Outlet /><Footer />
    <AccessibilityDialog open={accessOpen} onClose={closeAccessibility} preferences={preferences} setPreference={setPreference} />
  </div>;
}

export default function App() {
 return <BrowserRouter><RouteEffects /><Routes><Route element={<Layout />}><Route index element={<Home />} /><Route path="/games" element={<Catalogue />} /></Route><Route path="/play/:gameId" element={<PlayPage />} /><Route path="*" element={<NotFound />} /></Routes></BrowserRouter>;
}
