import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn() id: number;
  @Column('text') content: string;
  @CreateDateColumn() createdAt: Date;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' }) post: Post;
  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' }) author: User;
}
