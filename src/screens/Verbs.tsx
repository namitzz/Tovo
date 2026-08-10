import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { speak } from '../utils/tts';
import { useApp } from '../store/app';
import { useQuizSession } from '../features/quiz/useQuizSession';
import QuizShell from '../features/quiz/QuizShell';
import SessionResults from '../features/quiz/SessionResults';
import MagneticButton from '../motion/MagneticButton';
import Pressable from '../motion/Pressable';
import { spring } from '../motion/springs';
import { VERBS, PRONOUNS, checkConjugation, type Verb, type Person } from '../content/verbs';

const COUNTS = [10, 15, 20];
type Filter = 'all' | 'irregular';
interface Q {
  verb: Verb;
  person: Person;
}

function buildQuestions(filter: Filter, count: number): Q[] {
  const pool = filter === 'irregular' ? VERBS.filter((v) => v.irregular) : VERBS;
  const qs: Q[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (qs.length < count && guard++ < count * 20) {
    const verb = pool[Math.floor(Math.random() * pool.length)];
    const person = Math.floor(Math.random() * 6) as Person;
    const key = `${verb.infinitive}-${person}`;
    if (seen.has(key)) continue;
    seen.add(key);
    qs.push({ verb, person });
  }
  return qs;
}

export default function Verbs() {
  const navigate = useNavigate();
  const ttsEnabled = useApp((s) => s.settings.ttsEnabled);
  const clearMistake = useApp((s) => s.clearMistake);

  const [phase, setPhase] = useState<'setup' | 'playing'>('setup');
  const [filter, setFilter] = useState<Filter>('all');
  const [count, setCount] = useState(10);
  const [items, setItems] = useState<Q[]>([]);
  const [value, setValue] = useState('');
  const [result, setResult] = useState<null | boolean>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const session = useQuizSession(items.length);
  const current = items[session.index];
  const expected = current ? current.verb.present[current.person] : '';

  const start = () => {
    setItems(buildQuestions(filter, count));
    session.reset();
    setResult(null);
    setValue('');
    setPhase('playing');
  };

  useEffect(() => {
    if (phase !== 'playing' || !current) return;
    setValue('');
    setResult(null);
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.index, phase]);

  const submit = () => {
    if (result !== null || !value.trim() || !current) return;
    const correct = checkConjugation(value, expected);
    setResult(correct);
    const id = `verb-${current.verb.infinitive}`;
    session.submit(correct, {
      id,
      de: `${PRONOUNS[current.person]} ${expected}`,
      en: `${current.verb.en} (${PRONOUNS[current.person]})`,
    });
    if (correct) clearMistake(id);
    if (ttsEnabled) setTimeout(() => speak(expected, 'de-DE'), 200);
    setTimeout(() => session.advance(), 1600);
  };

  if (phase === 'setup') {
    return (
      <div className="min-h-[80vh]">
        <h1 className="display mb-1 text-[30px]">Verb Gym</h1>
        <p className="text-muted mb-8">Conjugate German verbs in the present tense.</p>
        <div className="mb-7">
          <p className="eyebrow text-faint mb-3">focus</p>
          <div className="flex gap-2">
            {(['all', 'irregular'] as Filter[]).map((f) => (
              <Pressable
                key={f}
                onClick={() => setFilter(f)}
                className="flex-1 rounded-xl py-3 text-sm font-semibold capitalize"
                style={
                  filter === f
                    ? { background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent)' }
                    : { background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--line)' }
                }
              >
                {f === 'all' ? 'All verbs' : 'Irregular only'}
              </Pressable>
            ))}
          </div>
        </div>
        <div className="mb-10">
          <p className="eyebrow text-faint mb-3">questions</p>
          <div className="flex gap-2">
            {COUNTS.map((c) => (
              <Pressable
                key={c}
                onClick={() => setCount(c)}
                className="mono flex-1 rounded-xl py-3 font-semibold"
                style={
                  count === c
                    ? { background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent)' }
                    : { background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--line)' }
                }
              >
                {c}
              </Pressable>
            ))}
          </div>
        </div>
        <MagneticButton
          onClick={start}
          className="w-full rounded-2xl bg-accent py-4 font-semibold text-accent-ink"
        >
          Start
        </MagneticButton>
      </div>
    );
  }

  if (session.finished) {
    return (
      <SessionResults
        correct={session.tally.correct}
        total={session.tally.total}
        xp={session.tally.xp}
        onRetry={() => setPhase('setup')}
        onExit={() => navigate('/practice')}
      />
    );
  }

  if (!current) return <div className="text-muted py-24 text-center">Loading…</div>;

  const border = result === null ? 'var(--line-strong)' : result ? 'var(--good)' : 'var(--bad)';

  return (
    <QuizShell index={session.index} total={items.length} onClose={() => navigate('/practice')}>
      <motion.div key={session.index} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={spring.snappy}>
        <div className="card mb-6 px-6 py-9 text-center">
          <p className="eyebrow text-faint mb-3">conjugate</p>
          <h2 lang="de" className="display text-[30px]">
            {current.verb.infinitive}
          </h2>
          <p className="text-muted mt-1 text-sm">{current.verb.en}</p>
          <div className="mono mt-5 inline-block rounded-xl px-4 py-2 text-lg" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            {PRONOUNS[current.person]} …
          </div>
        </div>

        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          disabled={result !== null}
          placeholder="conjugated form…"
          lang="de"
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Conjugated verb form"
          className="glass w-full rounded-2xl px-5 py-4 text-center text-lg outline-none placeholder:text-faint"
          style={{ borderColor: border, borderWidth: 1 }}
        />

        {result === null ? (
          <MagneticButton
            onClick={submit}
            disabled={!value.trim()}
            className="mt-4 w-full rounded-2xl bg-accent py-4 font-semibold text-accent-ink"
          >
            Check
          </MagneticButton>
        ) : (
          <div
            className="mt-4 flex items-center justify-center gap-2 rounded-2xl py-4 font-semibold"
            style={{ background: result ? 'var(--good-soft)' : 'var(--bad-soft)', color: result ? 'var(--good)' : 'var(--bad)' }}
          >
            {result ? <Check size={18} /> : <X size={18} />}
            {result ? 'Correct' : `${PRONOUNS[current.person]} ${expected}`}
          </div>
        )}
      </motion.div>
    </QuizShell>
  );
}
