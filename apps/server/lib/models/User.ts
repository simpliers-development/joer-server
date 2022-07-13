import Sequelize from 'sequelize';
import { user, common } from '../types';
import { sequelize } from '../db';
import Base from './Base';


export default class User extends Base<user.IUser, user.IUserCreate> {
    declare id: common.uuid;

    declare email: string;

    declare username: string;

    declare password: string;

    declare firstname: string;

    declare lastname: string;
}


User.init({
    id        : { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    email     : { type: Sequelize.STRING, unique: true, allowNull: false },
    username  : { type: Sequelize.STRING, unique: true, allowNull: false },
    password  : { type: Sequelize.STRING, allowNull: false },
    firstname : { type: Sequelize.STRING, allowNull: true },
    lastname  : { type: Sequelize.STRING, allowNull: true },

    ...User.sequelizeTimeStampFields
}, {
    paranoid  : true,
    tableName : 'Users',
    sequelize
});
