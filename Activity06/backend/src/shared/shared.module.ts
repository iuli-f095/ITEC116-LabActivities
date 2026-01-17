import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TMDBService } from './tmdb.service';

@Module({
  imports: [
    ConfigModule, 
  ],
  providers: [TMDBService],
  exports: [TMDBService],
})
export class SharedModule {}