import { useState } from "react";
import { Brain, Check, ChevronRight, Lightbulb } from "lucide-react";
import { quizBanks } from "../data/content";
import { Completion, GameFrame, shuffle } from "./Common";

export default function KnowledgeGame({ game, bankKey }) {
  const bank = quizBanks[bankKey] || quizBanks.quizGeneral;
  const [questions, setQuestions] = useState(() => shuffle(bank));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const question = questions[index];

  const reset = () => {
    setQuestions(shuffle(bank));
    setIndex(0);
    setSelected(null);
    setScore(0);
  };

  if (index >= questions.length) {
    return <GameFrame game={game} score={score} onReset={reset}>
      <Completion title="Knowledge expanded." text="Every explanation you read strengthens the next attempt." xp={score} onAgain={reset} />
    </GameFrame>;
  }

  const answer = option => {
    if (selected !== null) return;
    setSelected(option);
    if (option === question.answer) setScore(value => value + 40);
  };

  return <GameFrame game={game} score={score} step={(index + 1) + " / " + questions.length} onReset={reset}>
    <section className="challenge-card">
      <div className="challenge-kicker"><Brain size={16} /> Adaptive knowledge round</div>
      <div className="progress"><i style={{ width: (index / questions.length * 100) + "%" }} /></div>
      <h1>{question.q}</h1>
      <div className="answer-grid">
        {question.options.map((option, optionIndex) =>
          <button key={option} onClick={() => answer(optionIndex)} className={selected === null ? "" : optionIndex === question.answer ? "correct" : optionIndex === selected ? "wrong" : "dim"}>
            <span>{String.fromCharCode(65 + optionIndex)}</span>{option}
            {selected !== null && optionIndex === question.answer && <Check />}
          </button>
        )}
      </div>
      {selected !== null && <div className="explanation">
        <Lightbulb /><p><strong>{selected === question.answer ? "Exactly right." : "Not quite—here’s the connection."}</strong>{question.why}</p>
        <button onClick={() => { setIndex(value => value + 1); setSelected(null); }}>Continue <ChevronRight /></button>
      </div>}
    </section>
  </GameFrame>;
}
