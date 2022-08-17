import Sequelize, { BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes } from 'sequelize';
import { common } from '../types';
import { sequelize } from '../db';
import Base from './Base';
import User from './User';


export default class Event extends Base<InferAttributes<Event>, InferCreationAttributes<Event>> {
    static initRelation() {
        Event.belongsTo(User, {
            as         : 'Organizator',
            foreignKey : {
                name      : 'organizatorId',
                allowNull : false
            },
            onDelete : 'CASCADE'
        });

        Event.belongsToMany(User, {
            as         : 'Participants',
            through    : 'ParticipantsToEvents',
            foreignKey : {
                name      : 'eventId',
                allowNull : false
            }
        });
    }

    declare id: CreationOptional<common.uuid>;

    declare name: string;

    declare description: string | null;

    declare topic: string;

    declare isOffline: CreationOptional<boolean>; // default true

    declare isPublic: CreationOptional<boolean>; // default is true

    declare beginDate: Date;

    declare finishDate: Date;

    declare participantLimit: number | null;

    declare isQRNeeded: CreationOptional<boolean>; // default is false

    declare location: string;

    declare organizatorId: ForeignKey<common.uuid>;

    declare addParticipant: BelongsToManyAddAssociationMixin<User, common.uuid>;
}


Event.init({
    id               : { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    name             : { type: Sequelize.STRING, allowNull: false },
    description      : { type: Sequelize.TEXT, allowNull: true },
    topic            : { type: Sequelize.STRING, allowNull: false },
    isOffline        : { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    isPublic         : { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    beginDate        : { type: Sequelize.DATE, allowNull: false },
    finishDate       : { type: Sequelize.DATE, allowNull: false },
    participantLimit : { type: Sequelize.INTEGER, allowNull: true },
    isQRNeeded       : { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    location         : { type: Sequelize.STRING, allowNull: false },

    organizatorId : {
        type       : Sequelize.UUID,
        onDelete   : 'CASCADE',
        references : {
            model : 'Users',
            key   : 'id'
        },
        allowNull : false
    },

    ...Event.sequelizeAllTimeStamps
}, {
    paranoid  : true,
    tableName : 'Events',
    modelName : 'Event',
    sequelize
});
