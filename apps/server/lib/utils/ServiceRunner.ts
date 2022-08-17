/* eslint-disable no-param-reassign */
import { Request, Response } from 'express';
import { DEFAULT_COOKIE_OPTS } from '../constants/cookies';
import BaseService from '../services/Base';
import { TypedError } from '../types/error';
import X from '../types/global/X';
import validate from './livr';


type ParamsBuilder = (req: Request) => any;

interface IRunnerOptions {
    isFinal?: boolean
}


export class ServiceRunner {
    static runService(service: typeof BaseService, paramsBuilder: ParamsBuilder, {
        isFinal = true
    }: IRunnerOptions = {}) {
        return async (req: Request, res: Response) => {
            try {
                const params = paramsBuilder(req);

                service._rawParams = params || {};
                try {
                    let validationResponce = params;

                    if (service.validationRules) {
                        validationResponce = validate(params, service.validationRules);
                    }

                    if (service.validation) {
                        validationResponce = await service.validation(params);
                    }

                    const serviceResponce = await service.execute(validationResponce);

                    const cookies = service.cookies(serviceResponce);

                    cookies.forEach(cookie => {
                        res.cookie(cookie.name, cookie.value, DEFAULT_COOKIE_OPTS);
                    });

                    if (isFinal) {
                        return res.json({
                            ...serviceResponce,
                            status : 1
                        });
                    }

                    return serviceResponce;
                } catch (e : unknown) {
                    if (e instanceof TypedError) {
                        if (Object.keys(service.errors).includes(e.type)) {
                            service.errors[e.type]({ type: e.type, data: e.payload });
                        }
                    }

                    throw e;
                }
            } catch (e: unknown) {
                if (e instanceof X) {
                    if (e.code) {
                        return res.json({
                            status : 0,
                            error  : {
                                ...e
                            }
                        });
                    }
                }

                if (e instanceof Error) {
                    console.info('An error occured. Details:');
                    console.error(JSON.stringify({
                        service : service.constructor.name,
                        error   : { ...e },
                        params  : service._rawParams,
                        stack   : e.stack,
                        message : e.message
                    }));
                }

                return res.json({
                    status : 0,
                    error  : {
                        code    : 'UNKNOWN_ERROR',
                        fields  : {},
                        message : 'Please, contact your system administrator'
                    }
                });
            }
        };
    }

    static setContext(payload: any) {
        BaseService.context = payload;
    }

    static getContext() {
        return BaseService.context;
    }
}
