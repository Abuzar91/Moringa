import express from 'express';
import nodemailer from 'nodemailer';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many contact form submissions, please try again later.'
  }
});

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Validation rules
const contactValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('subject').trim().isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),
  body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters')
];

// Contact form submission
router.post('/', contactLimiter, contactValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, phone, subject, message } = req.body;

    // Email template for admin notification
    const adminEmailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title>Contact Form - AM Botonics</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
              * { box-sizing: border-box; }
              body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f4f7f4; }
          </style>
      </head>
      <body>
          <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #63a967, #4f8752); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
                  <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                  <div style="position: absolute; bottom: -30px; left: -30px; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                  <div style="position: relative; z-index: 2;">
                      <div style="display: inline-flex; align-items: center; justify-content: center; width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 16px; margin-bottom: 16px;">
                          <span style="font-size: 24px;">🌿</span>
                      </div>
                      <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; margin-bottom: 8px;">New Contact Message!</h1>
                      <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 18px; font-weight: 500;">From AM Botonics Website</p>
                  </div>
              </div>

              <!-- Message Content -->
              <div style="padding: 40px 30px;">
                  <div style="text-center; margin-bottom: 32px;">
                      <h2 style="color: #1f2937; margin: 0 0 12px 0; font-size: 24px; font-weight: 600;">Contact Form Submission</h2>
                      <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">You have received a new message from your website contact form.</p>
                  </div>

                  <!-- Contact Info Card -->
                  <div style="background: linear-gradient(135deg, #f4f7f4, #e6ede6); border: 2px solid #63a967; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                      <h3 style="margin: 0 0 16px 0; color: #4f8752; font-weight: 600; font-size: 18px;">👤 Contact Information</h3>
                      <div style="space-y: 12px;">
                          <div style="margin-bottom: 12px;">
                              <span style="color: #1f2937; font-weight: 600; font-size: 14px;">Name:</span>
                              <span style="color: #1f2937; margin-left: 8px; font-size: 16px;">${name}</span>
                          </div>
                          <div style="margin-bottom: 12px;">
                              <span style="color: #1f2937; font-weight: 600; font-size: 14px;">Email:</span>
                              <span style="color: #1f2937; margin-left: 8px; font-size: 16px;">${email}</span>
                          </div>
                          ${phone ? `
                          <div style="margin-bottom: 12px;">
                              <span style="color: #1f2937; font-weight: 600; font-size: 14px;">Phone:</span>
                              <span style="color: #1f2937; margin-left: 8px; font-size: 16px;">${phone}</span>
                          </div>
                          ` : ''}
                          <div style="margin-bottom: 12px;">
                              <span style="color: #1f2937; font-weight: 600; font-size: 14px;">Subject:</span>
                              <span style="color: #1f2937; margin-left: 8px; font-size: 16px;">${subject}</span>
                          </div>
                      </div>
                  </div>

                  <!-- Message Content -->
                  <div style="background: #f9fafb; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                      <h4 style="margin: 0 0 16px 0; color: #1f2937; font-weight: 600; font-size: 16px;">💬 Message:</h4>
                      <div style="background: white; padding: 20px; border-radius: 12px; border-left: 4px solid #63a967;">
                          <p style="color: #1f2937; line-height: 1.6; margin: 0; font-size: 16px;">${message}</p>
                      </div>
                  </div>

                  <!-- Action Required -->
                  <div style="text-align: center; padding: 24px; background: #f4f7f4; border-radius: 16px; border: 2px solid #b7cdb8;">
                      <h4 style="margin: 0 0 16px 0; color: #1f2937; font-weight: 600;">📧 Action Required</h4>
                      <p style="margin: 0 0 16px 0; color: #6b7280;">Please respond to this customer inquiry as soon as possible.</p>
                      <a href="mailto:${email}" 
                         style="background: #63a967; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600; font-size: 14px;">
                          Reply to ${name}
                      </a>
                  </div>
              </div>

              <!-- Footer -->
              <div style="background: #1f2937; color: white; text-align: center; padding: 32px;">
                  <div style="margin-bottom: 16px;">
                      <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: #63a967; border-radius: 12px; margin-bottom: 12px;">
                          <span style="font-size: 20px;">🌿</span>
                      </div>
                      <h3 style="margin: 0; font-size: 20px; font-weight: 600;">MoringaCare</h3>
                  </div>
                  <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 500;">Contact Form Notification</p>
                  <p style="margin: 0; color: #9ca3af; font-size: 14px;">Premium moringa & tea tree oil soaps for natural care</p>
              </div>
          </div>
      </body>
      </html>
    `;

    // Send email to admin
    await transporter.sendMail({
      from: `"MoringaCare Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form: ${subject}`,
      html: adminEmailTemplate,
      replyTo: email
    });


    res.json({
      success: true,
      message: 'Message sent successfully! We\'ll get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
});

export default router;