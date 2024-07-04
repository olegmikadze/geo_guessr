import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signUp.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './types/jwtPaylaod.type';
import { Tokens } from './types/tokens.type';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signIn() {}

  async signUp(signUpDto: SignUpDto) {
    const { email, fullName, password, confirmPassword } = signUpDto;

    const userExists = await this.userModel.findOne({ email });
    console.log(
      '🚀 ~ file: auth.service.ts:27 ~ AuthService ~ signUp ~ userExists:',
      userExists,
    );

    if (userExists)
      throw new HttpException(
        'User with such email already exists!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    if (password !== confirmPassword)
      throw new HttpException(
        'Passwords are not matching!',
        HttpStatus.BAD_REQUEST,
      );

    if (!fullName)
      throw new HttpException(
        'Please provide a fullname!',
        HttpStatus.BAD_REQUEST,
      );

    const passwordSalt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(password, passwordSalt);
    console.log(
      '🚀 ~ file: auth.service.ts:51 ~ AuthService ~ signUp ~ hashedPassword:',
      hashedPassword,
    );

    const newUser = await this.userModel
      .create({
        email,
        fullName,
        password: hashedPassword,
      })
      .catch((error) => {
        throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
      });
    console.log(
      '🚀 ~ file: auth.service.ts:67 ~ AuthService ~ signUp ~ newUser:',
      newUser,
    );

    const { accessToken, refreshToken } = await this.getTokens(
      newUser.id,
      newUser.email,
    );

    await this.updateRefreshToken(newUser.email, refreshToken);

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(email, refreshToken) {
    try {
      await this.userModel.findOneAndUpdate({ email }, { refreshToken });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);
    }
  }
  async getTokens(userId: number, email: string): Promise<Tokens> {
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

  logOut() {}

  refreshTokens() {}
}
