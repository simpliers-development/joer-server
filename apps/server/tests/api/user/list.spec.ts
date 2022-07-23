/* eslint-disable max-nested-callbacks */
import supertest from 'supertest';
import TestFactory, { users } from '../../TestFactory';
import validate from '../../../lib/utils/livr';
import * as dumpUtils from '../../../lib/utils/dumpUtils';
import app from '../../../index';


const request = supertest.agent(app);
const factory = new TestFactory();


describe('User List', () => {
    beforeAll(async () => {
        await factory.cleanUp();
        await factory.setDefaultUsers();
    });

    describe('given list of default users', () => {
        it('should return all users', () => {
            return request
                .get('/api/v1/users')
                .expect(200)
                .then(({ body }) => {
                    expect(body.status).toBe(1);
                    expect(body.data.length).toBe(users.length);
                });
        });

        it('should return dumped users', async () => {
            const dumpUserSpy = jest.spyOn(dumpUtils, 'dumpUser');

            await request
                .get('/api/v1/users')
                .expect(200)
                .then(({ body }) => {
                    expect(body.status).toBe(1);

                    const expected = {
                        data : [ 'required', { 'list_of_objects' : {
                            id        : [ 'required', 'uuid' ],
                            email     : [ 'required', 'email' ],
                            userName  : [ 'required', 'string' ],
                            firstName : [ 'required', 'string' ],
                            lastName  : [ 'required', 'string' ],
                            createdAt : [ 'required' ],
                            updatedAt : [ 'required' ]
                        } } ]
                    };

                    expect(() => validate(body, expected)).not.toThrow();
                });

            expect(dumpUserSpy).toHaveBeenCalled();
        });
    });

    afterAll(async () => {
        await factory.cleanUp();
    });
});
