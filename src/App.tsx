import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './motion/PageTransition';
import TabBar from './ui/TabBar';
import BrandHeader from './ui/BrandHeader';
import { primeSpeech } from './utils/tts';
import {
  scheduleWhileOpen,
  scheduleTrigger,
  showReminder,
  notificationPermission,
  passedToday,
} from './utils/notifications';
import { useApp, getTodayKey } from './store/app';

// Screens are code-split: each route loads its own chunk on demand, keeping the
// initial bundle small so the app opens fast.
const Today = lazy(() => import('./screens/Today'));
const Practice = lazy(() => import('./screens/Practice'));
const Library = lazy(() => import('./screens/Library'));
const You = lazy(() => import('./screens/You'));
const Onboarding = lazy(() => import('./screens/Onboarding'));
const Session = lazy(() => import('./screens/Session'));
const Results = lazy(() => import('./screens/Results'));
const Quiz = lazy(() => import('./screens/Quiz'));
const TypeQuiz = lazy(() => import('./screens/TypeQuiz'));
const Fluency = lazy(() => import('./screens/Fluency'));
const Sentence = lazy(() => import('./screens/Sentence'));
const WeakSpots = lazy(() => import('./screens/WeakSpots'));
const Speak = lazy(() => import('./screens/Speak'));
const Reflex = lazy(() => import('./screens/Reflex'));
const Puzzle = lazy(() => import('./screens/Puzzle'));
const Privacy = lazy(() => import('./screens/Privacy'));
const Account = lazy(() => import('./screens/Account'));
const Verbs = lazy(() => import('./screens/Verbs'));
const Cases = lazy(() => import('./screens/Cases'));
const Stories = lazy(() => import('./screens/Stories'));

import { trackPageview } from './utils/analytics';
import { syncConfigured } from './lib/syncConfig';

const wrap = (node: React.ReactNode) => <PageTransition>{node}</PageTransition>;

/** Minimal placeholder shown while a route chunk loads. */
function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" aria-busy="true">
      <div
        className="h-7 w-7 animate-spin rounded-full border-2 border-transparent"
        style={{ borderTopColor: 'var(--accent)', borderRightColor: 'var(--accent)' }}
      />
    </div>
  );
}

function Shell() {
  const location = useLocation();
  const onboarded = useApp((s) => s.onboarded);
  const fullscreen = ['/onboarding', '/session', '/results'].some((p) =>
    location.pathname.startsWith(p),
  );

  // Count an (anonymous) pageview on each route change; no-op unless analytics
  // is configured.
  useEffect(() => {
    trackPageview();
  }, [location.pathname]);

  if (!onboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="aurora relative mx-auto min-h-screen w-full max-w-app">
      <div className="relative z-10 px-5 pt-[max(18px,env(safe-area-inset-top))] pb-32">
        {!fullscreen && <BrandHeader />}
        <Suspense fallback={<RouteFallback />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
            <Route path="/" element={wrap(<Today />)} />
            <Route path="/practice" element={wrap(<Practice />)} />
            <Route path="/library" element={wrap(<Library />)} />
            <Route path="/you" element={wrap(<You />)} />
            <Route path="/onboarding" element={wrap(<Onboarding />)} />
            <Route path="/session" element={wrap(<Session mode="daily" />)} />
            <Route path="/review" element={wrap(<Session mode="review" />)} />
            <Route path="/results" element={wrap(<Results />)} />
            <Route path="/quiz/mcq" element={wrap(<Quiz mode="mcq" title="Multiple choice" />)} />
            <Route path="/quiz/grammar" element={wrap(<Quiz mode="grammar" title="Grammar Gym" />)} />
            <Route path="/quiz/cloze" element={wrap(<Quiz mode="cloze" title="Cloze" />)} />
            <Route path="/quiz/hard" element={wrap(<Quiz mode="hard" title="Hard MCQ" />)} />
            <Route path="/quiz/classes" element={wrap(<Quiz mode="classes" title="Classes" />)} />
            <Route path="/quiz/type" element={wrap(<TypeQuiz />)} />
            <Route path="/fluency" element={wrap(<Fluency />)} />
            <Route path="/sentence" element={wrap(<Sentence />)} />
            <Route path="/weak" element={wrap(<WeakSpots />)} />
            <Route path="/speak" element={wrap(<Speak />)} />
            <Route path="/reflex" element={wrap(<Reflex />)} />
            <Route path="/verbs" element={wrap(<Verbs />)} />
            <Route path="/cases" element={wrap(<Cases />)} />
            <Route path="/stories" element={wrap(<Stories />)} />
            <Route path="/puzzle" element={wrap(<Puzzle />)} />
            <Route path="/privacy" element={wrap(<Privacy />)} />
            <Route path="/account" element={wrap(<Account />)} />
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </div>
      {!fullscreen && <TabBar />}
    </div>
  );
}

export default function App() {
  const theme = useApp((s) => s.settings.theme);
  const reminderEnabled = useApp((s) => s.settings.reminderEnabled);
  const reminderTime = useApp((s) => s.settings.reminderTime);
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f7f4f1' : '#0c0a10');
  }, [theme]);

  // Daily reminder: fire while open, catch up on open, and (where supported)
  // schedule an OS-level trigger that can fire when the app is closed.
  useEffect(() => {
    const fire = () => {
      const st = useApp.getState();
      if (st.lastReminded === getTodayKey()) return;
      showReminder(st.progress.streak);
      st.markReminded();
    };

    scheduleWhileOpen(reminderTime, reminderEnabled, fire);

    if (reminderEnabled && notificationPermission() === 'granted') {
      const st = useApp.getState();
      // Catch-up: past the time today, goal not met, and not already reminded.
      const goalMet = st.progress.lastReviewDate === getTodayKey();
      if (passedToday(reminderTime) && !goalMet && st.lastReminded !== getTodayKey()) {
        fire();
      }
      scheduleTrigger(reminderTime, st.progress.streak);
    }

    return () => scheduleWhileOpen('', false, () => {});
  }, [reminderEnabled, reminderTime]);

  // Cloud sync (optional): when signed in, reconcile once then auto-push local
  // changes. Loaded lazily and only when Supabase is configured, so the client
  // library never enters the initial bundle otherwise.
  useEffect(() => {
    if (!syncConfigured()) return;
    let cleanup: (() => void) | undefined;
    void Promise.all([import('./lib/supabase'), import('./lib/sync')]).then(
      ([{ supabase }, { syncNow, startAutoSync, stopAutoSync }]) => {
        if (!supabase) return;
        let activeUser: string | null = null;
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          const uid = session?.user.id ?? null;
          if (uid === activeUser) return;
          activeUser = uid;
          if (uid) {
            void syncNow(uid).then(() => startAutoSync(uid));
          } else {
            stopAutoSync();
          }
        });
        cleanup = () => {
          data.subscription.unsubscribe();
          stopAutoSync();
        };
      },
    );
    return () => cleanup?.();
  }, []);

  // Unlock speech synthesis on the first user gesture (needed by iOS/Safari).
  useEffect(() => {
    const prime = () => primeSpeech();
    window.addEventListener('pointerdown', prime, { once: true });
    window.addEventListener('keydown', prime, { once: true });
    return () => {
      window.removeEventListener('pointerdown', prime);
      window.removeEventListener('keydown', prime);
    };
  }, []);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Shell />
    </BrowserRouter>
  );
}
