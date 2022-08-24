import { SendMailOptions, SentMessageInfo } from 'nodemailer';
import { BaseMailer, MailOptions } from './BaseMailer';

export class Mailer extends BaseMailer  {
    constructor(data: MailOptions) {
        super(data);
    }


    public sendTextMail(to: string, text: string, subject?: string): Promise<SentMessageInfo> {
        const options: SendMailOptions = {
            ...this.generateOptions(to, subject),
            text
        };

        return this.sendMail(options);
    }

    public sendHtmlMail(to: string, html: string, subject?: string): Promise<SentMessageInfo> {
        const options: SendMailOptions = {
            ...this.generateOptions(to, subject),
            html
        };

        return this.sendMail(options);
    }
}

