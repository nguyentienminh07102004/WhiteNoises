import { Module } from "@nestjs/common";
import { TagController } from "./tag.controller";
import { TagService } from "./tag.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagEntity } from "./tag.entity";

@Module({
    providers: [TagService],
    controllers: [TagController],
    imports: [TypeOrmModule.forFeature([TagEntity])]
})
export class TagModule {}