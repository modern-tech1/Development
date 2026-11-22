
const express = require('express');

function createContactRouter(db) {
  const router = express.Router();

  // MongoDB contact messages collection
  const messages = db.get('contactMessages');

  // POST /api/contact
  router.post('/', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body || {};

      // 1. Validate required fields
      if (
        typeof name !== 'string' ||
        typeof email !== 'string' ||
        typeof subject !== 'string' ||
        typeof message !== 'string'
      ) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields.'
        });
      }

      // 2. Clean submitted information
      const cleanName = name.trim();
      const cleanEmail = email.trim().toLowerCase();
      const cleanSubject = subject.trim();
      const cleanMessage = message.trim();

      // 3. Validate field lengths
      if (
        cleanName.length < 1 ||
        cleanName.length > 100 ||
        cleanEmail.length < 3 ||
        cleanEmail.length > 254 ||
        cleanSubject.length < 1 ||
        cleanSubject.length > 100 ||
        cleanMessage.length < 10 ||
        cleanMessage.length > 3000
      ) {
        return res.status(400).json({
          success: false,
          message: 'Please check your form fields and try again.'
        });
      }

      // 4. Validate email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(cleanEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid email address.'
        });
      }

      // 5. Save message in MongoDB
      const savedMessage = await messages.insert({
        name: cleanName,
        email: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
        status: 'new',
        createdAt: new Date()
      });

      // 6. Send success response
      return res.status(201).json({
        success: true,
        message: 'Your message has been received successfully.',
        data: {
          id: savedMessage._id
        }
      });

    } catch (error) {
      console.error('Contact form error:', error.message);

      // 7. Handle server errors
      return res.status(500).json({
        success: false,
        message: 'Unable to send your message right now. Please try again.'
      });
    }
  });

  return router;
}

module.exports = createContactRouter;
