import { Module } from "@nestjs/common";
import { ChatService } from "./Chat.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Chat, ChatSchema } from "./Chat.schema";
import { ChatController } from "./chat.controller";

@Module({
    providers: [ChatService],
    controllers: [ChatController],
    exports: [ChatService],
    imports: [MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }])]
})
export class chatModule {}