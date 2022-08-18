/* eslint-disable max-nested-callbacks */
import supertest from 'supertest';
import TestFactory, { users } from '../../TestFactory';
import validate from '../../../lib/utils/livr';
import app from '../../../index';
import { dumpCreateUser } from '../utils';

const request = supertest.agent(app);
const factory = new TestFactory();

describe('User create', () => {
    beforeAll(async () => {
        try {
            await factory.cleanUp();
            await factory.setUser(dumpCreateUser(users[2]));
        } catch (e) {
            console.error(e);
            throw e;
        }
    });
    describe('given correct user data', () => {
        it('should return a created user', async () => {
            await request
                .post('/api/v1/signup')
                .send(dumpCreateUser(users[0]))
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
    describe('given not unique fields', () => {
        it('should return email not unique error', async () => {
            await request
                .post('/api/v1/signup')
                .send(dumpCreateUser({ ...users[1], email: users[2].email }))
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
                .post('/api/v1/signup')
                .send(dumpCreateUser({ ...users[1], userName: users[2].userName }))
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
    });
    describe('given missmatching passwords', () => {
        it('should return password missmath error', async () => {
            await request
                .post('/api/v1/signup')
                .send({ ...users[1], passwordConfirmation: 'wrongPassword' })
                .expect(200)
                .then(({ body }) => {
                    expect(body.status).toBe(0);

                    const expected = {
                        status : 0,
                        error  : {
                            code   : 'FORMAT_ERROR',
                            fields : {
                                passwordConfirmation : 'FIELDS_NOT_EQUAL'
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
