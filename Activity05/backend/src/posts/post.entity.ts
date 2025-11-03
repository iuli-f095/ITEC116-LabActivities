import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn() id: number;
  @Column() title: string;
  @Column('text') content: string;
  @CreateDateColumn() createdAt: Date;

  @ManyToOne(() => User, (user) => user.posts) author: User;
  @OneToMany(() => Comment, (comment) => comment.post) comments: Comment[];
}
