/* eslint-disable @typescript-eslint/no-unused-vars */
import { promisify } from 'util';
import { compare, genSalt, hash } from 'bcrypt';
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { BaseService } from './Base';

interface ITokens {
    accessToken: string;
    refreshToken: string;
}

type SignCallback = (err: any, result: string) => void;
type VerifyCallback = (err: any, result: Record<string, any>) => void;

const jwtSign = promisify((payload: Record<string, any>, secret:string, options: SignOptions, _: SignCallback) =>
    jwt.sign(payload, secret, options));

const jwtVerify = promisify((token: string, secret:string, options: VerifyOptions, _: VerifyCallback) =>
    jwt.verify(token, secret, options));

export class AuthHelper extends BaseService {
    generateTokens = async (payload: Record<string, any>): Promise<ITokens> => {
        const accessToken = await jwtSign(payload, this.secret, {
            ...this.SIGN_OPTIONS,
            expiresIn : this.TOKEN_OPTIONS.accessToken
        });
        const refreshToken = await jwtSign(payload, this.secret, {
            ...this.SIGN_OPTIONS,
            expiresIn : this.TOKEN_OPTIONS.refreshToken
        });

        return {
            accessToken,
            refreshToken
        };
    };

    generateAccessToken = async (payload: Record<string, any>): Promise<string> => {
        const accessToken = await jwtSign(payload, this.secret, {
            ...this.SIGN_OPTIONS,
            expiresIn : this.TOKEN_OPTIONS.accessToken
        });

        return accessToken;
    };

    verifyToken = async (token: string): Promise<any> => {
        try {
            const result = await jwtVerify(token, this.secret, this.VERIFY_OPTIONS);

            return result;
        } catch (e: any) {
            if (e instanceof jwt.TokenExpiredError) {
                throw new Error('TOKEN_EXPIRED');
            }

            throw new Error('BAD_TOKEN');
        }
    };

    hashPassword = async (password: string): Promise<string> => {
        const salt = await genSalt(this.saltRounds);
        const hashPassword = await hash(password, salt);

        return hashPassword;
    };

    comparePassword = async (password: string, hashPassword: string): Promise<boolean> => {
        const IsPasswordCorrect = await compare(password, hashPassword);

        if (!IsPasswordCorrect) {
            throw new Error('BAD_PASSWORD');
        }

        return IsPasswordCorrect;
    };
}

