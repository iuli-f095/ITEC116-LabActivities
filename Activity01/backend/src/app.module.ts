import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',      
      password: '',          
      database: 'act1_todo',
      entities: [Task],
      synchronize: true,     
    }),
    TasksModule,
  ],
})
export class AppModule {}
