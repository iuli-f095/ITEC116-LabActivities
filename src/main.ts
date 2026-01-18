import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('Complete E-Commerce System API Documentation')
    .setVersion('1.0')
    .addTag('products', 'Product management endpoints')
    .addTag('cart', 'Shopping cart operations')
    .addTag('orders', 'Order processing and management')
    .addBearerAuth() // Optional: if you add authentication later
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(3000);
  console.log('Backend running on http://localhost:3000');
  console.log(
    'Swagger documentation available at http://localhost:3000/api-docs',
  );
}
bootstrap();
