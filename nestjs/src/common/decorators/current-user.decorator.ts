import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { DECORATORS } from '@nestjs/swagger/dist/constants';

export const CurrentUser = createParamDecorator(
  (property: string, context: ExecutionContext) => {
    const ctx = context.getArgByIndex(1);
    return property ? ctx.req.user && ctx.req.user[property] : ctx.req.user;
  },
  [
    (target, key, index) => {
      // Define query parameter for swagger
      const explicit = Reflect.getMetadata(DECORATORS.API_PARAMETERS, target[key]) ?? [];
      Reflect.defineMetadata(
        DECORATORS.API_PARAMETERS,
        [
          ...explicit,
          {
            description: 'Email of User',
            name: '@CurrentUser',
            required: false,
            type: 'email',
          },
        ],
        target[key],
      );
    },
  ],
);
