import { Injectable } from '@nestjs/common';
import * as ws from 'websocket';
import * as securitiesIds from 'src/files/securities-ids.json';

@Injectable()
export class WebSocketService {
  /**
   * este metodo connecta a 'wss://test-algobalanz.herokuapp.com/ws/str' y retorna las posibles securities ids validandolas
   */
  getSecuritiesIds() {
    const WebSocketClient = ws.client;
    const client = new WebSocketClient();
    const securitiesIdsArray = [...securitiesIds.securitiesIds.response];
    client.connect('wss://test-algobalanz.herokuapp.com/ws/str');
    client.on('connectFailed', function (error) {
      console.log('Connect Error: ' + error.toString());
    });
    client.on('connect', async function (connection) {
      console.log('WebSocket Client Connected');

      connection.on('error', function (error) {
        console.log('Connection Error: ' + error.toString());
      });
      connection.on('close', function () {
        console.log('echo-protocol Connection Closed');
      });
      connection.on('message', ({ utf8Data }) => {
        const data = JSON.parse(utf8Data);
        securitiesIdsArray.forEach((item) => {
          if (item.trim() == data.msg.securityID.trim()) {
            Object.assign(item, data.msg);
          }
        });
      });
    });
    return securitiesIdsArray;
  }
}
