import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(8000, {
  transports: ['websocket'],
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger();
  @WebSocketServer()
  public wss = new Server();

  handleConnection(client) {
    this.logger.log('New client connected');
    client.emit('connection', 'Successfully connected to server');
  }

  handleDisconnect() {
    this.logger.log('Client disconnected');
  }
}
