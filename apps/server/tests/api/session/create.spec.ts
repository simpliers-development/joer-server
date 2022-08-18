/* eslint-disable max-nested-callbacks */
import supertest from 'supertest';
import TestFactory, { users } from '../../TestFactory';
import validate from '../../../lib/utils/livr';
import app from '../../../index';

const request = supertest.agent(app);
const factory = new TestFactory();

const user = users[0];

describe('User sign in', () => {
    beforeAll(async () => {
        try {
            await factory.cleanUp();
            await factory.setDefaultUsers({ hashPassword: true });
        } catch (e) {
            console.error(e);
            throw e;
        }
    });
    describe('given correct user data', () => {
        it('should return user and tokens', async () => {
            const data = {
                email    : user.email,
                password : user.password
            };

            await request
                .post('/api/v1/signin')
                .send(data)
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
            const data = {
                email    : user.email,
                password : 'wrong'
            };

            await request
                .post('/api/v1/signin')
                .send(data)
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
    describe('given not existing user', () => {
        it('should return user not exist error', async () => {
            const data = {
                email    : 'not_exist@mail.com',
                password : 'doesnt_matter'
            };

            await request
                .post('/api/v1/signin')
                .send(data)
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
