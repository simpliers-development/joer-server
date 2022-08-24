import { Request } from 'express';
import { ServiceRunner } from '../utils/ServiceRunner';
import Test from '../services/mail/Test';

export default {
    test : ServiceRunner.runService(Test, (req: Request) => ({ ...req.body }))
};
