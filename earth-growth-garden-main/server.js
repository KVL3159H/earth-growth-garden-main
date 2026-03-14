import express from 'express';
import http from 'http';
import os from 'os';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Helper function to get the local LAN IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip over internal (i.e. 127.0.0.1) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1'; // Fallback
}

// Endpoint to provide server info to the frontend
app.get('/api/server-info', (req, res) => {
  res.json({
    ip: getLocalIpAddress()
  });
});

let globalState = {
  contributions: 0,
  participants: 0,
};

// Reset state when server restarted, or we could persist to a file. 
// For this event, memory state is fine.

io.on('connection', (socket) => {
  const clientIp = socket.handshake.address;
  console.log(`[${new Date().toISOString()}] New client connected: ${socket.id} from ${clientIp}`);

  // Send current state to new client
  socket.emit('state-update', globalState);

  socket.on('contribute', () => {
    globalState.contributions++;
    
    // Naively increment participants if it's the first time 
    // or simulate multiple by random chance as in original code
    // For a real app, you'd track unique socket IDs for participants
    globalState.participants = io.engine.clientsCount; 
    
    // Log the contribution with timestamp and IP
    const targetIp = socket.handshake.address;
    console.log(`[${new Date().toISOString()}] Contribution received from IP: ${targetIp}. Total contributions: ${globalState.contributions}`);

    // Broadcast updated state to ALL connected clients
    io.emit('state-update', globalState);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    globalState.participants = io.engine.clientsCount;
    io.emit('state-update', globalState);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Socket.IO Server listening on port ${PORT}`);
});
