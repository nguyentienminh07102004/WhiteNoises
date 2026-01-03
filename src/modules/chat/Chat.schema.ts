import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Date, HydratedDocument } from "mongoose";

export type CatDocument = HydratedDocument<Chat>;

@Schema({
  timestamps: true
})
export class Chat {
  @Prop()
  message: string;

  @Prop()
  user: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);