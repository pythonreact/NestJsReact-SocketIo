import { ItinerariesModule } from './../itineraries/itineraries.module';
import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Itinerary } from '../itineraries/itinerary.entity';
import { User } from '../users/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ItinerariesModule,
    TypeOrmModule.forFeature([Itinerary]),
    TypeOrmModule.forFeature([User]),
  ],

  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
