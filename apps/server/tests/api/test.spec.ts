import supertest from 'supertest';
import app from '../../index';

const request = supertest.agent(app);

describe("isArray util", () => {
    it("Should run tests", () => {
        return request
            .get('/api/v1/users')
            .then(({ body }) => {
                console.log(body);
                
            })
    });
});