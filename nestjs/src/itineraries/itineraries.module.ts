import { Module } from '@nestjs/common';
import { ItinerariesService } from './itineraries.service';
import { ItinerariesController } from './itineraries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Itinerary } from './itinerary.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { LocalStrategy } from '../auth/local-strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3d' },
    }),
    TypeOrmModule.forFeature([Itinerary]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [ItinerariesController],
  providers: [
    AuthService,
    LocalStrategy,
    ItinerariesService,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [ItinerariesService, PassportModule],
})
export class ItinerariesModule {}
