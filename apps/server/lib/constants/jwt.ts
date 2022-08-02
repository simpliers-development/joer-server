import { SignOptions, VerifyOptions } from 'jsonwebtoken';

const issuer = 'Simpliers Software';
const subject = 'joer_team@gmail.com';
const audience = 'joer-space.com';

export const SIGN_OPTIONS: SignOptions = {
    issuer,
    subject,
    audience
};

export const VERIFY_OPTIONS: VerifyOptions = {
    issuer,
    subject,
    audience
};

export const TOKEN_OPTIONS = {
    accessToken  : '15m',
    refreshToken : '15d'
};
