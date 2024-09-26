import express from 'express';
import Subscriber from '../schema/subscriber.mjs';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    const message = 'New alert!'; // You can customize this message
    
    // Broadcast the alert to all connected clients
    req.broadcast({ type: 'alert', message });
    
    console.log('Alert sent to:', subscribers.map(s => s.email));
    res.status(200).json({ message: 'Alert sent successfully', count: subscribers.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;