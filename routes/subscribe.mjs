import express from 'express';
import Subscriber from '../schema/subscriber.mjs';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = new Subscriber({ email });
    await subscriber.save();
    res.status(201).json({ message: 'Subscription successful' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;