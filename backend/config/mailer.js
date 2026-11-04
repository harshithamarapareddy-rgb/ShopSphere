const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text }) => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const adminEmail =
    process.env.ENQUIRY_EMAIL || process.env.ADMIN_EMAIL || user || 'admin@shopsphere.com';

  if (!user || user === 'your-email@gmail.com' || !pass || pass === 'your-16-digit-app-password') {
    const error = 'SMTP_USER and SMTP_PASS must be configured in backend/.env.';
    console.error(`Email not sent: ${error}`);
    return { success: false, error };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const info = await transporter.sendMail({
    from: `"SHOP SPHERE Support" <${user}>`,
    to: to || adminEmail,
    subject,
    text,
    html,
  });

  console.log('Real email dispatched via SMTP. Message ID:', info.messageId);
  return { success: true, messageId: info.messageId };
};

module.exports = sendEmail;
