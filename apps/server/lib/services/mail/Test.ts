import { Mailer } from '@joer/mailer';
import config from '../../config';
import Base from '../Base';


export default class UserListService extends Base {
    static async execute(body: any) {
        const mailer = new Mailer({ secure: false, ...config.email });

        await mailer.sendTextMail(body.to, body.text);
    }
}
