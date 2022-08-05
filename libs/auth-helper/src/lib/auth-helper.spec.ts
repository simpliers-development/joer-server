import { AuthHelper } from './auth-helper';

const JwtData: any = {
    secret            : 'string',
    issuer            : 'string',
    subject           : 'string',
    audience          : 'string',
    accessExpireTime  : '15m',
    refreshExpireTime : '20m',
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
    it('should generate access and refresh tokens', () => {
        const tokens = authHelper.generateTokens(payload);

        expect(tokens.accessToken).toBeDefined();
        expect(tokens.refreshToken).toBeDefined();
        expect(typeof tokens.accessToken).toEqual('string');
        expect(typeof tokens.refreshToken).toEqual('string');
    });
    it('should generate access token only', () => {
        const token = authHelper.generateAccessToken(payload);

        expect(token).toBeDefined();
        expect(typeof token).toEqual('string');
    });
    it('should verify token', () => {
        const token = authHelper.generateAccessToken(payload);
        const result = authHelper.verifyToken(token);

        expect(result).toBeDefined();
        expect(result.id).toEqual(payload.id);
        expect(result.name).toEqual(payload.name);
    });
    it('should verify password', async () => {
        const password = 'password';
        const hashPassword = await authHelper.hashPassword(password);
        const result = await authHelper.comparePassword(password, hashPassword);

        expect(result).toBeDefined();
        expect(result).toBeTruthy();
    });
    it('should not verify password', async () => {
        const password = 'password';
        const hashPassword = 'someOtherPassword';

        expect(authHelper.comparePassword(password, hashPassword)).rejects.toThrow(Error);
    });
});
