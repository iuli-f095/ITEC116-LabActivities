import { IsString, MinLength, IsInt } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  postId: number;

  @IsString()
  @MinLength(1)
  content: string;
}