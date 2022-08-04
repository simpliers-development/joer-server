import { Request } from 'express';
import Check from '../services/session/Check';
import { ServiceRunner } from '../utils/ServiceRunner';


export default {
    check : ServiceRunner.runService(Check, (req: Request) => ({ token: req.cookies.token }))
};
