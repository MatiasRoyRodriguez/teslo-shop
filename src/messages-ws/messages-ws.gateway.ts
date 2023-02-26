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
	onMessageFromClient(client: Socket, payload: NewMessageDTO) {

		//! Emit only to client
		// client.emit('message-from-server', {
		// 	fullname: 'Test',
		// 	message: payload.message || 'No message'
		// })

		//! Emit to all but the initial customer
		// client.broadcast.emit('message-from-server', {
		// 	fullname: 'Test',
		// 	message: payload.message || 'No message'
		// })

		//! Emit to all 
		this.wss.emit('message-from-server', {
			fullName: 'Test',
			message: payload.message || 'No message'
		})
	}
}
