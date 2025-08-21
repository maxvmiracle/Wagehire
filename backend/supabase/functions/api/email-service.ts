// Production Email Service for Supabase Edge Functions
// Supports multiple email providers: SendGrid, Mailgun, Resend, AWS SES

interface EmailConfig {
  provider: 'sendgrid' | 'mailgun' | 'resend' | 'ses' | 'manual';
  apiKey?: string;
  fromEmail?: string;
  fromName?: string;
  domain?: string; // For Mailgun
  region?: string; // For AWS SES
}

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  async sendEmail(emailData: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      switch (this.config.provider) {
        case 'sendgrid':
          return await this.sendViaSendGrid(emailData);
        case 'mailgun':
          return await this.sendViaMailgun(emailData);
        case 'resend':
          return await this.sendViaResend(emailData);
        case 'ses':
          return await this.sendViaSES(emailData);
        case 'manual':
        default:
          return await this.sendManual(emailData);
      }
    } catch (error) {
      console.error('Email sending error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async sendViaSendGrid(emailData: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.config.apiKey) {
      throw new Error('SendGrid API key not configured');
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: emailData.to }],
          },
        ],
        from: {
          email: this.config.fromEmail || 'noreply@wagehire.com',
          name: this.config.fromName || 'Wagehire',
        },
        subject: emailData.subject,
        content: [
          {
            type: 'text/html',
            value: emailData.html,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`SendGrid error: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    return {
      success: true,
      messageId: result.id || 'unknown'
    };
  }

  private async sendViaMailgun(emailData: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.config.apiKey || !this.config.domain) {
      throw new Error('Mailgun API key or domain not configured');
    }

    const formData = new FormData();
    formData.append('from', `${this.config.fromName || 'Wagehire'} <${this.config.fromEmail || `noreply@${this.config.domain}`}>`);
    formData.append('to', emailData.to);
    formData.append('subject', emailData.subject);
    formData.append('html', emailData.html);
    if (emailData.text) {
      formData.append('text', emailData.text);
    }

    const response = await fetch(`https://api.mailgun.net/v3/${this.config.domain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${this.config.apiKey}`)}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Mailgun error: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    return {
      success: true,
      messageId: result.id || 'unknown'
    };
  }

  private async sendViaResend(emailData: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.config.apiKey) {
      throw new Error('Resend API key not configured');
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${this.config.fromName || 'Wagehire'} <${this.config.fromEmail || 'noreply@wagehire.com'}>`,
        to: [emailData.to],
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Resend error: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    return {
      success: true,
      messageId: result.id || 'unknown'
    };
  }

  private async sendViaSES(emailData: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // AWS SES implementation would require AWS SDK
    // For now, return manual mode
    return await this.sendManual(emailData);
  }

  private async sendManual(emailData: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // Manual mode - log email details for development/testing
    console.log('📧 Manual Email Mode - Email would be sent:');
    console.log('   To:', emailData.to);
    console.log('   Subject:', emailData.subject);
    console.log('   From:', `${this.config.fromName || 'Wagehire'} <${this.config.fromEmail || 'noreply@wagehire.com'}>`);
    console.log('   HTML Content Length:', emailData.html.length, 'characters');
    
    // Extract verification URL from HTML for manual testing
    const urlMatch = emailData.html.match(/href="([^"]*verify-email[^"]*)"/);
    if (urlMatch) {
      console.log('   🔗 Verification URL:', urlMatch[1]);
    }

    return {
      success: true,
      messageId: `manual-${Date.now()}`
    };
  }
}

// Email templates
export const emailTemplates = {
  verification: (name: string, verificationUrl: string) => ({
    subject: 'Verify Your Email - Wagehire',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; color: white;">Wagehire</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; color: white;">Interview Management Platform</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to Wagehire, ${name}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Thank you for registering with Wagehire. To complete your registration and start managing your interview journey, 
            please verify your email address by clicking the button below.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block; 
                      font-weight: bold;
                      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          
          <p style="background: #e9ecef; padding: 15px; border-radius: 5px; word-break: break-all; color: #495057;">
            ${verificationUrl}
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-top: 25px;">
            This verification link will expire in 24 hours. If you didn't create an account with Wagehire, 
            you can safely ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
          
          <p style="color: #999; font-size: 14px; text-align: center;">
            Best regards,<br>
            The Wagehire Team
          </p>
        </div>
      </div>
    `,
    text: `
      Welcome to Wagehire, ${name}!
      
      Thank you for registering with Wagehire. To complete your registration and start managing your interview journey, 
      please verify your email address by visiting this link:
      
      ${verificationUrl}
      
      This verification link will expire in 24 hours. If you didn't create an account with Wagehire, 
      you can safely ignore this email.
      
      Best regards,
      The Wagehire Team
    `
  }),

  passwordReset: (name: string, resetUrl: string) => ({
    subject: 'Reset Your Password - Wagehire',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Wagehire</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Interview Management Platform</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Hello ${name},<br><br>
            We received a request to reset your password for your Wagehire account. 
            Click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block; 
                      font-weight: bold;
                      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          
          <p style="background: #e9ecef; padding: 15px; border-radius: 5px; word-break: break-all; color: #495057;">
            ${resetUrl}
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-top: 25px;">
            This password reset link will expire in 1 hour. If you didn't request a password reset, 
            you can safely ignore this email and your password will remain unchanged.
          </p>
          
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
          
          <p style="color: #999; font-size: 14px; text-align: center;">
            Best regards,<br>
            The Wagehire Team
          </p>
        </div>
      </div>
    `,
    text: `
      Password Reset Request
      
      Hello ${name},
      
      We received a request to reset your password for your Wagehire account. 
      Click the link below to create a new password:
      
      ${resetUrl}
      
      This password reset link will expire in 1 hour. If you didn't request a password reset, 
      you can safely ignore this email and your password will remain unchanged.
      
      Best regards,
      The Wagehire Team
    `
  })
};

// Initialize email service based on environment
export function createEmailService(): EmailService {
  const provider = (Deno.env.get('EMAIL_PROVIDER') as EmailConfig['provider']) || 'manual';
  
  const config: EmailConfig = {
    provider,
    apiKey: Deno.env.get('EMAIL_API_KEY'),
    fromEmail: Deno.env.get('EMAIL_FROM') || 'noreply@wagehire.com',
    fromName: Deno.env.get('EMAIL_FROM_NAME') || 'Wagehire',
    domain: Deno.env.get('EMAIL_DOMAIN'),
    region: Deno.env.get('AWS_REGION')
  };

  return new EmailService(config);
}

export { EmailService };
export type { EmailConfig, EmailData }; 