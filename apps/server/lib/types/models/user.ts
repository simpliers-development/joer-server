import { Optional } from 'sequelize/types';
import { uuid } from '../common';
import { IBaseAttributes, IBaseCreate } from './base';

export interface IUserAttributes {
    id: uuid;
    email: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
}

type IUserAttributesCreate = Optional<IUserAttributes, 'id'>

export interface IUser extends IBaseAttributes, IUserAttributes {}
export interface IUserCreate extends IBaseCreate, IUserAttributesCreate {}
