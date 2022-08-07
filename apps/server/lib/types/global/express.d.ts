import { uuid } from '../common';

declare global {
    namespace Express {
        interface Request {
            context: {
                user : {
                    id: uuid;
                    email: string;
                    userName: string;

                    // add here anything you need
                }
            }
        }
    }
}
