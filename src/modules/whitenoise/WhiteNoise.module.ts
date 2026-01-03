import { Module } from "@nestjs/common";
import { MinIOModule } from "../MinIO/MinIO.module";
import { WhiteNoiseController } from "./WhiteNoise.controller";
import { WhiteNoiseService } from "./WhiteNoise.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WhiteNoiseEntity } from "./WhiteNoise.entity";
import { WhiteNoiseLinkEntity } from "./WhiteNoiseLink.entity";
import { TagEntity } from "../tags/tag.entity";

@Module({
    imports: [MinIOModule, TypeOrmModule.forFeature([WhiteNoiseEntity, WhiteNoiseLinkEntity, TagEntity])],
    controllers: [WhiteNoiseController],
    providers: [WhiteNoiseService]
})
export class WhiteNoiseModule {}