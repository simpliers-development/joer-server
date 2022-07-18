import { formatDate } from '@joer/utils';
import { InferAttributes } from 'sequelize/types';
import { User } from '../models';


export const dumpUser = (user: User) : Partial<InferAttributes<User>> => {
    return {
        id        : user.id,
        email     : user.email,
        username  : user.username,
        firstname : user.firstname,
        lastname  : user.lastname,

        createdAt : formatDate(user.createdAt) as unknown as Date,
        updatedAt : formatDate(user.updatedAt) as unknown as Date
    };
};
