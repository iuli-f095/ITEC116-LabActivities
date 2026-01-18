import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { AuthorsModule } from './authors/authors.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'act3_book', 
      autoLoadEntities: true, 
      synchronize: true,      
    }),
    BooksModule,
    AuthorsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
