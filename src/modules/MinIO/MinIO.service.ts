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
    const fileName = Date.now() + file.originalname;
    await this.minioService.client.putObject(minioBucket, fileName, file.buffer, metaData);
    return { url: `http://${minioHost}:${minioPort}/${minioBucket}/${fileName}`, fileName: file.originalname };
  };

  public delete = async (fileName: string) => {
    const minioBucket = this.configService.get<string>("MINIO_BUCKET_NAME") as string;
    await this.minioService.client.removeObject(minioBucket, fileName);
  };
}
