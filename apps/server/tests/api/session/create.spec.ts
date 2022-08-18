/* eslint-disable max-nested-callbacks */
import supertest from 'supertest';
import TestFactory from '../../TestFactory';
import validate from '../../../lib/utils/livr';
import app from '../../../index';

const request = supertest.agent(app);
const factory = new TestFactory();

const userData = {
    email    : 'ujankovsky0@npr.org',
    password : '8QMnxW'
};

describe('User sign up', () => {
    beforeAll(async () => {
        try {
            await factory.cleanUp();
            await factory.setDefaultUsers(true);
        } catch (e) {
            console.error(e);
            throw e;
        }
    });
    describe('given correct user data', () => {
        it('should return user and tokens', async () => {
            await request
                .post('/api/v1/signin')
                .send({ email: userData.email, password: userData.password })
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
    });
    describe('given wrong password', () => {
        it('should return wrong password error', async () => {
            await request
                .post('/api/v1/signin')
                .send({ email: userData.email, password: 'wrong' })
                .expect(200)
                .then(({ body }) => {
                    const expected = {
                        status : 0,
                        error  : {
                            code   : 'WRONG_PASSWORD',
                            fields : {
                                user : 'WRONG_PASSWORD'
                            }
                        }
                    };

                    expect(body).toStrictEqual(expected);
                });
        });
    });
    describe('given wrong password', () => {
        it('should return wrong password error', async () => {
            await request
                .post('/api/v1/signin')
                .send({ email: 'not_exist@mail.com', password: 'doesnt_matter' })
                .expect(200)
                .then(({ body }) => {
                    expect(body.status).toBe(0);

                    const expected = {
                        status : 0,
                        error  : {
                            code   : 'NOT_FOUND',
                            fields : {
                                user : 'NOT_FOUND'
                            }
                        }
                    };

                    expect(body).toStrictEqual(expected);
                });
        });
    });

    afterAll(async () => {
        await factory.cleanUp();
    });
});
