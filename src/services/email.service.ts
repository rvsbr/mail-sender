import nodemailer from 'nodemailer';
import { Contact } from '@prisma/client';

// Configuração de provedores de email
type EmailProvider = 'sendgrid' | 'mailgun' | 'smtp' | 'ses';

interface EmailConfig {
  provider: EmailProvider;
  apiKey?: string;
  domain?: string;
  from: string;
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
}

export class EmailService {
  private config: EmailConfig;
  private transporter?: any;

  constructor() {
    this.config = this.loadConfig();
    this.setupTransporter();
  }

  private loadConfig(): EmailConfig {
    const provider = (process.env.EMAIL_PROVIDER || 'smtp') as EmailProvider;

    switch (provider) {
      case 'sendgrid':
        return {
          provider: 'sendgrid',
          apiKey: process.env.SENDGRID_API_KEY,
          from: process.env.EMAIL_FROM || 'noreply@example.com',
        };

      case 'mailgun':
        return {
          provider: 'mailgun',
          apiKey: process.env.MAILGUN_API_KEY,
          domain: process.env.MAILGUN_DOMAIN,
          from: process.env.EMAIL_FROM || 'noreply@example.com',
        };

      case 'smtp':
      default:
        return {
          provider: 'smtp',
          from: process.env.EMAIL_FROM || 'noreply@example.com',
          smtp: {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
              user: process.env.SMTP_USER || '',
              pass: process.env.SMTP_PASS || '',
            },
          },
        };
    }
  }

  private setupTransporter() {
    if (this.config.provider === 'smtp' && this.config.smtp) {
      this.transporter = nodemailer.createTransport(this.config.smtp);
    } else if (this.config.provider === 'sendgrid') {
      // SendGrid via SMTP
      this.transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
          user: 'apikey',
          pass: this.config.apiKey,
        },
      });
    } else if (this.config.provider === 'mailgun') {
      // Mailgun via SMTP
      this.transporter = nodemailer.createTransport({
        host: 'smtp.mailgun.org',
        port: 587,
        auth: {
          user: `postmaster@${this.config.domain}`,
          pass: this.config.apiKey,
        },
      });
    }
  }

  // Enviar email individual
  async sendEmail(to: string, subject: string, html: string, text?: string) {
    try {
      const mailOptions = {
        from: this.config.from,
        to,
        subject,
        html,
        text: text || this.stripHtml(html),
      };

      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error: any) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  // Enviar campanha para múltiplos contatos
  async sendCampaign(
    contacts: Contact[],
    subject: string,
    html: string,
    options?: {
      batchSize?: number;
      delayBetweenBatches?: number;
    }
  ) {
    const batchSize = options?.batchSize || 50;
    const delay = options?.delayBetweenBatches || 1000;

    const results = {
      total: contacts.length,
      sent: 0,
      failed: 0,
      errors: [] as any[],
    };

    // Processar em lotes
    for (let i = 0; i < contacts.length; i += batchSize) {
      const batch = contacts.slice(i, i + batchSize);

      const promises = batch.map(async (contact) => {
        // Personalizar email
        const personalizedHtml = this.personalize(html, contact);
        const personalizedSubject = this.personalize(subject, contact);

        const result = await this.sendEmail(
          contact.email,
          personalizedSubject,
          personalizedHtml
        );

        if (result.success) {
          results.sent++;
        } else {
          results.failed++;
          results.errors.push({
            email: contact.email,
            error: result.error,
          });
        }

        return result;
      });

      await Promise.all(promises);

      // Aguardar entre lotes
      if (i + batchSize < contacts.length) {
        await this.sleep(delay);
      }
    }

    return results;
  }

  // Personalizar template com dados do contato
  private personalize(template: string, contact: Contact): string {
    return template
      .replace(/\{\{firstName\}\}/g, contact.firstName || '')
      .replace(/\{\{lastName\}\}/g, contact.lastName || '')
      .replace(/\{\{email\}\}/g, contact.email)
      .replace(/\{\{fullName\}\}/g, `${contact.firstName || ''} ${contact.lastName || ''}`.trim());
  }

  // Remover HTML tags
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  // Sleep helper
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Verificar configuração
  async verifyConnection(): Promise<boolean> {
    try {
      if (this.transporter) {
        await this.transporter.verify();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Email verification failed:', error);
      return false;
    }
  }
}

export default new EmailService();
