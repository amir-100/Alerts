import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { HttpModule } from '@nestjs/axios';
import { config } from './config';
import { City } from './cities/entities/city.entity';
import { CitiesController } from './cities/cities.controller';
import { CitiesService } from './cities/cities.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
    }),
    TypeOrmModule.forFeature([City]),
    HttpModule,
  ],
  controllers: [CitiesController],
  providers: [CitiesService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware, CookieMiddleware).forRoutes('*');
  }
}
