import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { createTransport, type Transporter } from 'nodemailer';
import { mailConfig } from 'src/config';
import { WelcomeEmailPayload } from './mail.constants';

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter;

  constructor(
    @Inject(mailConfig.KEY)
    private readonly config: ConfigType<typeof mailConfig>,
  ) {
    this.transporter =
      config.driver === 'json'
        ? createTransport({ jsonTransport: true })
        : createTransport({
            host: config.host,
            port: config.port,
            auth:
              config.user && config.password
                ? {
                    user: config.user,
                    pass: config.password,
                  }
                : undefined,
            connectionTimeout: 10_000,
            greetingTimeout: 10_000,
            socketTimeout: 20_000,
          });
  }

  async sendWelcome(payload: WelcomeEmailPayload): Promise<void> {
    const name = `${payload.firstName} ${payload.lastName}`;
    try {
      await this.transporter.sendMail({
        from: this.config.from,
        to: payload.email,
        subject: `Welcome to Helpdesk, ${name}!`,
        text: `Hi ${name},\n\nYour Helpdesk account has been created. You can now sign in.\n\nIf you did not create this account, please ignore this email.\n`,
        html: `<p>Hi ${escapeHtml(name)},</p><p>Your Helpdesk account has been created. You can now sign in.</p><p>If you did not create this account, please ignore this email.</p>`,
      });
    } catch (error) {
      this.logger.error(
        `SMTP Transmission failed targeting recipient: ${payload.email}`,
        error,
      );
      throw new InternalServerErrorException(
        'Failed to process outbound email transmission.',
      );
    }
  }
}
