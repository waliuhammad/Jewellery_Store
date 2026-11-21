import { db } from '../config/firebase.js';
import { sendContactNotificationEmail } from '../services/emailService.js';

/**
 * Handle contact form submission
 * POST /api/v1/contact
 */
export async function submitContact(req, res, next) {
  try {
    const { name, email, phone, subject, message, honeypot } = req.body;

    // Honeypot spam protection
    if (honeypot) {
      console.warn('[Contact] Honeypot triggered, silently dropping spam submission.');
      return res.json({
        success: true,
        data: { message: 'Thank you for reaching out. We will get back to you shortly.' },
      });
    }

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Please provide your name, email, and message.',
        },
      });
    }

    const messageId = 'msg_' + Date.now();
    const contactData = {
      id: messageId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      subject: (subject || 'General Inquiry').trim(),
      message: message.trim(),
      status: 'unread',
      createdAt: new Date().toISOString(),
    };

    await db.collection('contactMessages').doc(messageId).set(contactData);

    // Non-blocking notification email
    sendContactNotificationEmail(contactData).catch((err) =>
      console.warn('[Contact] Notification email failed:', err.message)
    );

    res.json({
      success: true,
      data: {
        message: 'Thank you for contacting Aurelle Jewels. Our concierge will be in touch shortly.',
      },
    });
  } catch (error) {
    next(error);
  }
}

