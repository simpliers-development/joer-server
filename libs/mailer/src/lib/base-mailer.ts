import vm, { Context } from 'vm';
import nodemailer, { Transporter, SendMailOptions, SentMessageInfo } from 'nodemailer';
import { Options } from 'nodemailer/lib/smtp-connection';

export interface MailOptions {
    secure: boolean;
    host: string,
    port: number,
    auth: {
        user: string,
        pass: string
    }
}
export class BaseMailer {
    OPTIONS: Options;

    protected transporter: Transporter;

    constructor(data: MailOptions) {
        this.OPTIONS = {
            secure : data.secure,
            host   : data.host,
            port   : data.port,
            auth   : data.auth
        };
        this.transporter = nodemailer.createTransport(this.OPTIONS);
    }

    protected async sendMail(options: SendMailOptions): Promise<SentMessageInfo> {
        try {
            const response: SentMessageInfo = await this.transporter.sendMail(options);

            return response;
        } catch (error) {
            throw new Error((error as Error).message || 'Email sending error.');
        }
    }

    protected generateOptions(to: string | string[], subject?: string): SendMailOptions {
        const recepients: string = this.generateRecepients(to);
        const options: SendMailOptions = {
            from : this.OPTIONS?.auth?.user,
            to   : recepients,
            subject
        };

        return options;
    }

    protected generateRecepients(to: string | string[]): string {
        if (!Array.isArray(to)) {
            return to;
        }

        return to.join(', ');
    }

    protected interpolate(template: string, params: object): string {
        const keys: string[] = Object.keys(params);
        const values: unknown[] = Object.values(params);
        const context: Context = { keys, template, func: null };

        vm.createContext(context);
        vm.runInContext('func = new Function(...keys, `return \\`${template}\\`;`);', context); // eslint-disable-line no-template-curly-in-string

        // eslint-disable-next-line dot-notation
        return context['func'](...values);
    }
}
