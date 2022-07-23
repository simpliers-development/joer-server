declare module 'confme' {
    export default function confme(p1:string, p2:string): IConfig;
    export interface IConfig {
        'db':{
            'dev': {
                    'name': string,
                    'user': string
                    'host': string
                    'dialect': string
                    'password': string
                    'port': number
            },
            'test': {
                    'name': string
                    'user': string
                    'host': string
                    'dialect': string
                    'password': string
                    'port': number
            },
            'production': {
                    'name': string
                    'user': string
                    'host': string
                    'dialect': string
                    'password': string
                    'port': number
            }
        },
        'app': {
            'port': number
        },
        'jwt': {
            'saltRounds': number
        },
        'email': {
            'host': string
            'port': number
            'auth': {
                'user': string
                'pass': string
            }
        },
        'isTest'?: boolean
    }
}
