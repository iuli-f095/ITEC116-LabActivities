import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({ example: 'Haruki Murakami' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Japanese novelist and short-story writer', required: false })
  @IsString()
  @IsOptional()
  bio?: string;
}
