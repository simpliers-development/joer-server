/* eslint-disable max-nested-callbacks */
import supertest from 'supertest';
import TestFactory, { User } from '../../TestFactory';
import validate from '../../../lib/utils/livr';
import app from '../../../index';

const request = supertest.agent(app);
const factory = new TestFactory();

const newUser = {
    email                : 'email@gmail.com',
    firstName            : 'MyName',
    lastName             : 'MySurname',
    userName             : 'MyUsername',
    password             : 'agz4ndZv',
    passwordConfirmation : 'agz4ndZv'
};

const wrongPassUser = {
    email                : 'newemail@gmail.com',
    firstName            : 'MyName',
    lastName             : 'MySurname',
    userName             : 'newUsername',
    password             : 'agz4ndZv',
    passwordConfirmation : 'wrongPassword'
};

describe('User create', () => {
    beforeAll(async () => {
        try {
            await factory.cleanUp();
        } catch (e) {
            console.error(e);
            throw e;
        }
    });
    describe('given correct user data', () => {
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
    });
    describe('given not unique fields', () => {
        it('should return email not unique error', async () => {
            User.create(newUser);
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
            User.create(newUser);
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
    });
    describe('given missmatching passwords', () => {
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

    afterEach(async () => {
        await factory.cleanUp();
    });

    afterAll(async () => {
        await factory.cleanUp();
    });
});
