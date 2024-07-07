import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  GetProfileResponseDTO,
  GetProfileServiceDTO,
} from './dto/get-profile.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getProfile({
    uid,
  }: GetProfileServiceDTO): Promise<GetProfileResponseDTO> {
    return await this.userModel.findById(uid).catch((error) => {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    });
  }
}
