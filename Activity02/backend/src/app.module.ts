import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { User } from './auth/user.entity';
import { Note } from './notes/note.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '', // only fill this if your MySQL has a password
      database: 'notes_app',
      entities: [User, Note],
      synchronize: true, // auto create tables
    }),
    AuthModule,
    NotesModule,
  ],
})
export class AppModule {}
