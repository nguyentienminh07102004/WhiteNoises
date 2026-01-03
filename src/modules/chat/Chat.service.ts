import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Chat } from "./Chat.schema";
import { paginationUtil } from "src/utils/PaginationUtil";

@Injectable()
export class ChatService {
  @InjectModel(Chat.name)
  private readonly chatModel: Model<Chat>;

  async saveMessageChat(message: string, user: string) {
    const messageChat = await this.chatModel.create({
      message,
      user
    });
    return messageChat;
  }

  async getAllMessages(page: number, limit: number) {
    // lấy theo thời gian giảm dần
    const pageable = paginationUtil(page, limit);
    const res = await this.chatModel.find({}, null, {
      limit: pageable.limit,
      skip: pageable.skip,
      sort: { createdAt: "desc" }
    });
    return res;
  }
}
