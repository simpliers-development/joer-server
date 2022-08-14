import List from '../services/event/List';
import Create from '../services/event/Create';
import { ServiceRunner } from '../utils/ServiceRunner';


export default {
    list   : ServiceRunner.runService(List, () => ({})),
    create : ServiceRunner.runService(Create, (req) => ({ ...req.body }))
};
