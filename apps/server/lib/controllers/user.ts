import { Request } from 'express';
import Create from '../services/user/Create';
import Delete from '../services/user/Delete';
import List from '../services/user/List';
import Show from '../services/user/Show';
import Update from '../services/user/Update';
import Test from '../services/user/Test';
import { ServiceRunner } from '../utils/ServiceRunner';


export default {
    list   : ServiceRunner.runService(List, () => ({})),
    show   : ServiceRunner.runService(Show, (req: Request) => ({ id: req.params.id })),
    delete : ServiceRunner.runService(Delete, (req: Request) => ({ id: req.params.id })),
    create : ServiceRunner.runService(Create, (req: Request) => ({ ...req.body })),
    update : ServiceRunner.runService(Update, (req: Request) => ({ ...req.body, id: req.params.id })),
    test   : ServiceRunner.runService(Test, (req: Request) => ({ ...req.body }))
};
