import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid';

interface Guest {
  id: string;
  name: string;
}

interface PomodoroSession {
  sessionId: string;
  timeLeft: number;
  phase: 'work' | 'shortBreak' | 'longBreak';
  isRunning: boolean;
  guests: Guest[];
  stoody: number;
  shortBreak: number;
  longBreak: number;
}

const sessions = new Map<string, PomodoroSession>();

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  let guestId = uuid();
  let sessionId: string | null = null;

  ws.on('message', (message) => {
    const msg = JSON.parse(message.toString());
    
    if (msg.type === 'createSession') {
      sessionId = uuid();
      const session: PomodoroSession = {
        sessionId,
        timeLeft: msg.stoody * 60,
        phase: 'work',
        isRunning: false,
        guests: [{ id: guestId, name: msg.name }],
        stoody: msg.stoody,
        shortBreak: msg.shortBreak,
        longBreak: msg.longBreak,
      };
      sessions.set(sessionId, session);
      ws.send(JSON.stringify({ type: 'sessionCreated', sessionId }));
    }
  });
});

console.log('WebSocket server running on ws://localhost:8080');
