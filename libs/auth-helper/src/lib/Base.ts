import { SignOptions, VerifyOptions } from 'jsonwebtoken';

interface JwtData{
    secret: string,
    issuer: string,
    subject: string,
    audience: string,
    accessExpireTime : string,
    refreshExpireTime: string,
    saltRounds: number
}

export class BaseService {
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
}
