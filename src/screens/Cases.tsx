import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../store/app';
import { useQuizSession } from '../features/quiz/useQuizSession';
import QuizShell from '../features/quiz/QuizShell';
import SessionResults from '../features/quiz/SessionResults';
import { spring } from '../motion/springs';
import Pressable from '../motion/Pressable';
import {
  CASES,
  NOUNS,
  GENDER_LABEL,
  correctArticle,
  optionsFor,
  type ArticleType,
  type CaseIndex,
  type Gender,
} from '../content/declension';

const TOTAL = 12;
const DEF_GENDERS: Gender[] = ['masc', 'fem', 'neut', 'plural'];
const INDEF_GENDERS: Gender[] = ['masc', 'fem', 'neut'];
const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];

interface Q {
  type: ArticleType;
  gender: Gender;
  c: CaseIndex;
  noun: { de: string; en: string };
  answer: string;
}

function makeQuestion(): Q {
  const type: ArticleType = Math.random() < 0.6 ? 'definite' : 'indefinite';
  const gender = pick(type === 'definite' ? DEF_GENDERS : INDEF_GENDERS);
  const c = Math.floor(Math.random() * 4) as CaseIndex;
  return { type, gender, c, noun: pick(NOUNS[gender]), answer: correctArticle(type, gender, c) };
}

export default function Cases() {
  const navigate = useNavigate();
  const clearMistake = useApp((s) => s.clearMistake);
  const [round, setRound] = useState(0);
  // `round` is a seed: bumping it on retry regenerates a fresh question set.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const questions = useMemo(() => Array.from({ length: TOTAL }, makeQuestion), [round]);

  const session = useQuizSession(TOTAL);
  const q = questions[session.index];
  const [picked, setPicked] = useState<string | null>(null);

  const choose = (opt: string) => {
    if (picked || !q) return;
    setPicked(opt);
    const correct = opt === q.answer;
    const id = `case-${q.gender}-${CASES[q.c]}`;
    session.submit(correct, {
      id,
      de: `${q.answer} ${q.noun.de}`,
      en: `${q.noun.en} — ${CASES[q.c]}, ${GENDER_LABEL[q.gender]}`,
    });
    if (correct) clearMistake(id);
    setTimeout(() => {
      setPicked(null);
      session.advance();
    }, 1100);
  };

  if (session.finished) {
    return (
      <SessionResults
        correct={session.tally.correct}
        total={session.tally.total}
        xp={session.tally.xp}
        onRetry={() => {
          setRound((r) => r + 1);
          session.reset();
        }}
        onExit={() => navigate('/practice')}
      />
    );
  }

  if (!q) return <div className="text-muted py-24 text-center">Loading…</div>;

  return (
    <QuizShell index={session.index} total={TOTAL} onClose={() => navigate('/practice')}>
      <motion.div key={session.index} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={spring.snappy}>
        <div className="card mb-6 px-6 py-8 text-center">
          <p className="eyebrow text-faint mb-3">
            {CASES[q.c]} · {GENDER_LABEL[q.gender]} · {q.type}
          </p>
          <h2 lang="de" className="display text-[30px]">
            <span style={{ color: 'var(--accent)' }}>___</span> {q.noun.de}
          </h2>
          <p className="text-muted mt-1 text-sm">the {q.noun.en}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {optionsFor(q.type).map((opt) => {
            const isAnswer = opt === q.answer;
            const isPicked = opt === picked;
            let style: React.CSSProperties = {
              background: 'var(--surface)',
              color: 'var(--ink)',
              border: '1px solid var(--line)',
            };
            if (picked) {
              if (isAnswer) style = { background: 'var(--good-soft)', color: 'var(--good)', border: '1px solid var(--good)' };
              else if (isPicked) style = { background: 'var(--bad-soft)', color: 'var(--bad)', border: '1px solid var(--bad)' };
              else style = { ...style, opacity: 0.5 };
            }
            return (
              <Pressable
                key={opt}
                onClick={() => choose(opt)}
                disabled={!!picked}
                lang="de"
                className="mono rounded-2xl py-4 text-lg font-semibold"
                style={style}
              >
                {opt}
              </Pressable>
            );
          })}
        </div>
      </motion.div>
    </QuizShell>
  );
}
