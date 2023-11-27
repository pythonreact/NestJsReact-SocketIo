import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Itinerary } from '../itineraries/itinerary.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SocketService {
  constructor(@InjectRepository(Itinerary) private repo: Repository<Itinerary>) {}
  private readonly connectedClients: Map<string, Socket> = new Map();

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);
  }

  handleDisconnection(socket: Socket): void {
    const clientId = socket.id;
    this.connectedClients.delete(clientId);
  }
}
