import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { MinIOService } from "../MinIO/MinIO.service";
import { DataSource, W } from "typeorm";
import { WhiteNoiseLinkEntity } from "./WhiteNoiseLink.entity";
import { WhiteNoiseCreate } from "./WhiteNoiseCreate.dto";
import { paginationUtil } from "src/utils/PaginationUtil";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { WhiteNoiseEntity } from "./WhiteNoise.entity";
import { TagEntity } from "../tags/tag.entity";

@Injectable()
export class WhiteNoiseService {
  @Inject()
  private readonly minioService: MinIOService;
  @Inject()
  private readonly dataSource: DataSource;
  @Inject(CACHE_MANAGER)
  private readonly cacheManager: Cache;

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
      await this.cacheManager.clear();
      return whiteNoiseLinkResponses;
    });
  }

  async deleteWhiteNoise(fileName: string) {
    await this.minioService.delete(fileName);
    await this.cacheManager.clear();
  }

  async createWhiteNoise(whiteNoiseCreate: WhiteNoiseCreate, file: Express.Multer.File) {
    const res = await this.dataSource.transaction(async (manager) => {
      const whiteNoise = manager.create(WhiteNoiseEntity, {
        ...whiteNoiseCreate,
        linkToAudios: []
      });
      if (file && file.size > 0) {
        const { url } = await this.minioService.upload(file);
        whiteNoise.linkBackgroundImage = url;
      }
      await this.cacheManager.clear();
      return await manager.save(WhiteNoiseEntity, whiteNoise);
    });
    return res;
  }

  async getAllWhiteNoises(page: number = 1, limit: number = 10) {
    const data = await this.cacheManager.get(`whitenoise:${page}:${limit}`);
    if (data) return data as WhiteNoiseEntity[];
    const pageable = paginationUtil(page, limit);
    const res = await this.dataSource.transaction(async (manager) => {
      return await manager
        .getRepository(WhiteNoiseEntity)
        .createQueryBuilder("whiteNoise")
        .select(["whiteNoise.id", "whiteNoise.titleName", "whiteNoise.subTitle", "whiteNoise.linkBackgroundImage"])
        .orderBy({ "whiteNoise.titleName": "DESC" })
        .take(pageable.limit)
        .skip(pageable.skip)
        .getMany();
    });
    await this.cacheManager.set(`whitenoise:${page}:${limit}`, res);
    return res;
  }

  async getWhiteNoiseById(id: string) {
    const data = await this.cacheManager.get(`whitenoise:${id}`);
    if (data) return data as WhiteNoiseEntity;
    Logger.log("Data is not in redis");
    const res = await this.dataSource.transaction(async (manager) => {
      return await manager
        .getRepository(WhiteNoiseEntity)
        .createQueryBuilder("whitenoises")
        .leftJoinAndSelect("whitenoises.linkToAudios", "links")
        .where("whitenoises.id = :id", { id: id })
        .getOne();
    });
    if (!res) throw new BadRequestException();
    await this.cacheManager.set(`whitenoise:${id}`, res);
    return res;
  }

  async tagForWhitenoise(whitenoiseId: string, tagCode: string) {
    await this.dataSource.transaction(async (manager) => {
      const tag = await manager.getRepository(TagEntity).findOne({
        where: { code: tagCode },
        relations: ["whitenoises"]
      });
      if (!tag) throw new BadRequestException();
      const whitenoise = await manager.getRepository(WhiteNoiseEntity).findOneBy({ id: whitenoiseId });
      if (!whitenoise) throw new BadRequestException();
      const whitenoiseList = tag.whitenoises;
      whitenoiseList.push(whitenoise);
      tag.whitenoises = whitenoiseList;
      await manager
        .getRepository(TagEntity)
        .save(tag);
    });
  }
}
