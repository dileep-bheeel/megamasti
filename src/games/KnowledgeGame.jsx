import { useState } from "react";
import { Brain, Check, ChevronRight, Flame, Lightbulb } from "lucide-react";
import { quizBanks } from "../data/content";
import { Completion, GameFrame, shuffle } from "./Common";

const SESSION_LENGTH = 6;

export default function KnowledgeGame({ game, bankKey }) {
  const bank = quizBanks[bankKey] || quizBanks.quizGeneral;
  const makeSession = () => shuffle(bank).slice(0,Math.min(SESSION_LENGTH,bank.length));
  const [questions,setQuestions] = useState(makeSession);
  const [index,setIndex] = useState(0);
  const [selected,setSelected] = useState(null);
  const [score,setScore] = useState(0);
  const [correct,setCorrect] = useState(0);
  const [streak,setStreak] = useState(0);
  const question = questions[index];

  const reset = () => {
    setQuestions(makeSession());
    setIndex(0);setSelected(null);setScore(0);setCorrect(0);setStreak(0);
  };

  if (index >= questions.length) {
    const accuracy = Math.round(correct / questions.length * 100);
    return <GameFrame game={game} score={score} onReset={reset}>
      <Completion title={accuracy === 100 ? "Perfect expedition." : accuracy >= 67 ? "Knowledge expanded." : "Curiosity wins."} text={accuracy >= 67 ? "Strong reasoning. Read the explanations again to make the ideas easier to recall next time." : "The explanations are part of the game. Replay to turn unfamiliar ideas into useful knowledge."} xp={score} detail={{value:accuracy+"%",label:"accuracy"}} onAgain={reset} />
    </GameFrame>;
  }

  const answer = option => {
    if (selected !== null) return;
    setSelected(option);
    if (option === question.answer) {
      const nextStreak=streak+1;
      setCorrect(value=>value+1);setStreak(nextStreak);setScore(value=>value+30+Math.min(30,nextStreak*5));
    } else setStreak(0);
  };
  const next=()=>{setIndex(value=>value+1);setSelected(null);};

  return <GameFrame game={game} score={score} step={(index + 1) + " / " + questions.length} onReset={reset}>
    <section className="challenge-card knowledge-round" tabIndex="-1" onKeyDown={event=>{
      if(selected===null&&["1","2","3","4"].includes(event.key))answer(Number(event.key)-1);
      if(selected!==null&&event.key==="Enter")next();
    }}>
      <div className="challenge-kicker"><Brain size={16} /> Knowledge expedition <span className={streak>1?"streak active":"streak"}><Flame/> {streak} streak</span></div>
      <div className="progress"><i style={{ width: (index / questions.length * 100) + "%" }} /></div>
      <h1>{question.q}</h1>
      <div className="answer-grid">
        {question.options.map((option,optionIndex)=>
          <button key={option} onClick={()=>answer(optionIndex)} disabled={selected!==null} className={selected===null?"":optionIndex===question.answer?"correct":optionIndex===selected?"wrong":"dim"}>
            <span>{String.fromCharCode(65+optionIndex)}</span>{option}
            {selected!==null&&optionIndex===question.answer&&<Check/>}
          </button>
        )}
      </div>
      {selected!==null&&<div className="explanation" aria-live="polite">
        <Lightbulb/><p><strong>{selected===question.answer?(streak>=3?"Excellent—your streak is building.":"Exactly right."):"Not quite—here’s the connection."}</strong>{question.why}</p>
        <button onClick={next}>Continue <ChevronRight/></button>
      </div>}
      <small className="keyboard-hint">Keyboard: 1–4 to answer • Enter to continue</small>
    </section>
  </GameFrame>;
}
