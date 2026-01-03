import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { WhiteNoiseService } from "./WhiteNoise.service";
import { WhiteNoiseCreate } from "./WhiteNoiseCreate.dto";
import { ParseJsonPipe } from "src/common/pipes/ParseJsonPipe.pipe";
import { Public } from "src/common/decord/Public.decorator";

@Controller("whiteNoises")
export class WhiteNoiseController {
  @Inject()
  private readonly whiteNoiseService: WhiteNoiseService;

  @Get()
  @Public()
  async getAllWhiteNoise(@Query("page") page: number, @Query("limit") limit: number) {
    const res = await this.whiteNoiseService.getAllWhiteNoises(page, limit);
    return res;
  }

  @Post(":whiteNoiseId")
  @UseInterceptors(FilesInterceptor("files"))
  async uploadWhiteNoise(@UploadedFiles() files, @Param("whiteNoiseId", ParseUUIDPipe) whiteNoiseId: string) {
    return await this.whiteNoiseService.uploadWhiteNoise(whiteNoiseId, files);
  }

  @Delete(":fileName")
  async deleteWhiteNoise(@Param("fileName") fileName: string) {
    await this.whiteNoiseService.deleteWhiteNoise(fileName);
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async createWhiteNoise(
    @Body("whiteNoiseCreate", ParseJsonPipe<WhiteNoiseCreate>) whiteNoiseCreate: WhiteNoiseCreate,
    @UploadedFile() file: Express.Multer.File
  ) {
    return await this.whiteNoiseService.createWhiteNoise(whiteNoiseCreate, file);
  }

  @Get(":id")
  @Public()
  async getWhiteNoiseById(@Param("id", ParseUUIDPipe) id: string) {
    return await this.whiteNoiseService.getWhiteNoiseById(id);
  }

  @Put('tag/:tagCode/whitenoise/:whitenoiseId')
  async tagForWhitenoise(@Param('tagCode') tagCode: string, @Param('whitenoiseId') whitenoiseId: string) {
    await this.whiteNoiseService.tagForWhitenoise(whitenoiseId, tagCode);
  }
}
