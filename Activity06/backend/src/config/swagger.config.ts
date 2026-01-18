import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Movie Review API')
  .setDescription('API for movie reviews and ratings')
  .setVersion('1.0')
  .addTag('movies')
  .addTag('reviews')
  .addTag('users')
  .addTag('auth')
  .addBearerAuth()
  .build();