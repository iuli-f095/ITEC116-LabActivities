import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  /*@Get(':id')
  findOne(@Param('id') id: string): Promise<Task> {
    return this.tasksService.findOne(+id);
  }*/
  
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Task | null> {
    return this.tasksService.findOne(+id);
  }

  @Post()
  create(@Body() taskData: Partial<Task>): Promise<Task> {
    return this.tasksService.create(taskData);
  }

  /*@Patch(':id')
  update(@Param('id') id: string, @Body() taskData: Partial<Task>): Promise<Task> {
    return this.tasksService.update(+id, taskData);
  }*/

  @Patch(':id')
  update(@Param('id') id: string, @Body() taskData: Partial<Task>): Promise<Task | null> {
    return this.tasksService.update(+id, taskData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tasksService.delete(+id);
  }
}
