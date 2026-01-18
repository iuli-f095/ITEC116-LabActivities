import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Author } from '../authors/entities/author.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private booksRepo: Repository<Book>,
    @InjectRepository(Author) private authorsRepo: Repository<Author>,
    @InjectRepository(Category) private categoriesRepo: Repository<Category>,
  ) {}

  async create(dto: CreateBookDto) {
    const author = await this.authorsRepo.findOne({ where: { id: dto.authorId } });
    const category = await this.categoriesRepo.findOne({ where: { id: dto.categoryId } });
    if (!author || !category) throw new NotFoundException('Author or Category not found');
    const book = this.booksRepo.create({
      title: dto.title,
      description: dto.description,
      publishedYear: dto.publishedYear,
      author,
      category,
    });
    return this.booksRepo.save(book);
  }

  findAll() {
    return this.booksRepo.find();
  }

  async findOne(id: number) {
    const book = await this.booksRepo.findOne({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: number, dto: UpdateBookDto) {
    const book = await this.findOne(id);
    Object.assign(book, dto);
    return this.booksRepo.save(book);
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    return this.booksRepo.remove(book);
  }
}
