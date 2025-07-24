import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { MinIOService } from "../MinIO/MinIO.service";
import { DataSource, W } from "typeorm";
import { WhiteNoiseEntity } from "./WhiteNoise";
import { WhiteNoiseLinkEntity } from "./WhiteNoiseLink";
import { WhiteNoiseCreate } from "./WhiteNoiseCreate.dto";
import { paginationUtil } from "src/utils/PaginationUtil";

@Injectable()
export class WhiteNoiseService {
  @Inject()
  private readonly minioService: MinIOService;
  @Inject()
  private readonly dataSource: DataSource;

  async uploadWhiteNoise(whiteNoiseId: string, files: Array<Express.Multer.File>) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const whiteNoise = await manager.findOneBy<WhiteNoiseEntity>(WhiteNoiseEntity, {
        id: whiteNoiseId
      });
      if (!whiteNoise) {
        throw new BadRequestException();
      }
      const whiteNoiseLinks = files
        .map(async (file) => await this.minioService.upload(file))
        .map(async (fileUpload) => {
          const { url, fileName } = await fileUpload;
          return manager.create(WhiteNoiseLinkEntity, {
            url: url,
            fileName: fileName,
            whiteNoise: whiteNoise
          });
        });
      const whiteNoiseLinkResponses: WhiteNoiseLinkEntity[] = [];
      for (const whiteNoiseLink of whiteNoiseLinks) {
        whiteNoiseLinkResponses.push(await manager.save(await whiteNoiseLink));
      }
      return whiteNoiseLinkResponses;
    });
  }

  async deleteWhiteNoise(fileName: string) {
    await this.minioService.delete(fileName);
  }

  async createWhiteNoise(whiteNoiseCreate: WhiteNoiseCreate) {
    const res = await this.dataSource.transaction(async (manager) => {
      const whiteNoise = manager.create(WhiteNoiseEntity, {
        ...whiteNoiseCreate,
        linkToAudios: []
      });
      return await manager.save(WhiteNoiseEntity, whiteNoise);
    });
    return res;
  }

  async getAllWhiteNoises(page: number = 1, limit: number = 10) {
    const pageable = paginationUtil(page, limit);
    return await this.dataSource.transaction(async (manager) => {
      return await manager
        .getRepository(WhiteNoiseEntity)
        .createQueryBuilder("whitenoises")
        .leftJoinAndSelect("whitenoises.linkToAudios", "links")
        .take(pageable.limit)
        .skip(pageable.skip)
        .getMany();
    });
  }

  async getWhiteNoiseById(id: string) {
    return await this.dataSource.transaction(async (manager) => {
      return await manager
        .getRepository(WhiteNoiseEntity)
        .createQueryBuilder("whitenoises")
        .leftJoinAndSelect("whitenoises.linkToAudios", "links")
        .where("whitenoises.id = :id", { id: id })
        .getOne();
    });
  }
}
