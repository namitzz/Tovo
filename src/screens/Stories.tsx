import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Languages, X } from 'lucide-react';
import { speak } from '../utils/tts';
import { loadLexicon, tokenize, lookupWord, type LexEntry } from '../content/nlp';
import { STORIES, type Story } from '../content/stories';
import { Stagger, Item } from '../motion/Reveal';
import Pressable from '../motion/Pressable';
import { spring } from '../motion/springs';

const LEVEL_TINT: Record<string, string> = {
  A1: 'var(--good)',
  A2: 'var(--accent)',
  B1: 'var(--accent-2)',
};

interface Tapped {
  word: string;
  entry?: LexEntry;
}

function Reader({ story, onBack }: { story: Story; onBack: () => void }) {
  const [lexicon, setLexicon] = useState<Map<string, LexEntry> | null>(null);
  const [showEn, setShowEn] = useState(false);
  const [tapped, setTapped] = useState<Tapped | null>(null);

  useEffect(() => {
    loadLexicon().then(setLexicon);
  }, []);

  const onWord = (raw: string) => {
    const clean = raw.replace(/[^A-Za-zÀ-ÿäöüÄÖÜß-]/g, '');
    const entry = lexicon ? lookupWord(clean, lexicon).entry : undefined;
    setTapped({ word: clean, entry });
    speak(clean, 'de-DE');
  };

  return (
    <div className="min-h-[80vh] pb-24">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={onBack} aria-label="Back" className="text-faint">
          <ArrowLeft size={22} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[20px] font-semibold" lang="de">
            {story.title}
          </h1>
          <p className="text-faint truncate text-sm">{story.titleEn}</p>
        </div>
        <Pressable
          onClick={() => setShowEn((v) => !v)}
          aria-label="Toggle translation"
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium"
          style={
            showEn
              ? { background: 'var(--accent-soft)', color: 'var(--accent)' }
              : { background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--line)' }
          }
        >
          <Languages size={16} /> EN
        </Pressable>
      </div>

      <div className="space-y-5">
        {story.lines.map((line, i) => (
          <div key={i} className="card px-5 py-4">
            <div className="flex items-start gap-3">
              <p lang="de" className="flex-1 text-[18px] leading-relaxed">
                {tokenize(line.de).map((t, j) =>
                  t.isWord ? (
                    <button
                      key={j}
                      onClick={() => onWord(t.text)}
                      className="rounded transition-colors hover:text-accent"
                      style={{ background: 'none' }}
                    >
                      {t.text}
                    </button>
                  ) : (
                    <span key={j}>{t.text}</span>
                  ),
                )}
              </p>
              <button
                onClick={() => speak(line.de, 'de-DE')}
                aria-label="Play sentence"
                className="text-faint mt-1 shrink-0"
                style={{ color: 'var(--accent)' }}
              >
                <Volume2 size={18} />
              </button>
            </div>
            {showEn && <p className="text-muted mt-2 text-[15px]">{line.en}</p>}
          </div>
        ))}
      </div>

      <p className="text-faint mt-6 text-center text-[13px]">Tap any word to hear it and see its meaning.</p>

      <AnimatePresence>
        {tapped && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={spring.snappy}
            className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-app px-5 pb-[max(20px,env(safe-area-inset-bottom))]"
          >
            <div className="card flex items-center gap-3 px-5 py-4 shadow-soft">
              <button onClick={() => speak(tapped.word, 'de-DE')} aria-label="Hear it" style={{ color: 'var(--accent)' }}>
                <Volume2 size={20} />
              </button>
              <div className="min-w-0 flex-1">
                <p lang="de" className="font-semibold">
                  {tapped.word}
                </p>
                <p className="text-muted truncate text-sm">
                  {tapped.entry ? tapped.entry.en : 'no dictionary match'}
                </p>
              </div>
              <button onClick={() => setTapped(null)} aria-label="Close" className="text-faint">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Stories() {
  const navigate = useNavigate();
  const [active, setActive] = useState<Story | null>(null);

  if (active) return <Reader story={active} onBack={() => setActive(null)} />;

  return (
    <Stagger className="space-y-6">
      <Item>
        <h1 className="display text-[30px]">Stories</h1>
        <p className="text-muted mt-1">Short German texts — read, listen, and tap any word.</p>
      </Item>
      <Item>
        <div className="space-y-3">
          {STORIES.map((s) => (
            <Pressable
              key={s.id}
              onClick={() => {
                setActive(s);
                window.scrollTo(0, 0);
              }}
              className="card flex w-full items-center gap-4 px-5 py-4 text-left"
            >
              <span className="text-3xl">{s.emoji}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold" lang="de">
                  {s.title}
                </span>
                <span className="text-faint truncate text-sm">{s.titleEn}</span>
              </span>
              <span
                className="mono rounded-lg px-2 py-1 text-[11px] font-semibold"
                style={{ background: 'var(--surface)', color: LEVEL_TINT[s.level], border: `1px solid ${LEVEL_TINT[s.level]}` }}
              >
                {s.level}
              </span>
            </Pressable>
          ))}
        </div>
      </Item>
      <Item>
        <button onClick={() => navigate('/practice')} className="text-faint w-full py-2 text-center text-sm">
          Back to Practice
        </button>
      </Item>
    </Stagger>
  );
}
