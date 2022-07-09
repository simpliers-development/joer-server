import { User } from '../models';


export const dumpUser = (user: User) : Partial<User> => {
    return {
        id        : user.id,
        email     : user.email,
        username  : user.username,
        firstname : user.firstname,
        lastname  : user.lastname,

        createdAt : user.createdAt,
        updatedAt : user.updatedAt
    };
};
