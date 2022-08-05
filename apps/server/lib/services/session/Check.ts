import { throwError } from '../../types/error';
import BaseSessionService from './Base';

export default class SessionCheckService extends BaseSessionService {
    static get validationRules() {
        return {
            token : [ 'required', 'string' ]
        };
    }

    static async execute(token: string) {
        try {
            const userData = this.authHelper.verifyToken(token);
            const user = await this.checkUser(userData.id);

            return user;
        } catch (e: any) {
            if (e.message === 'TOKEN_EXPIRED') {
                throwError('TOKEN_EXPIRED');
            }

            if (e.message === 'BAD_TOKEN') {
                throwError('BAD_TOKEN');
            }
        }
    }
}
