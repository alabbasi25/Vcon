import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { Server } from 'socket.io';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Mock database state (In-memory for demo)
  let appState: any = {
    lastUpdate: Date.now(),
    message: "Welcome to Kokab Backend",
    tasbeeh: { F: 0, B: 0 },
    users: {
      F: { status: 'offline', lastActive: Date.now() },
      B: { status: 'offline', lastActive: Date.now() }
    }
  };

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('user:online', (userId) => {
      if (appState.users[userId]) {
        appState.users[userId].status = 'online';
        appState.users[userId].lastActive = Date.now();
        io.emit('user:status_update', appState.users);
      }
    });

    socket.on('tasbeeh:sync', (data) => {
      appState.tasbeeh = { ...appState.tasbeeh, ...data };
      io.emit('tasbeeh:updated', appState.tasbeeh);
    });

    socket.on('sync:action', (data) => {
      // Generic sync action (haptic feedback, pulses)
      socket.broadcast.emit('sync:event', data);
    });

    socket.on('nudge:send', (data) => {
      // Direct notification/nudge to the other user
      socket.broadcast.emit('nudge:received', data);
    });

    socket.on('chat:message', (msg) => {
      socket.broadcast.emit('chat:message', msg);
    });

    socket.on('chat:reaction', (data) => {
      socket.broadcast.emit('chat:reaction', data);
    });

    socket.on('chat:edit', (data) => {
      socket.broadcast.emit('chat:edit', data);
    });

    socket.on('chat:delete', (data) => {
      socket.broadcast.emit('chat:delete', data);
    });

    socket.on('chat:typing', (data) => {
      socket.broadcast.emit('chat:typing', data);
    });

    socket.on('chat:read', (data) => {
      socket.broadcast.emit('chat:read', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
      // Simple logic to find which user disconnected could be added with socket maps
    });
  });

  app.get('/api/state', (req, res) => {
    res.json(appState);
  });

  // OAuth & Fitness Routes
  const APP_URL = process.env.APP_URL || 'http://localhost:3000';

  app.get('/api/auth/google/url', (req, res) => {
    const params = new URLSearchParams({
      client_id: process.env.VITE_GOOGLE_CLIENT_ID || 'dummy_id',
      redirect_uri: `${APP_URL}/auth/callback`,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read',
      access_type: 'offline',
      prompt: 'consent'
    });
    res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params}` });
  });

  app.get('/auth/callback', (req, res) => {
    res.send(`
      <html>
        <body style="background: #09090b; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; direction: rtl;">
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <div style="text-align: center;">
            <p>تم الربط بنجاح! جاري العودة للكوكب...</p>
          </div>
        </body>
      </html>
    `);
  });

  app.get('/api/fitness/sync', (req, res) => {
    // Mocking real sync logic - returning fresh data
    const steps = 6000 + Math.floor(Math.random() * 4000);
    const calories = 300 + Math.floor(Math.random() * 400);
    res.json({ steps, calories });
  });

  app.post('/api/state', (req, res) => {
    appState = { ...appState, ...req.body, lastUpdate: Date.now() };
    res.json(appState);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
