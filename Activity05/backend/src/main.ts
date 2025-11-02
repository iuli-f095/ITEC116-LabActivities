import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
const app = await NestFactory.create(AppModule);
app.useGlobalPipes(new ValidationPipe({ whitelist: true }));


const config = new DocumentBuilder()
.setTitle('Blog API')
.setDescription('Blog platform with users, posts, comments')
.setVersion('1.0')
.addBearerAuth()
.build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);


await app.listen(process.env.PORT || 3000);
console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();