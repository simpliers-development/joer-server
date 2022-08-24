import { Request } from 'express';
import { Mailer } from '@joer/mailer';
import config from '../config';

const mailer = new Mailer({ secure: false, ...config.email });

export default {

    test : async (req: Request) => {
        try {
            console.log(req.body.to, req.body.text);
            await mailer.sendTextMail(req.body.to, req.body.text);

            return;
        } catch (error) {
            console.log(error);
        }
    }
};
