import { NextFunction, Request, Response } from 'express';
import Check from '../services/session/Check';
import { dumpUser } from '../utils/dumpUtils';
import { ServiceRunner } from '../utils/ServiceRunner';


export default {
    check : async (request: Request, responce: Response, next: NextFunction) => {
        const userData = await ServiceRunner.runService(
            Check,
            (req: Request) => ({ token: req?.cookies?.token }),
            {
                isFinal : false
            }
        )(request, responce);

        const user = dumpUser(userData);

        ServiceRunner.setContext({
            user : {
                id       : user.id,
                email    : user.email,
                userName : user.userName
            }
        });

        next();
    }
};
