import { formatDate } from '@joer/utils';
import { InferAttributes } from 'sequelize/types';
import { User } from '../models';
import Event from '../models/Event';


export const dumpUser = (user: User) => {
    return {
        id        : user.id,
        email     : user.email,
        userName  : user.userName,
        firstName : user.firstName,
        lastName  : user.lastName,

        createdAt : formatDate(user.createdAt) as unknown as Date,
        updatedAt : formatDate(user.updatedAt) as unknown as Date
    };
};

export const dumpEvent = (event: Event) => {
    return {
        id               : event.id,
        name             : event.name,
        description      : event.description,
        topic            : event.topic,
        isOffline        : event.isOffline,
        isPublic         : event.isPublic,
        beginDate        : event.beginDate,
        finishDate       : event.finishDate,
        participantLimit : event.participantLimit,
        isQRNeeded       : event.isQRNeeded,
        location         : event.location,

        createdAt : formatDate(event.createdAt) as unknown as Date,
        updatedAt : formatDate(event.updatedAt) as unknown as Date
    };
};

export const dumpTokenData = (user: User) : Partial<InferAttributes<User>> => {
    return {
        id : user.id
    };
};
