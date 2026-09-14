import { useEffect, useMemo, useState } from "react";
import { Bell, Flame, Heart, Home, Menu, MessageCircle, MoreHorizontal, Plus, Search, Send, ShieldCheck, Sparkles, X } from "lucide-react";
import { categories, seedPosts } from "./data/seed";
import { isSupabaseReady, supabase } from "./lib/supabase";

const maxLength = 600;

function Brand() {
  return <a className="brand" href="/" aria-label="MegaMasti No Filter home"><span className="brand-mark">N<span>F</span></span><span className="brand-copy">NO FILTER<small>by MegaMasti</small></span></a>;
}

function Composer({ open, onClose, onPublish }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Life");
  const [agree, setAgree] = useState(false);
  const submit = (event) => {
    event.preventDefault();
    const clean = text.trim();
    if (clean.length < 10 || !agree) return;
    onPublish({ text: clean, category });
    setText(""); setAgree(false); onClose();
  };
  if (!open) return null;
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <section className="composer" role="dialog" aria-modal="true" aria-labelledby="composer-title">
      <button className="icon-button close" onClick={onClose} aria-label="Close"><X size={20}/></button>
      <div className="eyebrow"><Sparkles size={15}/> Anonymous by design</div>
      <h2 id="composer-title">Say what’s on your mind.</h2>
      <p>No names. No performance. Just be honest—and kind.</p>
      <form onSubmit={submit}>
        <textarea autoFocus value={text} maxLength={maxLength} onChange={(e)=>setText(e.target.value)} placeholder="Write your thought, question, or confession…" aria-label="Your anonymous post"/>
        <div className="composer-meta"><select value={category} onChange={(e)=>setCategory(e.target.value)} aria-label="Category">{categories.slice(2).map(c=><option key={c}>{c}</option>)}</select><span>{text.length}/{maxLength}</span></div>
        <label className="promise"><input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)}/><span>I’ll keep this respectful and protect people’s privacy.</span></label>
        <button className="primary wide" disabled={text.trim().length < 10 || !agree}><Send size={17}/> Post anonymously</button>
      </form>
    </section>
  </div>;
}

function PostCard({ post, onLike }) {
  const [liked, setLiked] = useState(false);
  const [replying, setReplying] = useState(false);
  const [reply, setReply] = useState("");
  const toggle = () => { setLiked(v=>!v); if(!liked) onLike(post.id); };
  return <article className="post-card">
    <div className="post-top">
      <div className="avatar">{post.category.slice(0,1)}</div>
      <div><strong>Someone, anonymously</strong><div className="post-meta">{post.time}<span>•</span>{post.category}</div></div>
      {post.hot && <span className="hot"><Flame size={13}/> Hot</span>}
      <button className="more" aria-label="Post options"><MoreHorizontal/></button>
    </div>
    <p className="post-text">{post.text}</p>
    <div className="mood">Feeling: <span>{post.mood || "Honest"}</span></div>
    <div className="post-actions">
      <button className={liked ? "liked" : ""} onClick={toggle}><Heart size={19} fill={liked ? "currentColor" : "none"}/>{post.hearts + (liked ? 1 : 0)}</button>
      <button onClick={()=>setReplying(v=>!v)}><MessageCircle size={19}/>{post.replies} replies</button>
      <button className="report">Report</button>
    </div>
    {replying && <form className="reply-box" onSubmit={e=>{e.preventDefault(); if(reply.trim()) {setReply("");setReplying(false);}}}><input value={reply} onChange={e=>setReply(e.target.value)} placeholder="Reply with care…" aria-label="Reply"/><button aria-label="Send reply"><Send size={17}/></button></form>}
  </article>;
}

