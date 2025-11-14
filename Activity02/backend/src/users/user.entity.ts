import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Note } from '../notes/note.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class User {
  @ApiProperty({ description: 'User ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Hashed password',
    example: '$2b$10$hashedpasswordstring',
    writeOnly: true,
  })
  @Column()
  password: string;

  @ApiProperty({
    description: 'User full name',
    example: 'User',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'User creation date',
    example: '2025-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'User notes',
    type: () => [Note],
    required: false,
  })
  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];
}
