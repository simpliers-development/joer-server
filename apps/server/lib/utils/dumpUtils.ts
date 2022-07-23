import { formatDate } from '@joer/utils';
import { InferAttributes } from 'sequelize/types';
import { User } from '../models';


export const dumpUser = (user: User) : Partial<InferAttributes<User>> => {
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
