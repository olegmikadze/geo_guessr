import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signUp.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './types/jwtPayload.type';
import { Tokens } from './types/tokens.type';
import { bcryptHash } from 'utils/bcrypt';
import { SignJwtTokens } from './types/signJwtTokens.type';
import { SignInDto } from './dto/signIn.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signUp({ email, fullName, password, confirmPassword }: SignUpDto) {
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
        throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
      });

    const { accessToken, refreshToken } = await this.signJwtTokens({
      userId: newUser.id,
      email: newUser.email,
    });

    await this.updateRefreshToken(newUser.email, refreshToken);

    return { accessToken, refreshToken };
  }

  async signIn({ email, password }: SignInDto): Promise<Tokens> {
    const signInUser = await this.userModel.findOne({ email });

    if (!signInUser) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    const correctPassword = await bcrypt.compare(password, signInUser.password);

    if (!correctPassword)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    const { accessToken, refreshToken } = await this.signJwtTokens({
      userId: signInUser.id,
      email: signInUser.email,
    });

    await this.updateRefreshToken(signInUser.email, refreshToken);

    return { accessToken, refreshToken };
  }

  async logOut() {}

  async refreshTokens() {}

  async updateRefreshToken(email, refreshToken) {
    try {
      const hashedRefreshToken = await bcryptHash(refreshToken);
      await this.userModel.findOneAndUpdate(
        { email },
        { refreshToken: hashedRefreshToken },
      );
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_GATEWAY);
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
