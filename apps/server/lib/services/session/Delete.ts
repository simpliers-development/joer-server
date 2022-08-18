import Base from './Base';

export default class SessionDeleteService extends Base {
    static cookies = () => {
        return [
            {
                name  : 'accessToken',
                value : ''
            },
            {
                name  : 'refreshToken',
                value : ''
            }
        ];
    };
}
