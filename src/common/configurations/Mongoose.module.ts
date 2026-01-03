import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            uri: `mongodb://${configService.get<string>('MONGO_HOST')}:${configService.get<string>('MONGO_PORT')}`,
            user: configService.get<string>('MONGO_USERNAME'),
            pass: configService.get<string>('MONGO_PASSWORD'),
            dbName: configService.get<string>('MONGO_DB'),
        })
    })]
})
export class MongooseMongoDBModule {}