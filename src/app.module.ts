import { Module } from '@nestjs/common';
import { GeolocationsModule } from './geolocations/geolocations.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      'mongodb+srv://olehvmikadze:y0r2bwxpE6ipkYsr@cluster0.lwnuv5n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    GeolocationsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
