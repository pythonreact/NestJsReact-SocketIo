import { AuthService } from './../auth/auth.service';
import {
  SubscribeMessage,
  MessageBody,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseFilters, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { ItinerariesService } from '../itineraries/itineraries.service';
import { BadRequestException } from '@nestjs/common';
import { JwtSocketGuard } from '../common/guards/jwt-socket.guard';
import { SocketExceptionsFilter } from '../common/guards/exceptions/socket-exceptions';

@WebSocketGateway({ cors: { origin: '*' } })
@UseFilters(SocketExceptionsFilter)
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  constructor(
    private readonly socketService: SocketService,
    private itinerariesService: ItinerariesService,
    private authService: AuthService,
  ) {}

  handleConnection(client: Socket): void {
    this.socketService.handleConnection(client);
    this.server.emit('connected', `${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.socketService.handleDisconnection(client);
    this.server.emit('disconnected', `${client.id}`);
  }

  afterInit(server: Server) {}

  @SubscribeMessage('fetchData')
  async handleFetchData(): Promise<void> {
    const response = await this.itinerariesService.getItinerariesAll();
    this.server.emit('responseFetchData', response);
  }

  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('create')
  async handleCreate(@MessageBody() emit: any): Promise<void> {
    const data = emit.data;
    const email = emit.email;
    const response = await this.itinerariesService.createItinerary(data, email);
    this.server.emit('responseCreate', response);
  }

  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('update')
  async handleUpdate(@MessageBody() emit: any): Promise<void> {
    const id = emit.data.id;
    const attrs = emit.data.data;
    const response = await this.itinerariesService.updateItinerary(id, attrs);
    this.server.emit('responseUpdate', response);
  }

  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('delete')
  async handleDelete(@MessageBody() emit: any): Promise<void> {
    const id = emit.data;
    const response = await this.itinerariesService.deleteItinerary(id);
    this.server.emit('responseDelete', response);
  }

  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('listId')
  async handleListId(@MessageBody() emit: any): Promise<void> {
    const id = emit.data;
    const response = await this.itinerariesService.getItineraryId(id);
    this.server.emit('responseListId', response);
  }

  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('bulkDelete')
  async handleBulkDelete(@MessageBody() emit: any): Promise<void> {
    const data = emit.data;
    const response = await this.itinerariesService.deleteBulkItinerary(data);
    this.server.emit('responseBulkDelete', response);
  }

  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('bulkCreate')
  async handleBulkCreate(@MessageBody() emit: any): Promise<void> {
    const email = emit.email;
    const number = emit.data.number;
    const response = await this.itinerariesService.createBulkItinerary(number, email);
    this.server.emit('responseBulkCreate', response);
  }

  @SubscribeMessage('signIn')
  async handleSignIn(@MessageBody() data: any): Promise<void> {
    const user = await this.authService.signIn(data);
    this.server.emit('responseSignIn', user);
  }

  @SubscribeMessage('signOut')
  async handleSignOut(@MessageBody() data: any): Promise<void> {
    this.server.emit('responseSignOut', `User signed out`);
  }

  @SubscribeMessage('signUp')
  async handleSignUp(@MessageBody() data: any): Promise<void> {
    try {
      const token = await this.authService.signUp(data.email, data.password);
      this.server.emit('responseSignUp', token);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
