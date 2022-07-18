/* eslint-disable max-nested-callbacks */
import supertest from 'supertest';
import { v4 } from 'uuid';
import TestFactory, { users, User } from '../../TestFactory';
import validate from '../../../lib/utils/livr';
import app from '../../../index';


const request = supertest.agent(app);
const factory = new TestFactory();

describe('User Show', () => {
    beforeAll(async () => {
        await factory.cleanUp();
        await factory.setDefaultUsers();
    });

    describe('given user not exist', () => {
        it('should return error', () => {
            const id = v4();

            return request
                .get(`/api/v1/users/${id}`)
                .expect(200)
                .then(({ body }) => {
                    expect(body.status).toBe(0);
                    expect(body.error).toEqual({
                        code   : 'NOT_FOUND',
                        fields : {
                            user : 'NOT_FOUND'
                        }
                    });
                });
        });
    });
    describe('given user that exists', () => {
        it('should return user data', async () => {
            const id = users[0].id;

            // Just for test
            const totalUsers = await User.findAll();

            expect(totalUsers.length).toBe(10);

            return request
                .get(`/api/v1/users/${id}`)
                .expect(200)
                .then(({ body }) => {
                    expect(body.status).toBe(1);

                    const expected = {
                        data : [ 'required', { 'nested_object' : {
                            id        : [ 'required', 'uuid' ],
                            email     : [ 'required', 'email' ],
                            username  : [ 'required', 'string' ],
                            firstname : [ 'required', 'string' ],
                            lastname  : [ 'required', 'string' ],
                            createdAt : [ 'required' ],
                            updatedAt : [ 'required' ]
                        } } ]
                    };

                    expect(() => validate(body, expected)).not.toThrow();
                });
        });
    });

    afterAll(async () => {
        await factory.cleanUp();
    });
});

