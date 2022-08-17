import Sequelize, { Association, BelongsToManyGetAssociationsMixin, CreationOptional, HasManyGetAssociationsMixin, InferAttributes, InferCreationAttributes } from 'sequelize';
import { common } from '../types';
import { sequelize } from '../db';
import Base from './Base';
import Event from './Event';


export default class User extends Base<InferAttributes<User>, InferCreationAttributes<User>> {
    static initRelation(): void {
        this.hasMany(Event, {
            as         : 'OrganizedEvents',
            foreignKey : {
                name      : 'organizatorId',
                allowNull : false
            },
            onDelete : 'CASCADE'
        });

        this.belongsToMany(Event, {
            as         : 'Events',
            through    : 'ParticipantsToEvents',
            foreignKey : {
                name      : 'participantId',
                allowNull : false
            }
        });
    }

    declare id: CreationOptional<common.uuid>;

    declare email: string;

    declare userName: string;

    declare password: string;

    declare firstName: string;

    declare lastName: string;

    declare static associations: {
        OrganizedEvents: Association<User, Event>,
        Events: Association<User, Event>,
    };

    declare getOrganizedEvents: HasManyGetAssociationsMixin<Event>;

    declare getEvents: BelongsToManyGetAssociationsMixin<Event>;
}

User.init({
    id        : { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    email     : { type: Sequelize.STRING, unique: true, allowNull: false },
    userName  : { type: Sequelize.STRING, unique: true, allowNull: false },
    password  : { type: Sequelize.STRING, allowNull: false },
    firstName : { type: Sequelize.STRING, allowNull: true },
    lastName  : { type: Sequelize.STRING, allowNull: true },

    ...User.sequelizeAllTimeStamps
}, {
    paranoid  : true,
    tableName : 'Users',
    modelName : 'User',
    sequelize
});
