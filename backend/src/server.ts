import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import config from './config';

dotenv.config();

const server = createServer(app);

const io = new Server(server);
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = config.port || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});