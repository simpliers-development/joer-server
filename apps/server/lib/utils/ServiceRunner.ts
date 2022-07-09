/* eslint-disable no-param-reassign */
import { Request, Response } from 'express';
import BaseService from '../services/Base';
import { TypedError } from '../types/error';
import X from '../types/global/X';
import validate from './livr';


type ParamsBuilder = (req: Request) => any;

export class ServiceRunner {
    static runService(service: typeof BaseService, paramsBuilder: ParamsBuilder) {
        return async (req: Request, res: Response) => {
            try {
                const params = paramsBuilder(req);

                service._rawParams = params || {};
                try {
                    let validationResponce = params;

                    if (service.validationRules) {
                        validationResponce = validate(params, service.validationRules);
                    } else {
                        validationResponce = await service.validation(params);
                    }

                    const serviceResponce = await service.execute(validationResponce);

                    return res.json({
                        ...serviceResponce,
                        status : 1
                    });
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
}
