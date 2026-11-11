"use client";
import { useEffect, useRef, useState } from "react";
import { lessonQuiz, quizPassed } from "@/lib/lesson-quiz";
import { useMvp } from "./mvp-provider";
import { ChoiceQuestion } from "./lesson-interaction";
type QuizProps = { id?: string; onFinish: () => void; onMiss: () => void };
export function OwnershipQuiz(props:QuizProps) {
 const {learning,account}=useMvp();
 return <QuizSession key={`${props.id ?? "what-you-own"}:${account.account?.userId ?? "guest"}:${learning.resetGeneration}`} {...props}/>;
}
function QuizSession({ id = "what-you-own", onFinish, onMiss }:QuizProps) {
 const { learning, updateLearning } = useMvp();
 const questions = lessonQuiz(id);
 const passed = learning.quizzes[id]?.passed ?? 0;
 const [requestedPosition, setPosition] = useState(passed);
 const position = Math.min(requestedPosition,passed);
 const generation = learning.resetGeneration;
 const heading = useRef<HTMLHeadingElement>(null);
 useEffect(() => { heading.current?.focus(); }, [position]);
 const done = quizPassed(position);
 const question = questions[position];
 return <div className="lesson-quiz-panel">
 <p className="eyebrow">Check your understanding</p>
 <h2 ref={heading} tabIndex={-1}>{done ? "Three ideas, checked." : `Question ${position + 1} of 3`}</h2>
 <progress className="lesson-progress" max={3} value={passed} aria-label="Quiz progress" />
 {question && <ChoiceQuestion key={question.id} {...question} onMiss={onMiss} onReady={() => updateLearning(state => {
  if(state.resetGeneration !== generation || (state.quizzes[id]?.passed ?? 0) !== position) return state;
  return {...state,quizzes:{...state.quizzes,[id]:{version:1,passed:position+1}}};
 })} />}
 {passed > position && <button className="button lime player-continue" onClick={() => setPosition(passed)}>Continue</button>}
 {done && <><p role="status">All three answers checked correctly.</p><p className="lesson-step-hint">Finish to save your completion, keep the takeaway and place your cornerstone.</p><button className="button lime player-continue" onClick={onFinish}>Finish lesson</button></>}
 </div>;
}
