import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('note')
export class Note {
  @ApiProperty({ description: 'Note ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Note title', example: 'My First Note' })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Note content',
    example: 'This is the content of my note.',
  })
  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.notes)
  user: User;

  @ApiProperty({ description: 'User ID who owns the note', example: 1 })
  @Column()
  userId: number;

  @ApiProperty({
    description: 'Creation date',
    example: '2025-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2025-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
