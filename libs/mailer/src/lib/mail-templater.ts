import path from 'path';
import { readFile } from 'fs/promises';

import { SendMailOptions, SentMessageInfo } from 'nodemailer';
import { BaseMailer, MailOptions } from './base-mailer';

// eslint-disable-next-line no-shadow
export enum EMAIL_TYPES {
    CONFIRMATION = 'confirmation'
}
// eslint-disable-next-line no-shadow
export enum PROJECTS {
    JOER = 'joer'
}

type MailData = {
    subject: string;
    body: string;
};

export class MailTemplater extends BaseMailer {
    project: PROJECTS;

    constructor(data: MailOptions, project: PROJECTS) {
        super(data);
        this.project = project;
    }

    public async sendTemplateEmail(type: EMAIL_TYPES, to: string, templateOptions: object) {
        const data = await this._getTemplates(type, templateOptions);
        const options: SendMailOptions = {
            ...this.generateOptions(to, data.subject),
            html : data.body
        };
        const response: SentMessageInfo = await this.transporter.sendMail(options);

        return response;
    }


    private async _getTemplates(folderName: EMAIL_TYPES, templateOptions: object): Promise<MailData> {
        try {
            const emailPath = path.join(__dirname, '../../../libs/mailer/templates', this.project);
            const body = await readFile(path.join(emailPath, folderName, 'body.html'), 'utf-8');
            const subject = await readFile(path.join(emailPath, folderName, 'subject.html'), 'utf-8');

            return {
                body    : this.interpolate(body, templateOptions),
                subject : this.interpolate(subject, templateOptions)
            };
        } catch (error: any) {
            throw new Error(JSON.stringify({ message: error.message, payload: templateOptions }));
        }
    }
}
