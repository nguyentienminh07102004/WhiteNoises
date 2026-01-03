import { Body, Controller, Delete, Inject, Param, Post, Put } from "@nestjs/common";
import { ParseParamArrayPipe } from "src/common/pipes/ParseParamPipe.pipe";
import { TagCreateDto } from "./dto/TagCreate.dto";
import { TagService } from "./tag.service";
import { TagUpdateDto } from "./dto/TagUpdate.dto";

@Controller('tags')
export class TagController {
    @Inject()
    private readonly tagService: TagService;

    @Post()
    async createTag(@Body() tagCreateDto: TagCreateDto) {
        return this.tagService.create(tagCreateDto);
    }

    @Delete(':ids')
    async deleteTags(@Param('ids', ParseParamArrayPipe) ids: string[]) {
        await this.tagService.deleteTags(ids);
    }

    @Put()
    async updateTags(@Body() tagUpdate: TagUpdateDto) {
        return await this.tagService.updateTag(tagUpdate);
    }
}