import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ObjectId } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
@UseGuards(AuthGuard())
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':postId')
  create(
    @Param('postId') postId: ObjectId,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request & { user: User },
  ) {
    return this.commentService.create(postId, createCommentDto, req.user);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: ObjectId) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: ObjectId,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request & { user: User },
  ) {
    return this.commentService.update(id, updateCommentDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: ObjectId, @Req() req: Request & { user: User }) {
    return this.commentService.remove(id, req.user);
  }
}
