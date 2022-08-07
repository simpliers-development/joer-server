import { throwError } from '../../types/error';
import X from '../../types/global/X';
import BaseSessionService from './Base';

export default class SessionCheckService extends BaseSessionService {
    static get validationRules() {
        return {
            token : [ 'required', 'string' ]
        };
    }

    static async execute({ token }: { token: string}) {
        try {
            const userData = this.authHelper.verifyToken(token);
            const user = await this.checkUser(userData.id);

            if (!user) {
                throwError('NOT_FOUND', 'user');
            }

            return user;
        } catch (e: any) {
            if (e.message === 'TOKEN_EXPIRED') {
                throw new X({
                    code   : 'TOKEN_EXPIRED',
                    fields : {
                        token : 'TOKEN_EXPIRED'
                    }
                });
            }

            if (e.message === 'BAD_TOKEN') {
                throw new X({
                    code   : 'BAD_TOKEN',
                    fields : {
                        token : 'BAD_TOKEN'
                    }
                });
            }

            throw e;
        }
    }
}
