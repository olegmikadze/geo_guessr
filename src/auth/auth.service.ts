/* eslint-disable prettier/prettier */
import { LogOutServiceDTO } from './dto/logout.dto';
import { SignUpDTO } from './dto/signup.dto';
import { JwtPayload } from './types/jwt-payload.type';
import { SignInDTO } from './dto/signin.dto';
import { Tokens } from './types/tokens.type';
import { SignJwtTokens } from './types/sign-jwt-tokens.type';
import { LogOutResponse } from './types/logout.types';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateRefreshToken } from './types/update-refresh-token.type';
import { HttpException, HttpStatus, Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { bcryptHash } from 'utils/bcrypt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService implements OnApplicationShutdown {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  onApplicationShutdown(signal?: string) {
    this.logger.log(signal);
  }

  async signUp({ email, fullName, password, confirmPassword }: SignUpDTO): Promise<Tokens> {
    const userExists = await this.userModel.findOne({ email });

    if (userExists)
      throw new HttpException(
        'User with such email already exists!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    if (password !== confirmPassword)
      throw new HttpException('Incorrect password!', HttpStatus.BAD_REQUEST);

    const hashedPassword = await bcryptHash(password);

    const newUser = await this.userModel
      .create({
        email,
        fullName,
        password: hashedPassword,
      })
      .catch((error) => {
        this.logger.error(error)
        throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
      });

    const { accessToken, refreshToken } = await this.signJwtTokens({
      userId: newUser.id,
      email: newUser.email,
    });

    await this.updateRefreshToken({ _id: newUser.id, refreshToken });

    return { accessToken, refreshToken };
  }

  async signIn({ email, password }: SignInDTO): Promise<Tokens> {
    const signInUser = await this.userModel.findOne({ email }).catch(error => {
      this.logger.error(error);
    });

    if (!signInUser) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    const correctPassword = await bcrypt.compare(password, signInUser.password);

    if (!correctPassword)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    const { accessToken, refreshToken } = await this.signJwtTokens({
      userId: signInUser.id,
      email: signInUser.email,
    });

    await this.updateRefreshToken({ _id: signInUser.id, refreshToken });

    return { accessToken, refreshToken };
  }

  async logOut({ userId }: LogOutServiceDTO): Promise<LogOutResponse> {
    const logOutUser = await this.userModel
      .findById(userId)
      .catch((error) => {
        this.logger.error(error);
        throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
      });

    if (!logOutUser)
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    // together with removing access token from localStorage on frontend
    await this.userModel
      .updateOne(
        { _id: logOutUser._id },
        { refreshToken: '' },
      )
      .catch((error) => {
        this.logger.error(error);
        throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
      });

    return { status: HttpStatus.OK, message: 'OK' };
  }

  async refreshToken({ userId, refreshToken }: RefreshTokenDto): Promise<Tokens> {
    const refreshUser = await this.userModel
      .findById(userId)
      .catch((error) => {
        this.logger.error(error);
        throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
      });;

    if (!refreshUser || !refreshUser.refreshToken)
      throw new HttpException(
        'FORBIDDEN',
        HttpStatus.FORBIDDEN,
      );

    const refreshCorrect = await bcrypt.compare(
      refreshToken,
      refreshUser.refreshToken,
    );
    
    if (!refreshCorrect) throw new HttpException(
      'FORBIDDEN',
      HttpStatus.FORBIDDEN,
    );

    const tokens = await this.signJwtTokens({ userId: refreshUser.id, email: refreshUser.email });
    await this.updateRefreshToken({ _id: refreshUser.id, refreshToken: tokens.refreshToken });

    return tokens;
  }

  async updateRefreshToken({ _id, refreshToken }: UpdateRefreshToken): Promise<void> {
    try {
      const hashedRefreshToken = await bcryptHash(refreshToken);
      await this.userModel.findOneAndUpdate(
        { _id },
        { refreshToken: hashedRefreshToken },
      );
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async signJwtTokens({ userId, email }: SignJwtTokens): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('ACCESS_SECRET'),
        expiresIn: this.config.get<number>('EXPIRES_IN_15M'),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('REFRESH_SECRET'),
        expiresIn: this.config.get<number>('EXPIRES_IN_7D'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
