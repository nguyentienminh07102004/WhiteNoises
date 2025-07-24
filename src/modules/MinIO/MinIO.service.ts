import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MinioService } from "nestjs-minio-client";

@Injectable()
export class MinIOService {
  @Inject()
  private readonly minioService: MinioService;
  @Inject()
  private readonly configService: ConfigService;

  public upload = async (file: Express.Multer.File) => {
    const minioHost = this.configService.get<string>("MINIO_HOST") as string;
    const minioPort = this.configService.get<number>("MINIO_PORT");
    const minioBucket = this.configService.get<string>("MINIO_BUCKET_NAME") as string;
    const metaData = {
      "Content-Type": file.mimetype
    };
    await this.minioService.client.putObject(minioBucket, file.originalname, file.buffer, metaData);
    return { url: `http://${minioHost}:${minioPort}/${minioBucket}/${file.originalname}`, fileName: file.originalname };
  };

  public delete = async (fileName: string) => {
    const minioBucket = this.configService.get<string>("MINIO_BUCKET_NAME") as string;
    await this.minioService.client.removeObject(minioBucket, fileName);
  };
}
