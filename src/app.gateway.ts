import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';

@WebSocketGateway(8080, {
  transport: ['websocket'],
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  wss;

  private logger = new Logger('AppGateway');
  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(client) {
    this.logger.log('New client connected');
    client.emit('connection', 'Successfully connected to server');
  }

  handleDisconnect() {
    this.logger.log('Client disconnected');
  }
}
