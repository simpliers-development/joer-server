import List from '../services/event/List';
import { ServiceRunner } from '../utils/ServiceRunner';


export default {
    list : ServiceRunner.runService(List, () => ({}))
};
