import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const cat = await this.repo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  create(data: Partial<Category>) {
    const category = this.repo.create(data);
    return this.repo.save(category);
  }

  async remove(id: number) {
    const cat = await this.findOne(id);
    return this.repo.remove(cat);
  }

  async update(id: number, data: Partial<Category>) {
    const cat = await this.findOne(id);
    Object.assign(cat, data);
    return this.repo.save(cat);
    }

}
