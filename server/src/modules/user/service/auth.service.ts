import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { CounterService } from 'src/modules/counter/counter.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { STATUS_NAMES, USER_TYPES } from 'src/shared/variables/main.variable';
import { GraphQLError } from 'graphql';
import { LoginAdminInput, OtpVerifyTokenInput } from '../dto/login-amin.input';
import {
  LoginResponse,
  PhoneVerifyEntity,
  User,
  UserTokenResponse,
} from '../entities/user.entity';
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

  async checkUserExistence(phoneNumber: string): Promise<PhoneVerifyEntity> {
    try {
      const user = await this.userRepo.findOne({
        phoneNumber,
        userType: USER_TYPES.USER,
        status: STATUS_NAMES.ACTIVE,
      });
      if (!user) {
        return {
          exists: false,
          message: 'No user found with the provided phone number.',
        };
      }
      if (!user.isActive) {
        return {
          exists: false,
          message: 'User not activated with the provided phone number.',
        };
      }

      return {
        exists: true,
        message: 'User existed  with the provided phone number.',
      };
    } catch (error) {
      throw new GraphQLError('Error checking user existence', {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }

  async verifyLogin(dto: OtpVerifyTokenInput): Promise<UserTokenResponse> {
    try {
      // TODO: verify login with firebase
      // Logic to verify the token and userId
      // const isValidToken = this.validateToken(token, userId); // Assuming validateToken is a method that checks the token validity

      // if (!isValidToken) {
      //   return {
      //     message: 'Invalid token or user ID.',
      //     accessToken: '',
      //     refreshToken: '',
      //     loginStatus: false,
      //   };
      // }

      // Generate new access and refresh tokens
      const accessToken = this.jwtService.sign({
        userId: dto.userId,
        userType: USER_TYPES.USER,
      });
      const refreshToken = this.jwtService.sign({
        userId: dto.userId,
        userType: USER_TYPES.USER,
      });

      return {
        message: 'Login verified successfully.',
        accessToken: accessToken,
        refreshToken: refreshToken,
        loginStatus: true,
      };
    } catch (error) {
      throw new GraphQLError('Error verifying login', {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }
}
