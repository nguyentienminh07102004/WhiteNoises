import { Controller, Get, Inject, Query } from "@nestjs/common";
import { ChatService } from "./Chat.service";

@Controller('chats')
export class ChatController {
    @Inject()
    private readonly chatService: ChatService;

    @Get()
    async getAllMessages(@Query('page') page: number, @Query('limit') limit: number) {
        return this.chatService.getAllMessages(page, limit);
    }
}