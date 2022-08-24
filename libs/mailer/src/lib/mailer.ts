import nodemailer, { Transporter, SendMailOptions, SentMessageInfo } from 'nodemailer';
import { Options } from 'nodemailer/lib/smtp-connection';


interface mailData {
    secure: boolean;
    host: string,
    port: number,
    auth: {
        user: string,
        pass: string
    }
}


export class Mailer {
    OPTIONS: Options;

    private transporter: Transporter;

    constructor(data: mailData) {
        this.OPTIONS = {
            secure : data.secure,
            host   : data.host,
            port   : data.port,
            auth   : data.auth
        };
        this.transporter = nodemailer.createTransport(this.OPTIONS);
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

    private async sendMail(options: SendMailOptions): Promise<SentMessageInfo> {
        try {
            const response: SentMessageInfo = await this.transporter.sendMail(options);

            return response;
        } catch (error) {
            throw new Error((error as Error).message || 'Email sending error.');
        }
    }

    private generateOptions(to: string | string[], subject?: string): SendMailOptions {
        const recepients: string = this.generateRecepients(to);
        const options: SendMailOptions = {
            from : this.OPTIONS?.auth?.user,
            to   : recepients,
            subject
        };

        return options;
    }

    private generateRecepients(to: string | string[]): string {
        if (!Array.isArray(to)) {
            return to;
        }

        return to.join(', ');
    }
}

