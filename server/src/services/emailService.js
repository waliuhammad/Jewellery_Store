import nodemailer from 'nodemailer';
import { BRAND } from '../config/brand.js';

let transporter = null;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Base email layout matching "Champagne and Rose" palette
 */
function createEmailTemplate(title, preheader, contentHtml) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FBF8F3; color: #2B2522; margin: 0; padding: 24px; }
          .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E4D9CB; padding: 40px; }
          .header { text-align: center; border-bottom: 1px solid #E4D9CB; padding-bottom: 24px; margin-bottom: 28px; }
          .brand { font-family: Georgia, serif; font-size: 24px; letter-spacing: 0.18em; text-transform: uppercase; color: #2B2522; font-weight: bold; }
          .title { font-family: Georgia, serif; font-size: 26px; color: #2B2522; margin-top: 0; }
          .footer { text-align: center; border-top: 1px solid #E4D9CB; padding-top: 24px; margin-top: 36px; font-size: 12px; color: #6E625A; }
          .btn { display: inline-block; background-color: #2B2522; color: #FBF8F3; text-decoration: none; padding: 14px 28px; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: bold; margin-top: 20px; }
          .item-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F5EEE4; font-size: 14px; }
          .gold { color: #B8924A; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="brand">${BRAND.name}</div>
            <div style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #B8924A; margin-top: 6px;">Fine &amp; Fashion Jewelry Atelier</div>
          </div>
          <div>
            ${contentHtml}
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</p>
            <p>${BRAND.contact.address} &bull; ${BRAND.contact.displayPhone}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendOrderConfirmationEmail(order) {
  const itemsHtml = order.items
    .map(
      (item) => `
      <div style="padding: 10px 0; border-bottom: 1px solid #F5EEE4;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-weight: bold; color: #2B2522;">${item.name} (${item.finish || 'Standard'}, ${item.size || 'One Size'}) &times; ${item.quantity}</td>
            <td align="right" style="color: #2B2522;">PKR ${(item.price * item.quantity).toLocaleString()}</td>
          </tr>
        </table>
      </div>
    `
    )
    .join('');

  const html = createEmailTemplate(
    `Order Confirmed: ${order.orderNumber}`,
    'Your jewelry order is being wrapped with care.',
    `
      <h1 class="title">Thank you for your order</h1>
      <p style="color: #6E625A; line-height: 1.6;">
        Dear ${order.customer.name},<br>
        Your order <strong>${order.orderNumber}</strong> has been received by our Lahore studio. Our artisans will carefully inspect, polish, and package your pieces into our velvet keepsake boxes.
      </p>

      <div style="background-color: #F5EEE4; padding: 20px; margin: 24px 0;">
        <h3 style="margin-top: 0; font-family: Georgia, serif; font-size: 18px;">Order Summary</h3>
        ${itemsHtml}
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px; font-size: 14px;">
          <tr><td>Subtotal</td><td align="right">PKR ${order.subtotal.toLocaleString()}</td></tr>
          <tr><td>Shipping</td><td align="right">${order.shippingFee === 0 ? 'Complimentary' : `PKR ${order.shippingFee}`}</td></tr>
          ${order.discount ? `<tr><td style="color: #B8924A;">Discount</td><td align="right" style="color: #B8924A;">-PKR ${order.discount.toLocaleString()}</td></tr>` : ''}
          <tr style="font-weight: bold; font-size: 16px; border-top: 1px solid #E4D9CB;"><td style="padding-top: 12px;">Total Payable</td><td align="right" style="padding-top: 12px;">PKR ${order.total.toLocaleString()}</td></tr>
        </table>
      </div>

      <div style="color: #6E625A; font-size: 13px; line-height: 1.6;">
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <p><strong>Shipping Address:</strong> ${order.shippingAddress.line1}, ${order.shippingAddress.city}, ${order.shippingAddress.province}</p>
        <p><strong>Estimated Delivery:</strong> 2 - 4 business days</p>
      </div>

      <div style="text-align: center; margin-top: 28px;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/track-order?id=${order.orderNumber}" class="btn">Track Order Live</a>
      </div>
    `
  );

  if (transporter && order.customer.email) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"${BRAND.name}" <${BRAND.contact.ordersEmail}>`,
        to: order.customer.email,
        subject: `Your ${BRAND.name} Order Confirmation (${order.orderNumber})`,
        html,
      });
      console.log(`[Email] Order confirmation sent to ${order.customer.email}`);
    } catch (err) {
      console.warn('[Email] Failed to send order email:', err.message);
    }
  } else {
    console.log(`[Email Mock] Confirmation prepared for ${order.customer.email || 'Guest'} (${order.orderNumber})`);
  }
}

export async function sendContactNotificationEmail(contactMessage) {
  const html = createEmailTemplate(
    `New Studio Inquiry from ${contactMessage.name}`,
    'A new client inquiry has arrived.',
    `
      <h2 class="title">New Client Inquiry</h2>
      <p><strong>From:</strong> ${contactMessage.name} (${contactMessage.email})</p>
      <p><strong>Phone:</strong> ${contactMessage.phone || 'N/A'}</p>
      <p><strong>Subject:</strong> ${contactMessage.subject}</p>
      <div style="background-color: #F5EEE4; padding: 20px; margin: 16px 0; font-size: 14px; line-height: 1.6;">
        ${contactMessage.message}
      </div>
    `
  );

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"${BRAND.name}" <${BRAND.contact.ordersEmail}>`,
        to: process.env.STORE_NOTIFICATION_EMAIL || BRAND.contact.email,
        subject: `[Atelier Inquiry] ${contactMessage.subject} - ${contactMessage.name}`,
        html,
      });
    } catch (err) {
      console.warn('[Email] Contact notification error:', err.message);
    }
  } else {
    console.log(`[Email Mock] Contact notification logged from ${contactMessage.email}`);
  }
}

