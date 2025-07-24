import { Module } from "@nestjs/common";
import { MinIOModule } from "../MinIO/MinIO.module";
import { WhiteNoiseController } from "./WhiteNoise.controller";
import { WhiteNoiseService } from "./WhiteNoise.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WhiteNoiseEntity } from "./WhiteNoise";
import { WhiteNoiseLinkEntity } from "./WhiteNoiseLink";

@Module({
    imports: [MinIOModule, TypeOrmModule.forFeature([WhiteNoiseEntity, WhiteNoiseLinkEntity])],
    controllers: [WhiteNoiseController],
    providers: [WhiteNoiseService]
})
export class WhiteNoiseModule {}