import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import slugify from "slugify";
import { DataSource } from "typeorm";
import { TagCreateDto } from "./dto/TagCreate.dto";
import { TagEntity } from "./tag.entity";
import { TagUpdateDto } from "./dto/TagUpdate.dto";

@Injectable()
export class TagService {
  @InjectDataSource()
  private readonly dataSource: DataSource;

  async create(tagCreateDto: TagCreateDto) {
    return await this.dataSource.transaction(async (manager) => {
      const code = slugify([tagCreateDto.name, randomUUID()].join(), {
        lower: true,
        trim: true,
        locale: "vi",
        replacement: "-",
        strict: true
      });
      const tag = manager.getRepository(TagEntity).create({
        code: code,
        name: tagCreateDto.name
      });
      return await manager.save(tag);
    });
  }

  async deleteTags(ids: string[]) {
    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(TagEntity).createQueryBuilder("tags").whereInIds(ids).getMany();
      await manager.createQueryBuilder().delete().from(TagEntity).whereInIds(ids).execute();
    });
  }

  async updateTag(tagUpdate: TagUpdateDto) {
    return await this.dataSource.transaction(async (manager) => {
        return await manager.createQueryBuilder()
        .update(TagEntity)
        .set(tagUpdate)
        .execute();
    })
  }
}
