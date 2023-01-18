import { Request as ExpressRequest } from 'express';
import { PassportSubscriptionContext, PassportContext } from 'graphql-passport';
import { MyUser } from './MyUser.js';

export interface MyContext extends PassportContext<MyUser, ExpressRequest>{}

export interface ProjectSubscriptionContext extends PassportSubscriptionContext<MyUser, ExpressRequest>{}