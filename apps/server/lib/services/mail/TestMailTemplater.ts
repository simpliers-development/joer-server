import { EMAIL_TYPES, MailTemplater, PROJECTS } from '@joer/mailer';
import config from '../../config';
import Base from '../Base';


export default class MailTemplaterService extends Base {
    static async execute(body: any) {
        const mailer = new MailTemplater({ secure: false, ...config.email }, PROJECTS.JOER);

        await mailer.sendTemplateEmail(EMAIL_TYPES.CONFIRMATION, body.to, { user: 'John Doe' });
    }
}
