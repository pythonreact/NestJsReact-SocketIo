import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator((property: string, context: ExecutionContext) => {
  const ctx = context.getArgByIndex(1);
  return property ? ctx.req.user && ctx.req.user[property] : ctx.req.user;
});
