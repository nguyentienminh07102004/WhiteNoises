import { Inject, Logger, UseFilters } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "src/modules/chat/Chat.service";
import { WebsocketExceptionsFilter } from "../filter/ws-exception.filter";

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
@UseFilters(WebsocketExceptionsFilter)
export class WebsocketModule implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;

  @Inject()
  private readonly jwtService: JwtService;
  @Inject()
  private readonly chatService: ChatService;

  afterInit() {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.authorization;
      if (!token) {
        client.disconnect();
        return;
      }
      const data = this.jwtService.verify(token);
      if (data) client.data = data["sub"];
      else {
        client.disconnect();
        return;
      }
    } catch {
      client.emit("exception");
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    Logger.log("Client disconnect with id = ", client.id);
  }

  @SubscribeMessage("chat")
  async sendMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket) {
    const user = client.data;
    await this.chatService.saveMessageChat(message, user);
    this.server.emit("chat");
  }

  @SubscribeMessage("messages")
  async getMessages(@MessageBody("page") page: number, @MessageBody("limit") limit: number) {
    const messages = await this.chatService.getAllMessages(page, limit);
    this.server.emit("messages", messages);
  }
}
