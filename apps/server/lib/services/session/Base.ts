import { AuthHelper } from '@joer/auth-helper';
import config from '../../config';
import Base from '../Base';

export default class BaseAuthService extends Base {
    static helper =
        new AuthHelper({ ...config.jwt, accessExpiresIn: config.jwt.access, refreshExpiresIn: config.jwt.refresh });
}
