import { createKeyv } from "@keyv/redis";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        stores: [
          createKeyv({
            url: `redis://${configService.get<string>('REDIS_HOST')}:${configService.get<string>('REDIS_PORT')}`,
            password: configService.get<string>('REDIS_PASSWORD')
          })
        ]
      }),
      isGlobal: true
    })
  ]
})
export class RedisConfigurationModule {}
