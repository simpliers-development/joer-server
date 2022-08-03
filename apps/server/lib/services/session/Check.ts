import { throwError } from '../../types/error';
import BaseAuthService from './Base';

export default class CheckService extends BaseAuthService {
    static async execute(token: string) {
        try {
            const result = await this.helper.verifyToken(token);


            return result;
        } catch (e: any) {
            if (e.message === 'TOKEN_EXPIRED') {
                throwError('TOKEN_EXPIRED');
            }

            if (e.message === 'BAD_TOKEN') {
                throwError('BAD_TOKEN', 'token not valid');
            }
        }
    }
}
