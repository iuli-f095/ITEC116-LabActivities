import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('notes')
@UseGuards(AuthGuard('jwt'))
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Get()
  findAll(@Req() req) {
    return this.notesService.findAll(req.user);
  }

  @Post()
  create(@Req() req, @Body() body: { title: string; content: string }) {
    return this.notesService.create(req.user, body.title, body.content);
  }

  @Put(':id')
  update(@Param('id') id: number, @Req() req, @Body() body: { title: string; content: string }) {
    return this.notesService.update(id, req.user, body.title, body.content);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @Req() req) {
    return this.notesService.delete(id, req.user);
  }
}
