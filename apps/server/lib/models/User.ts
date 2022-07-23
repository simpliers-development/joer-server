import Sequelize, { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { common } from '../types';
import { sequelize } from '../db';
import Base from './Base';


export default class User extends Base<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<common.uuid>;

    declare email: string;

    declare userName: string;

    declare password: string;

    declare firstName: string;

    declare lastName: string;
}


User.init({
    id        : { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    email     : { type: Sequelize.STRING, unique: true, allowNull: false },
    userName  : { type: Sequelize.STRING, unique: true, allowNull: false },
    password  : { type: Sequelize.STRING, allowNull: false },
    firstName : { type: Sequelize.STRING, allowNull: true },
    lastName  : { type: Sequelize.STRING, allowNull: true },

    ...User.sequelizeTimeStampFields
}, {
    paranoid  : true,
    tableName : 'Users',
    modelName : 'User',
    sequelize
});
