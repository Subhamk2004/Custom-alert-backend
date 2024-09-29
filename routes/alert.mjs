import express from 'express';
import Subscriber from '../schema/subscriber.mjs';
import nodemailer from 'nodemailer';

const router = express.Router();

// Create a transporter using Gmail's SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'subhamrahar22@gmail.com', // Replace with your Gmail address
    pass: `xmck fljd yxxk qzax` // Replace with your app password
  }
});

router.post('/', async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    const message = 'You have subscribed for the emails';

    // Send emails to all subscribers
    for (const subscriber of subscribers) {
      const info = await transporter.sendMail({
        from: '"Mern Alert" <subhamrahar22@gmail.com>', // Replace with your app name and Gmail address
        to: subscriber.email,
        subject: 'Subscription Confirmation',
        text: message
      });

      console.log('Message sent: %s', info.messageId);
    }

    console.log('Confirmation sent to:', subscribers.map(s => s.email));
    res.status(200).json({ message: 'Confirmation sent successfully', count: subscribers.length });
  } catch (error) {
    console.error('Error sending confirmations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;