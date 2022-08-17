import { Request } from 'express';
import Check from '../services/session/Check';
import Create from '../services/session/Create';
import { ServiceRunner } from '../utils/ServiceRunner';


export default {
    create : ServiceRunner.runService(Create, (req: Request) => ({ ...req.body })),
    check  : ServiceRunner.runService(Check, (req: Request) => ({ token: req.cookies.accessToken }))
};
