import { AuthHelper } from '@joer/auth-helper';
import { CreationAttributes } from 'sequelize/types/model';
import users from '../fixtures/users.json';
import config from '../lib/config';
import { sequelize } from '../lib/db';
import { User } from '../lib/models';


export {
    users,
    User,
    sequelize
};

export default class TestFactory {
    public authHelper = new AuthHelper(config.jwt);

    public async cleanUp() {
        await this.dropDatabase();
    }

    private async dropDatabase() {
        const tables = [
            'Users'
        ];

        await sequelize.query(`TRUNCATE TABLE ${tables.map(m => `"${m}"`).join(', ')} restart identity CASCADE;`);
    }

    async setDefaultUsers({ hashPassword = false } = {}): Promise<User[] | undefined> {
        try {
            const userMap = await Promise.all(users.map(async u => ({
                id        : u.id,
                email     : u.email,
                userName  : u.userName,
                password  : hashPassword ? await this.authHelper.hashPassword(u.password) : u.password,
                firstName : u.password,
                lastName  : u.lastName,
                createdAt : u.createdAt as unknown as Date,
                updatedAt : u.updatedAt as unknown as Date
            })));

            return User.bulkCreate(userMap);
        } catch (e) {
            console.log(e);
        }

        return;
    }

    async setUser(user: CreationAttributes<User>, hashPassword = false): Promise<User> {
        try {
            const newUser = {
                id        : user.id,
                email     : user.email,
                userName  : user.userName,
                password  : hashPassword ? await this.authHelper.hashPassword(user.password) : user.password,
                firstName : user.password,
                lastName  : user.lastName,
                createdAt : user.createdAt as unknown as Date,
                updatedAt : user.updatedAt as unknown as Date
            };

            return User.create(newUser);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}

