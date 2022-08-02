import jwt from 'jsonwebtoken';
import { throwError } from '../../types/error';
import config from '../../config';
import { ITokens } from '../../types/auth';
import { SIGN_OPTIONS, TOKEN_OPTIONS, VERIFY_OPTIONS } from '../../constants/jwt';

export  default class TokenService {
    static generateTokens = async (payload: Record<string, any>): Promise<ITokens> => {
        const secret = config.jwt.secret;

        const accessToken = jwt.sign(payload, secret, {
            ...SIGN_OPTIONS,
            expiresIn : TOKEN_OPTIONS.accessToken
        });
        const refreshToken = jwt.sign(payload, secret, {
            ...SIGN_OPTIONS,
            expiresIn : TOKEN_OPTIONS.refreshToken
        });

        return {
            accessToken,
            refreshToken
        };
    };

    static generateAccessToken = async (payload: Record<string, any>): Promise<string> => {
        const secret = config.jwt.secret;

        const accessToken = jwt.sign(payload, secret, {
            ...SIGN_OPTIONS,
            expiresIn : TOKEN_OPTIONS.accessToken
        });

        return accessToken;
    };

    static verifyToken = async (token: string): Promise<any> => {
        try {
            const secret = config.jwt.secret;
            const result = jwt.verify(token, secret, VERIFY_OPTIONS);

            return result;
        } catch (e: any) {
            throwError('BAD_TOKEN', 'not verified');
        }
    };
}
