import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SubscribeMessage } from '@nestjs/websockets/decorators';
import { Socket, Server } from 'socket.io';
import { NewMessageDTO } from './dtos/new-message.dto';
import { MessagesWsService } from './messages-ws.service';
@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() wss: Server;

	constructor(private readonly messagesWsService: MessagesWsService) {
	}

	handleConnection(client: Socket) {
		this.messagesWsService.registerClient(client);
		this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
	}
	handleDisconnect(client: Socket) {
		this.messagesWsService.removeClient(client.id);
		this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
	}

	@SubscribeMessage('message-from-client')
	onMessageFromClient( client: Socket, payload: NewMessageDTO){
			console.log(client.id, payload);
	}
}
