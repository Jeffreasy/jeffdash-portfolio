import FormData from "form-data";
import Mailgun from "mailgun.js";

// Initialize Mailgun client
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
  // When you have an EU-domain, you must specify the endpoint:
  url: "https://api.eu.mailgun.net"
});

export interface EmailData {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

export async function sendEmail(emailData: EmailData) {
  try {
    const domain = process.env.MAILGUN_DOMAIN || "jeffdash.com";
    const fromEmail = emailData.from || process.env.MAILGUN_FROM_EMAIL || `no-reply@${domain}`;

    const messageData: any = {
      from: fromEmail,
      to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
      subject: emailData.subject,
    };

    if (emailData.text) messageData.text = emailData.text;
    if (emailData.html) messageData.html = emailData.html;

    const data = await mg.messages.create(domain, messageData);

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

// Test function based on your example
export async function sendTestEmail() {
  try {
    const domain = process.env.MAILGUN_DOMAIN || "jeffdash.com";
    
    const data = await mg.messages.create(domain, {
      from: `Jeffrey Portfolio <postmaster@${domain}>`,
      to: ["Jeffrey Lavente <jeffrey@jeffdash.com>"],
      subject: "Test Email - Jeffrey Portfolio",
      text: "Congratulations! Your Mailgun integration with jeffdash.com is working perfectly!",
    });

    console.log(data); // logs response data
    return { success: true, data };
  } catch (error) {
    console.log(error); // logs any error
    return { success: false, error };
  }
} 