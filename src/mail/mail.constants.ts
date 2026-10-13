export const MAIL_QUEUE = 'mail';
export const WELCOME_JOB = 'welcome';

export interface WelcomeEmailPayload {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
}
