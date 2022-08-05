import supertest from 'supertest';
import TestFactory from '../../TestFactory';
import validate from '../../../lib/utils/livr';
import app from '../../../index';

const request = supertest.agent(app);
const factory = new TestFactory();

const newUser: any = {
    email           : 'email@gmail.com',
    firstName       : 'MyName',
    lastName        : 'MySurname',
    userName        : 'MyUsername',
    password        : 'agz4ndZv',
    confirmPassword : 'agz4ndZv'
};

const wrongPassUser: any = {
    email           : 'newemail@gmail.com',
    firstName       : 'MyName',
    lastName        : 'MySurname',
    userName        : 'newUsername',
    password        : 'agz4ndZv',
    confirmPassword : 'wrongPassword'
};


beforeAll(async () => {
    try {
        await factory.cleanUp();
    } catch (e) {
        console.error(e);
        throw e;
    }
});

describe('User create', () => {
    it('should return create a user', async () => {
        await request
            .post('/api/v1/users')
            .send(newUser)
            .expect(200)
            .then(({ body }) => {
                expect(body.status).toBe(1);

                const expected = {
                    data : [ 'required', { 'nested_object' : {
                        id        : [ 'required', 'string' ],
                        email     : [ 'required', 'email' ],
                        userName  : [ 'required', 'string' ],
                        firstName : [ 'required', 'string' ],
                        lastName  : [ 'required', 'string' ],
                        createdAt : [ 'required' ],
                        updatedAt : [ 'required' ]
                    } } ],
                    accessToken  : [ 'required', 'string' ],
                    refreshToken : [ 'required', 'string' ],
                    status       : [ 'required', 'integer' ]
                };

                expect(() => validate(body, expected)).not.toThrow();
            });
    });
    it('should return email not unique error', async () => {
        await request
            .post('/api/v1/users')
            .send(newUser)
            .expect(200)
            .then(({ body }) => {
                const expected = {
                    status : 0,
                    error  : {
                        fields : { email: 'NOT_UNIQUE' },
                        code   : 'NOT_UNIQUE'
                    }
                };

                expect(body).toStrictEqual(expected);
            });
    });
    it('should return username not unique error', async () => {
        await request
            .post('/api/v1/users')
            .send({ ...newUser, email: 'new@email.com' })
            .expect(200)
            .then(({ body }) => {
                expect(body.status).toBe(0);

                const expected = {
                    status : 0,
                    error  : {
                        fields : { userName: 'NOT_UNIQUE' },
                        code   : 'NOT_UNIQUE'
                    }
                };

                expect(body).toStrictEqual(expected);
            });
    });
    it('should return password missmath error', async () => {
        await request
            .post('/api/v1/users')
            .send(wrongPassUser)
            .expect(200)
            .then(({ body }) => {
                expect(body.status).toBe(0);

                const expected = {
                    status : 0,
                    error  : {
                        fields : { password        : 'INVALID',
                            confirmPassword : 'INVALID' },
                        code : 'AUTHENTICATION_FAILED'
                    }
                };

                expect(body).toStrictEqual(expected);
            });
    });

    afterAll(async () => {
        await factory.cleanUp();
    });
});