export default function App() {
  const [active, setActive] = useState("For You");
  const [query, setQuery] = useState("");
  const [composer, setComposer] = useState(false);
  const [posts, setPosts] = useState(seedPosts);
  const [notice, setNotice] = useState("");
  useEffect(()=>{ if(!notice) return; const id=setTimeout(()=>setNotice(""),2600); return()=>clearTimeout(id); },[notice]);
  useEffect(()=>{
    if(!isSupabaseReady) return;
    supabase.from("posts").select("id,category,mood,content,hearts,reply_count,created_at").eq("status","published").order("created_at",{ascending:false}).limit(30)
      .then(({data})=>{if(data?.length)setPosts(data.map(p=>({...p,text:p.content,replies:p.reply_count,time:"Recently"})));});
  },[]);
  const visible = useMemo(()=>posts.filter(p=>(active==="For You"||active==="Trending"&&p.hot||p.category===active)&&p.text.toLowerCase().includes(query.toLowerCase())),[posts,active,query]);
  const publish = async (draft) => {
    const item={id:Date.now(),...draft,mood:"Honest",time:"Just now",hearts:0,replies:0,hot:false};
    if(isSupabaseReady){
      const {data,error}=await supabase.from("posts").insert({content:draft.text,category:draft.category,mood:"Honest"}).select().single();
      if(error){setNotice("Couldn’t publish. Please try again.");return;}
      item.id=data.id;
    }
    setPosts(p=>[item,...p]); setActive("For You"); setNotice("Your anonymous post is live.");
  };
  return <div className="app-shell">
    <header><Brand/><nav><a className="active" href="#feed"><Home size={18}/>Home</a><a href="#trending"><Flame size={18}/>Trending</a><a href="#safety"><ShieldCheck size={18}/>Safety</a></nav><div className="header-actions"><button className="icon-button" aria-label="Notifications"><Bell size={20}/></button><button className="primary" onClick={()=>setComposer(true)}><Plus size={18}/>Post anonymously</button><button className="icon-button menu" aria-label="Menu"><Menu/></button></div></header>
    <main>
      <aside className="left-panel">
        <div className="manifesto"><span>THE INTERNET,<br/>WITHOUT THE MASK.</span><p>A calm corner for honest South Asian conversations.</p></div>
        <div className="safety-note"><ShieldCheck/><div><strong>You’re protected</strong><p>We never display your identity. Be real, not reckless.</p></div></div>
        <footer>© 2026 MegaMasti<br/><a href="#rules">Community rules</a> · <a href="#privacy">Privacy</a></footer>
      </aside>
      <section className="feed" id="feed">
        <div className="hero">
          <div className="eyebrow"><span className="live-dot"/> People are talking now</div>
          <h1>What are you<br/><em>not</em> saying?</h1>
          <p>Ask the awkward question. Share the hidden thought. Hear what real people actually feel.</p>
          <button className="hero-button" onClick={()=>setComposer(true)}>Drop your filter <span>↗</span></button>
        </div>
        <div className="discovery">
          <div className="search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search honest conversations…"/></div>
          <div className="categories">{categories.map(c=><button key={c} className={active===c?"active":""} onClick={()=>setActive(c)}>{c}</button>)}</div>
        </div>
        <div className="feed-heading"><div><h2>{active}</h2><span>{visible.length} conversations</span></div><button>Fresh first⌄</button></div>
        <div className="posts">{visible.map(post=><PostCard key={post.id} post={post} onLike={()=>{}}/>)}{!visible.length&&<div className="empty">No conversations found. Start the first one.</div>}</div>
      </section>
      <aside className="right-panel">
        <section className="pulse"><div className="eyebrow"><span className="live-dot"/> Community pulse</div><div className="pulse-number">2,481</div><p>people speaking freely today</p><div className="bars">{[42,68,51,82,62,91,75,95,78,100].map((h,i)=><i key={i} style={{height:h+"%"}}/>)}</div></section>
        <section className="prompt-card"><span>QUESTION OF THE DAY</span><h3>What truth did you learn a little too late?</h3><button onClick={()=>setComposer(true)}>Answer anonymously</button></section>
        <section className="rules" id="safety"><h3><ShieldCheck size={18}/> Keep it human</h3><p>No hate. No harassment. No personal information. If someone may be in immediate danger, contact local emergency support.</p></section>
      </aside>
    </main>
    <button className="mobile-compose" onClick={()=>setComposer(true)}><Plus/>Post anonymously</button>
    <Composer open={composer} onClose={()=>setComposer(false)} onPublish={publish}/>
    {notice&&<div className="toast">{notice}</div>}
  </div>;
}