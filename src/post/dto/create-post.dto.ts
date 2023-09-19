import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ObjectId } from 'mongoose';

const objectIdRegExp = /^[0-9a-fA-F]{24}$/;

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(15)
  content: string;

  @IsNumber()
  likeCount: number;

  @IsArray()
  @Matches(objectIdRegExp, {
    each: true,
    message: 'Invalid comment ID format',
  })
  comments: ObjectId[];
}
