import { throwError } from '../../types/error';
import X from '../../types/global/X';
import { dumpTokenData } from '../../utils/dumpUtils';
import BaseSessionService from './Base';

interface CheckServicePayload {
    accessToken: string;
    refreshToken: string;
}

export default class SessionCheckService extends BaseSessionService {
    static get validationRules() {
        return {
            accessToken  : [ 'required', 'string' ],
            refreshToken : [ 'required', 'string' ]
        };
    }

    static cookies(_data: any) {
        const cookies = [];

        if (_data.accessToken) {
            cookies.push({
                name  : 'accessToken',
                value : _data.accessToken
            });
        }

        if (_data.refreshToken) {
            cookies.push({
                name  : 'refreshToken',
                value : _data.refreshToken
            });
        }

        return cookies;
    }

    static async execute({ accessToken, refreshToken }: CheckServicePayload) {
        try {
            const user = await this.checkToken(accessToken);

            return { user };
        } catch (e: any) {
            if (e.message === 'TOKEN_EXPIRED') {
                try {
                    const refreshUser = await this.checkToken(refreshToken);
                    const tokenData = dumpTokenData(refreshUser);
                    const tokens = this.authHelper.generateTokens(tokenData);

                    return { user: refreshUser, ...tokens };
                } catch (err: any) {
                    if (err.message === 'TOKEN_EXPIRED') {
                        throw new X({
                            code   : 'PERMISSION_DENIED',
                            fields : {
                                refreshToken : 'TOKEN_EXPIRED'
                            }
                        });
                    }

                    if (e.message === 'BAD_TOKEN') {
                        throwError('BAD_TOKEN');
                    }

                    throw e;
                }
            }

            if (e.message === 'BAD_TOKEN') {
                throwError('BAD_TOKEN');
            }

            throw e;
        }
    }
}
