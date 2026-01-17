import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Review } from '../../reviews/entities/review.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tmdb_id: number;

  @Column()
  title: string;

  @Column('text')
  overview: string;

  @Column()
  poster_path: string;

  @Column()
  backdrop_path: string;

  @Column({ type: 'date' })
  release_date: Date;

  @Column()
  runtime: number;

  @Column()
  director: string;

  @Column('text')
  actors: string;

  @Column()
  genres: string;

  @Column()
  age_rating: string;

  @Column('decimal', { precision: 3, scale: 1, default: 0 })
  vote_average: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Review, review => review.movie)
  reviews: Review[];
}