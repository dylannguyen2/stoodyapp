'use client';

import { useEffect, useState, useRef } from 'react';
import Timer from '../../_components/Timer';
import EditUI from '../../_components/inputs/EditUI';
import TaskListWrapper from '../../_components/TaskListWrapper';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

interface SessionData {
  id?: string;
  guestName?: string;
  stoody?: number;
  shortBreak?: number;
  longBreak?: number;
  cycles?: number;
  error?: string;
}

const SessionPage = () => {
  const params = useParams();
  const rawSessionId = params.sessionId;
  const sessionId = Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId ?? '';

  useEffect(() => {
    if (!sessionId) return;
    const interval = setInterval(() => {
      void fetch(`/api/${sessionId}/heartbeat`, { method: 'POST' }).catch((error) =>
        console.error('Heartbeat failed', error),
      );
    }, 30000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const [session, setSession] = useState<SessionData | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [taskColWidth, setTaskColWidth] = useState<number>(() => {
    if (typeof window === 'undefined') return 280;
    return Math.min(360, Math.max(220, Math.round(window.innerWidth * 0.22)));
  });
  // hide task list on narrow viewports (< 1112px)
  const [isWide, setIsWide] = useState<boolean>(() => (typeof window !== 'undefined' ? window.innerWidth >= 1112 : true));

  useEffect(() => {
    const onResize = () => {
      const w = Math.min(360, Math.max(220, Math.round(window.innerWidth * 0.22)));
      setTaskColWidth(w);
      setIsWide(window.innerWidth >= 1112);
    };
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const taskScale = taskColWidth / 360;
  const taskListWidthProp = Math.max(40, Math.round(72 * taskScale));
  const taskListHeightProp = Math.max(48, Math.round(96 * taskScale));
  const pageInnerRef = useRef<HTMLDivElement | null>(null);
  const [pageScale, setPageScale] = useState<number>(1);

  useEffect(() => {
    const measure = () => {
      const el = pageInnerRef.current;
      if (!el) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const padding = 32; // allow some breathing room
      const maxW = Math.max(100, vw - padding);
      const maxH = Math.max(100, vh - padding);
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        setPageScale(1);
        return;
      }
      const scaleW = maxW / rect.width;
      const scaleH = maxH / rect.height;
      const scale = Math.min(1, scaleW, scaleH);
      setPageScale(scale);
    };

    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);
    if (pageInnerRef.current) ro.observe(pageInnerRef.current);
    window.addEventListener('resize', measure);
    // measure after paint
    requestAnimationFrame(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [isWide, taskColWidth, session]);

  useEffect(() => {
    if (!sessionId) return;
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/session/${sessionId}`);
        if (!res.ok) {
          throw new Error(`Failed to load session ${sessionId}`);
        }
        const data: unknown = await res.json();
        mergeSession(data);
      } catch (err) {
        console.error('Failed to load session', err);
        setSession({ error: 'Failed to load session' });
      }
    };
    void fetchSession();
  }, [sessionId]);

  const mergeSession = (payload: unknown) => {
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('Invalid session payload');
    }
    setSession((prev) => ({ ...(prev ?? {}), ...(payload as SessionData) }));
  };

  if (!session) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28 }}
          className="flex flex-col items-center gap-6"
        >

          {/* bouncing dots + message */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-end gap-2 h-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.12 }}
                  className="block w-2 h-2 rounded-full bg-[#6B7280]"
                />
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-[#6B7280] inter-regular"
            >
              Loading session…
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }
  if (session.error) return <p>Session not found.</p>;

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* <div className="
        w-[50%] h-[7.5%]
        mx-auto
        pointer-events-none
        border border-[#E0E0E0] rounded-lg
        bg-[#FFFDF9]" /> */}
      {/* <Navbar /> */}
      <div className="flex items-center justify-center min-h-screen">
        {/* page-inner is measured and scaled to fit; keep modals outside this block */}
        <div
          ref={pageInnerRef}
          className="w-full max-w-6xl flex items-center justify-center px-4"
          style={{
            transform: `scale(${pageScale})`,
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
        >
          {/* left: responsive task column (animated in/out) */}
          <AnimatePresence>
            {isWide && (
              <motion.div
                key="task-col"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18 }}
                className="flex-shrink-0 flex items-center justify-center"
                style={{ width: `${taskColWidth}px` }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <TaskListWrapper
                    width={taskListWidthProp}
                    height={taskListHeightProp}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* center: Timer (animated appear/disappear but remains perfectly centered) */}
          <motion.div
            key="timer"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="flex-shrink-0 mx-6 flex items-center justify-center"
          >
            <div className="border border-[#E0E0E0] bg-[#FFFDF9] py-[7.5%] w-full rounded-lg drop-shadow-md">
              <Timer
                stoody={session.stoody ?? 25}
                shortBreak={session.shortBreak ?? 5}
                longBreak={session.longBreak ?? 15}
                cycles={session.cycles ?? 4}
                onEditOpenChange={(v) => setEditOpen(v)}
              />
            </div>
          </motion.div>

          {/* right: invisible spacer matching left width so Timer stays centered (animated) */}
          <AnimatePresence>
            {isWide && (
              <motion.div
                key="spacer"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.18 }}
                aria-hidden
                className="flex-shrink-0"
                style={{ width: `${taskColWidth}px` }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* EditUI Modal with Framer Motion (unchanged) */}
        <AnimatePresence>
          {editOpen && (
            <motion.div
              className="fixed inset-0 z-60 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-[#FFFDF9]/5 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setEditOpen(false)}
              />

              {/* Modal */}
              <motion.div
                className="relative z-10"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <EditUI
                  initial={{
                    stoody: session.stoody ?? 25,
                    shortBreak: session.shortBreak ?? 5,
                    longBreak: session.longBreak ?? 15,
                    cycles: session.cycles ?? 4,
                  }}
                  onSave={async (v) => {
                    if (!session?.id) return;
                    try {
                      const res = await fetch(`/api/session/${session.id}/settings`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(v),
                      });
                      if (!res.ok) throw new Error('Failed to save');
                      const updated: unknown = await res.json();
                      mergeSession(updated);
                      setEditOpen(false);
                    } catch (err) {
                      console.error('Failed to persist settings', err);
                    }
                  }}
                  onCancel={() => setEditOpen(false)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SessionPage;
