import users from '../fixtures/users.json';
import { sequelize } from '../lib/db';
import { User } from '../lib/models';


export {
    users,
    User,
    sequelize
};

export default class TestFactory {
    public async cleanUp() {
        await this.dropDatabase();
    }

    private async dropDatabase() {
        const tables = [
            'Users'
        ];

        await sequelize.query(`TRUNCATE TABLE ${tables.map(m => `"${m}"`).join(', ')} restart identity CASCADE;`);
    }

    setDefaultUsers(): Promise<User[]> | undefined {
        try {
            return User.bulkCreate(users.map(u => ({
                id        : u.id,
                email     : u.email,
                userName  : u.userName,
                password  : u.password,
                firstName : u.password,
                lastName  : u.lastName,
                createdAt : u.createdAt as unknown as Date,
                updatedAt : u.updatedAt as unknown as Date
            })));
        } catch (e) {
            console.log(e);
        }

        return;
    }
}

