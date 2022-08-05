import { AuthHelper } from './auth-helper';

const JwtData: any = {
    secret            : 'string',
    issuer            : 'string',
    subject           : 'string',
    audience          : 'string',
    accessExpireTime  : '15m',
    refreshExpireTime : '15d',
    saltRounds        : 3
};

const payload: any = {
    id   : 1,
    name : 'John Doe'
};

let authHelper: AuthHelper;

beforeAll(() => {
    authHelper = new AuthHelper(JwtData);
});

describe('authHelper', () => {
    it('should generate access and refresh tokens', async () => {
        const tokens = await authHelper.generateTokens(payload);

        expect(tokens.accessToken).toBeDefined();
        expect(tokens.refreshToken).toBeDefined();
        expect(tokens.accessToken).toBeInstanceOf(String);
        expect(tokens.refreshToken).toBeInstanceOf(String);
    });
    it('should generate access token only', async () => {
        const token = await authHelper.generateAccessToken(payload);

        expect(token).toBeDefined();
        expect(token).toBeInstanceOf(String);
    });
    it('should verify token', async () => {
        const token = await authHelper.generateAccessToken(payload);
        const result = await authHelper.verifyToken(token);

        expect(result).toBeDefined();
        console.log(result);
    });
});
