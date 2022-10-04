import { NextFunction, Request, Response } from 'express';
import Check from '../services/session/Check';
import Create from '../services/session/Create';
import Delete from '../services/session/Delete';
import { dumpUser } from '../utils/dumpUtils';
import { ServiceRunner } from '../utils/ServiceRunner';


export default {
    create : ServiceRunner.runService(Create, (req: Request) => ({ ...req.body })),
    delete : ServiceRunner.runService(Delete, () => ({})),
    check  : async (request: Request, responce: Response, next: NextFunction) => {
        const userData = await ServiceRunner.runService(
            Check,
            (req: Request) => ({ ...req.cookies }),
            {
                isFinal : false
            }
        )(request, responce);

        const user = dumpUser(userData.user);

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
