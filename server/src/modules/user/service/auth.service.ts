import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { CounterService } from 'src/modules/counter/counter.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { USER_TYPES } from 'src/shared/variables/main.variable';
import { GraphQLError } from 'graphql';
import { LoginAdminInput } from '../dto/login-amin.input';
import { LoginResponse, User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private readonly counterService: CounterService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async loginAdmin(dto: LoginAdminInput): Promise<LoginResponse> {
    try {
      const user = (await this.userRepo.findOne({
        email: dto.email,
        userType: USER_TYPES.ADMIN,
      })) as unknown as User;

      if (!user) {
        throw new GraphQLError('Invalid email or password', {
          extensions: {
            code: HttpStatus.UNAUTHORIZED,
          },
        });
      }

      const isPasswordValid = await bcrypt.compare(dto.password, user.password);

      if (!isPasswordValid) {
        throw new GraphQLError('Invalid email or password', {
          extensions: {
            code: HttpStatus.UNAUTHORIZED,
          },
        });
      }

      const token = this.jwtService.sign({
        userId: user._id,
        email: user.email,
        userType: USER_TYPES.ADMIN,
      });

      return {
        message: 'Login successful',
        token: token,
        user: user,
      };
    } catch (error) {
      throw new GraphQLError(error.message ?? 'Login failed', {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }
}
