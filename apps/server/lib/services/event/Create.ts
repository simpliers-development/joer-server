import moment from 'moment';
import { sequelize } from '../../db';
import { User } from '../../models';
import Event from '../../models/Event';
import { dumpEvent } from '../../utils/dumpUtils';
import Base from './Base';

interface CreateEventPayload {
    name             : string,
    description      : string | null,
    topic            : string,
    isOffline        : boolean
    isPublic         : boolean
    beginDate        : Date | null
    finishDate       : Date | null
    participantLimit : number | null
    isQRNeeded       : boolean
    location         : string
}

export default class EventCreateService extends Base {
    static get validationRules() {
        return {
            name             : [ 'required', 'string' ], // max length
            description      : [ 'string', { default: null } ],
            topic            : [ 'required', 'string' ],
            isOffline        : [ 'boolean', { 'default': true } ],
            isPublic         : [ 'boolean', { 'default': true } ],
            beginDate        : [ 'date' ],
            finishDate       : [ 'date' ],
            participantLimit : [ 'positive_integer', { default: null } ],
            isQRNeeded       : [ 'boolean', { 'default': false } ],
            location         : [ 'required', 'string' ]
        };
    }

    static async execute(data: CreateEventPayload) {
        const transaction = await sequelize.transaction();
        const organizatorId = this.context.user.id;


        try {
            const event = await Event.create({
                name             : data.name,
                description      : data.description,
                topic            : data.topic,
                isOffline        : data.isOffline,
                isPublic         : data.isPublic,
                beginDate        : data.beginDate || moment().toDate(),
                finishDate       : data.beginDate || moment().toDate(),
                location         : data.location,
                participantLimit : data.participantLimit,
                isQRNeeded       : data.isQRNeeded,
                organizatorId
            }, { transaction });

            const users = await User.findAll({ transaction });

            await event.addParticipant(users[0], { transaction });


            await transaction.commit();

            return {
                ...dumpEvent(event)
            };
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }
}
