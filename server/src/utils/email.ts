import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Campus Pay <noreply@campuspay.edu>',
      to: options.to,
      subject: options.subject,
      html: options.html
    });
    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

export const sendPaymentConfirmation = async (email: string, amount: number, chargeDescriptions: string[]): Promise<void> => {
  const html = `
    <h2>Payment Confirmation</h2>
    <p>Your payment has been successfully processed.</p>
    <p><strong>Amount Paid:</strong> $${amount.toFixed(2)}</p>
    <p><strong>Charges Paid:</strong></p>
    <ul>
      ${chargeDescriptions.map(desc => `<li>${desc}</li>`).join('')}
    </ul>
    <p>Thank you for your payment!</p>
    <p>Campus Pay Team</p>
  `;

  await sendEmail({
    to: email,
    subject: 'Payment Confirmation - Campus Pay',
    html
  });
};

export const sendPaymentReminder = async (email: string, firstName: string, balance: number, dueDate: string): Promise<void> => {
  const html = `
    <h2>Payment Reminder</h2>
    <p>Hello ${firstName},</p>
    <p>This is a reminder that you have an outstanding balance on your student account.</p>
    <p><strong>Amount Due:</strong> $${balance.toFixed(2)}</p>
    <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
    <p>Please log in to Campus Pay to view details and make a payment.</p>
    <p>Campus Pay Team</p>
  `;

  await sendEmail({
    to: email,
    subject: 'Payment Reminder - Campus Pay',
    html
  });
};
