import Sequelize, { ForeignKey, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../db';
import { common } from '../types';
import Base from './Base';


export class ParticipantsToEvents extends Base<InferAttributes<ParticipantsToEvents>,
    InferCreationAttributes<ParticipantsToEvents>> {
    declare id: common.uuid;

    declare participantId : ForeignKey<common.uuid>;

    declare eventId : ForeignKey<common.uuid>;
}


ParticipantsToEvents.init({
    id            : { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    participantId : {
        type       : Sequelize.UUID,
        onDelete   : 'CASCADE',
        references : {
            model : 'Users',
            key   : 'id'
        },
        allowNull : false
    },
    eventId : {
        type       : Sequelize.UUID,
        onDelete   : 'CASCADE',
        references : {
            model : 'Events',
            key   : 'id'
        },
        allowNull : false
    },
    createdAt : { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    updatedAt : { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
}, {
    tableName : 'ParticipantsToEvents',
    modelName : 'ParticipantsToEvents',
    sequelize
});
