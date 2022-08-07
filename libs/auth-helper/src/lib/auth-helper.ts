import { compare, genSalt, hash } from 'bcrypt';
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';


interface ITokens {
    accessToken: string;
    refreshToken: string;
}
interface JwtData{
    secret: string,
    issuer: string,
    subject: string,
    audience: string,
    accessExpireTime : string,
    refreshExpireTime: string,
    saltRounds: number
}
export class AuthHelper {
    secret: string;

    saltRounds: number;

    SIGN_OPTIONS: SignOptions;

    VERIFY_OPTIONS: VerifyOptions;

    TOKEN_OPTIONS: any;

    constructor(data: JwtData)  {
        this.secret = data.secret;

        this.saltRounds = data.saltRounds;

        this.SIGN_OPTIONS = {
            issuer   : data.issuer,
            subject  : data.subject,
            audience : data.audience
        };

        this.VERIFY_OPTIONS = {
            issuer   : data.issuer,
            subject  : data.subject,
            audience : data.audience
        };

        this.TOKEN_OPTIONS = {
            accessToken  : data.accessExpireTime,
            refreshToken : data.refreshExpireTime
        };
    }

    generateTokens = (payload: Record<string, any>): ITokens => {
        const accessToken = jwt.sign(payload, this.secret, {
            ...this.SIGN_OPTIONS,
            expiresIn : this.TOKEN_OPTIONS.accessToken
        });
        const refreshToken = jwt.sign(payload, this.secret, {
            ...this.SIGN_OPTIONS,
            expiresIn : this.TOKEN_OPTIONS.refreshToken
        });

        return {
            accessToken,
            refreshToken
        };
    };

    generateAccessToken = (payload: Record<string, any>): string => {
        const accessToken = jwt.sign(payload, this.secret, {
            ...this.SIGN_OPTIONS,
            expiresIn : this.TOKEN_OPTIONS.accessToken
        });

        return accessToken;
    };

    verifyToken = (token: string): any => {
        try {
            const result = jwt.verify(token, this.secret, this.VERIFY_OPTIONS);

            console.log(result);

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

