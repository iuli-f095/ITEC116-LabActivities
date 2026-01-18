import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Note } from './note.entity';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    email: string;
  };
}

@ApiTags('notes')
@ApiBearerAuth('JWT-auth')
@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({
    status: 201,
    description: 'Note successfully created',
    type: Note,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: CreateNoteDto })
  create(
    @Body() createNoteDto: CreateNoteDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.notesService.create(createNoteDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of notes', type: [Note] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req: AuthenticatedRequest) {
    return this.notesService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific note by ID' })
  @ApiParam({ name: 'id', description: 'Note ID', type: Number })
  @ApiResponse({ status: 200, description: 'Note found', type: Note })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.notesService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific note' })
  @ApiParam({ name: 'id', description: 'Note ID', type: Number })
  @ApiResponse({ status: 200, description: 'Note updated', type: Note })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  @ApiBody({ type: UpdateNoteDto })
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.notesService.update(+id, updateNoteDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific note' })
  @ApiParam({ name: 'id', description: 'Note ID', type: Number })
  @ApiResponse({ status: 200, description: 'Note deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.notesService.remove(+id, req.user.userId);
  }
}
