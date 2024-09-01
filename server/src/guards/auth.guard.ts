import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UserTypes } from 'src/shared/decorators';
import { USER_TYPES } from 'src/shared/variables/main.variable';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly reflector: Reflector) { }

  canActivate(
    context: GqlExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const ctx = GqlExecutionContext.create(context);
    const token = this.extractTokenFromHeader(ctx)
    if (!token) {
      throw new UnauthorizedException();
    }
    const decoded = this.jwtService.verify(token);
    if (!decoded) {
      throw new UnauthorizedException();
    }

    const userTypes = this.reflector.get(UserTypes, context.getHandler());

    if (userTypes && !userTypes.includes(decoded.userType)) {
      throw new UnauthorizedException();
    }
    console.log({decoded})
    ctx.getContext().req['user'] = decoded;
    return true;
  }

  private extractTokenFromHeader(ctx: GqlExecutionContext,): string | undefined {
    const str = ctx.getContext().req.headers.authorization
    if(!str || str ==="") return undefined;
    const [type, token] = str.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
