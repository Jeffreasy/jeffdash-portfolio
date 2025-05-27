import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, sendTestEmail } from '@/lib/mailgun';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...emailData } = body;

    logger.info('Email API called', { type, to: emailData.to });

    // Handle test email
    if (type === 'test') {
      const result = await sendTestEmail();
      
      if (result.success) {
        logger.info('Test email sent successfully');
        return NextResponse.json({ 
          success: true, 
          message: 'Test email sent successfully!' 
        });
      } else {
        logger.error('Failed to send test email', { error: result.error });
        return NextResponse.json({ 
          success: false, 
          message: 'Failed to send test email' 
        }, { status: 500 });
      }
    }

    // Handle contact form email
    if (type === 'contact') {
      const { name, email, message, selectedPlan } = emailData;

      // Validate required fields
      if (!name || !email || !message) {
        return NextResponse.json({ 
          success: false, 
          message: 'Missing required fields' 
        }, { status: 400 });
      }

      // Send confirmation email to user
      const userEmailResult = await sendEmail({
        to: email,
        from: 'no-reply@jeffdash.com',
        subject: 'Bedankt voor je bericht - Jeffrey Portfolio',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">Bedankt voor je bericht!</h2>
            <p>Hallo ${name},</p>
            <p>Bedankt voor je interesse in mijn werk. Ik heb je bericht ontvangen en neem zo snel mogelijk contact met je op.</p>
            ${selectedPlan ? `<p><strong>Je bent geïnteresseerd in:</strong> ${selectedPlan}</p>` : ''}
            <p>Met vriendelijke groet,<br>Jeffrey Lavente</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280;">
              Dit is een automatisch gegenereerd bericht. Je kunt niet direct op deze email antwoorden.
            </p>
          </div>
        `,
        text: `Hallo ${name},\n\nBedankt voor je interesse in mijn werk. Ik heb je bericht ontvangen en neem zo snel mogelijk contact met je op.\n\nMet vriendelijke groet,\nJeffrey Lavente`
      });

      // Send notification email to Jeffrey  
      const fromEmail = selectedPlan ? 'sales@jeffdash.com' : 'contact@jeffdash.com';
      const notificationResult = await sendEmail({
        to: 'jeffrey@jeffdash.com',
        from: fromEmail,
        subject: `Nieuw contact bericht van ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">Nieuw Contact Bericht</h2>
            <p><strong>Naam:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${selectedPlan ? `<p><strong>Geïnteresseerd in:</strong> ${selectedPlan}</p>` : ''}
            <p><strong>Bericht:</strong></p>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 10px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <p style="margin-top: 20px;">
              <a href="mailto:${email}" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Beantwoord Direct
              </a>
            </p>
          </div>
        `,
        text: `Nieuw contact bericht\n\nNaam: ${name}\nEmail: ${email}\n${selectedPlan ? `Geïnteresseerd in: ${selectedPlan}\n` : ''}\nBericht:\n${message}`
      });

      if (userEmailResult.success && notificationResult.success) {
        logger.info('Contact emails sent successfully', { name, email });
        return NextResponse.json({ 
          success: true, 
          message: 'Emails sent successfully!' 
        });
      } else {
        logger.error('Failed to send contact emails', { 
          userEmailResult, 
          notificationResult 
        });
        return NextResponse.json({ 
          success: false, 
          message: 'Failed to send emails' 
        }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Invalid email type' 
    }, { status: 400 });

  } catch (error: any) {
    logger.error('Email API error', { error: error.message || error });
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
} 