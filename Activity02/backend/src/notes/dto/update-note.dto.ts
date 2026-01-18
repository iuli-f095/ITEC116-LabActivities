import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateNoteDto } from './create-note.dto';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @ApiProperty({
    description: 'Note title',
    example: 'Updated Note Title',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'Note content',
    example: 'Updated note content.',
    required: false,
  })
  content?: string;
}
