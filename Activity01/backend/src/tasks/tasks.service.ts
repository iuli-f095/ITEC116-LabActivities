import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
  ) {}

  findAll() {
    return this.taskRepo.find();
  }

  findOne(id: number) {
    return this.taskRepo.findOneBy({ id });
  }

  create(taskData: Partial<Task>) {
    const t = this.taskRepo.create(taskData);
    return this.taskRepo.save(t);
  }

  async update(id: number, taskData: Partial<Task>) {
    await this.taskRepo.update(id, taskData);
    return this.findOne(id);
  }

  delete(id: number) {
    return this.taskRepo.delete(id);
  }
}
