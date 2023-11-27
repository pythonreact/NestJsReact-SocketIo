import { CanActivate, ExecutionContext } from '@nestjs/common';

export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request.session.something;
  }
}
