import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { GraphQLError } from 'graphql';
import { Observable } from 'rxjs';
import { UserTypes } from 'src/shared/decorators';
import { USER_TYPES } from 'src/shared/variables/main.variable';

interface DecodedTokenData {
  userType: USER_TYPES;
  userId: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: GqlExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    console.log('Token verifying');
    try {
      const userTypes = this.reflector.get(UserTypes, context.getHandler());
      console.log({ userTypes });
      const token = this.extractTokenFromHeader(ctx);

      if (userTypes && userTypes.includes(USER_TYPES.PUBLIC)) {
        console.log('it is true');
        return true;
      }
      console.log('this is not public');

      console.log({ token });
      if (!token) {
        throw new UnauthorizedException();
      }

      const decoded: DecodedTokenData = this.jwtService.verify(token);
      console.log({ decoded });
      if (!decoded) {
        console.log('decode failed');
        throw 'Token Verification Failed';
      }

      if (userTypes && !userTypes.includes(decoded.userType)) {
        console.log('decode user types difffrent');

        throw 'This User dosn`t have permission to access this request';
      }
      console.log({ decoded });
      ctx.getContext().req['user'] = decoded as DecodedTokenData;
      return true;
    } catch (error) {
      console.log({ error });
      throw new GraphQLError(error + ' ', {
        extensions: {
          code: HttpStatus.UNAUTHORIZED,
        },
      });
    }
  }

  private extractTokenFromHeader(ctx: GqlExecutionContext): string | undefined {
    const str = ctx.getContext().req.headers.authorization;
    if (!str || str === '') return undefined;
    const [type, token] = str.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
