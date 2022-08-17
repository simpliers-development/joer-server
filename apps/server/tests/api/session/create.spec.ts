/* eslint-disable max-nested-callbacks */
import supertest from 'supertest';
import TestFactory from '../../TestFactory';
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

describe('User create', () => {
    beforeAll(async () => {
        try {
            await factory.cleanUp();
            await request.post('/api/v1/signup')
                .send(newUser)
                .expect(200);
        } catch (e) {
            console.error(e);
            throw e;
        }
    });
    describe('given correct user data', () => {
        it('should return user and tokens', async () => {
            await request
                .post('/api/v1/signin')
                .send({ email: newUser.email, password: newUser.password })
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
    describe('given not wrong password', () => {
        it('should return wrong error', async () => {
            await request
                .post('/api/v1/signin')
                .send({ email: newUser.email, password: 'wrong' })
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
        it('should return username not unique error', async () => {
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
