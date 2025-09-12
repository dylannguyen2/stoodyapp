'use client';

import { useEffect, useState } from 'react';
import Timer from '../../_components/Timer';
import EditUI from '../../_components/inputs/EditUI';
import TaskListWrapper from '../../_components/TaskListWrapper';
import { useSearchParams, useParams } from 'next/navigation';
import Navbar from 'db/app/_components/Navbar';
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
  const searchParams = useSearchParams();
  const sessionId = params.sessionId;
  const guestNameFromUrl = searchParams.get('name') || 'Guest';

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`/api/${sessionId}/heartbeat`, { method: 'POST' });
    }, 30000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const [session, setSession] = useState<SessionData | null>(null);
  const [phase, setPhase] = useState<'stoody' | 'shortBreak' | 'longBreak' | 'transition'>('transition');
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/session/${sessionId}`);
        const data = await res.json();
        setSession(data);
      } catch (err) {
        console.error('Failed to load session', err);
        setSession({ error: 'Failed to load session' });
      }
    };
    fetchSession();
  }, [sessionId]);

  if (!session) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28 }}
          className="flex flex-col items-center gap-6"
        >
          {/* rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            className="w-24 h-24 rounded-full flex items-center justify-center"
          >
            <div className="w-20 h-20 rounded-full border-4 border-[#C18FFF] border-t-transparent" />
          </motion.div>

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
    <div className="w-full h-screen">
      {/* <div className="
        w-[50%] h-[7.5%]
        mx-auto
        pointer-events-none
        border border-[#E0E0E0] rounded-lg
        bg-[#FFFDF9]" /> */}
    
      <div className="flex flex-col items-center justify-center">
        {/* <Navbar /> */}
        
        {/* <TaskListWrapper /> */}
        {/*Notebook and Timer - centred vertically */}
        <div className="relative w-full flex justify-center">
          
          <div className="border border-[#E0E0E0] bg-[#FFFDF9] py-4 min-w-[480px] w-[50%] rounded-lg drop-shadow-md">
            <Timer
              stoody={session.stoody ?? 25}
              shortBreak={session.shortBreak ?? 5}
              longBreak={session.longBreak ?? 15}
              cycles={session.cycles ?? 4}
              onPhaseChange={(p) => setPhase(p)}
              editOpen={editOpen}
              onEditOpenChange={(v) => setEditOpen(v)}
              onSettingsSave={async (s) => {
                try {
                  const res = await fetch(`/api/session/${session.id}/settings`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(s),
                  });
                  if (!res.ok) throw new Error('Failed to save');
                  const updated = await res.json();
                  setSession((prev) => ({ ...(prev ?? {}), ...updated }));
                  setEditOpen(false);
                } catch (err) {
                  console.error('Failed to persist settings', err);
                }
              }}
            />
          </div>

          {/* EditUI Modal with Framer Motion */}
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
                      try {
                        const res = await fetch(`/api/session/${session.id}/settings`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(v),
                        });
                        if (!res.ok) throw new Error('Failed to save');
                        const updated = await res.json();
                        setSession((prev) => ({ ...(prev ?? {}), ...updated }));
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
    </div>
  );
};

export default SessionPage;
