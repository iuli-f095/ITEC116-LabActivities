import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async create(user: User, title: string, content: string) {
    const note = this.notesRepository.create({ title, content, user });
    return this.notesRepository.save(note);
  }

  async findAll(user: User) {
    return this.notesRepository.find({ where: { user } });
  }

  async update(id: number, user: User, title: string, content: string) {
    const note = await this.notesRepository.findOne({ where: { id, user } });
    if (!note) return null;
    note.title = title;
    note.content = content;
    return this.notesRepository.save(note);
  }

  async delete(id: number, user: User) {
    return this.notesRepository.delete({ id, user });
  }
}
