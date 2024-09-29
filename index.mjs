import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import subscribeRouter from './routes/subscribe.mjs';
import alertRouter from './routes/alert.mjs';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://subhamrahar22:8E48nCsq5wJ1edvr@cluster0.ayixc.mongodb.net/?retryWrites=true&w=majority&appName=cluster0');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

connectDB();

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

const broadcast = (message) => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(message));
  });
};

app.use('/api/subscribe', subscribeRouter);
app.use('/api/alert', (req, res, next) => {
  req.broadcast = broadcast;
  next();
}, alertRouter);

app.use('/', (req, res) => {
  res.send('Server is running').status(200);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});