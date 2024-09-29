import express from 'express';
import Subscriber from '../schema/subscriber.mjs';
import nodemailer from 'nodemailer';
import webpush from 'web-push';

const router = express.Router();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'subhamrahar22@gmail.com',
    pass: `xmck fljd yxxk qzax`
  }
});

// Configure web-push
const vapidKeys = webpush.generateVAPIDKeys();
webpush.setVapidDetails(
  'mailto:subhamrahar22@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

router.post('/', async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    const message = 'You have a new alert!';

    for (const subscriber of subscribers) {
      // Send email
      await transporter.sendMail({
        from: '"Mern Alert" <subhamrahar22@gmail.com>',
        to: subscriber.email,
        subject: 'New Alert',
        text: message
      });

      // Send push notification if subscription exists
      if (subscriber.pushSubscription) {
        try {
          await webpush.sendNotification(
            JSON.parse(subscriber.pushSubscription),
            JSON.stringify({
              title: 'New Alert',
              body: message
            })
          );
        } catch (error) {
          console.error('Error sending push notification:', error);
        }
      }
    }

    console.log('Alerts sent to:', subscribers.map(s => s.email));
    res.status(200).json({ message: 'Alerts sent successfully', count: subscribers.length });
  } catch (error) {
    console.error('Error sending alerts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;