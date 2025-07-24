import { Body, Controller, Delete, Get, Inject, Param, ParseUUIDPipe, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { WhiteNoiseService } from "./WhiteNoise.service";
import { WhiteNoiseCreate } from "./WhiteNoiseCreate.dto";

@Controller("whiteNoises")
export class WhiteNoiseController {
    @Inject()
    private readonly whiteNoiseService: WhiteNoiseService;

    @Get()
    async getAllWhiteNoise(@Query('page') page: number, @Query('limit') limit: number) {
        const res = await this.whiteNoiseService.getAllWhiteNoises(page, limit);
        return res;
    }

    @Post(":whiteNoiseId")
    @UseInterceptors(FilesInterceptor('files'))
    async uploadWhiteNoise(@UploadedFiles() files, @Param('whiteNoiseId', ParseUUIDPipe) whiteNoiseId: string) {
       return await this.whiteNoiseService.uploadWhiteNoise(whiteNoiseId, files);
    }

    @Delete(':fileName')
    async deleteWhiteNoise(@Param('fileName') fileName: string) {
        await this.whiteNoiseService.deleteWhiteNoise(fileName);
    }

    @Post()
    async createWhiteNoise(@Body() whiteNoiseCreate: WhiteNoiseCreate) {
        return await this.whiteNoiseService.createWhiteNoise(whiteNoiseCreate);
    }

    @Get(":id")
    async getWhiteNoiseById(@Param('id', ParseUUIDPipe) id: string) {
        return await this.whiteNoiseService.getWhiteNoiseById(id);
    }
}