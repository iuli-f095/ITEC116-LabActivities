import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Author } from '../../authors/entities/author.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300 })
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  publishedYear: number;

  @ManyToOne(() => Author, (author) => author.books, { eager: true })
  @JoinColumn({ name: 'authorId' })
  author: Author;

  @ManyToOne(() => Category, (category) => category.books, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
