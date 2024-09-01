
import { Reflector } from '@nestjs/core';
import { USER_TYPES } from './variables/main.variable';

export const UserTypes = Reflector.createDecorator<USER_TYPES[]>();