import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ObjectId } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('posts')
@UseGuards(AuthGuard())
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request & { user: User },
  ) {
    return this.postService.create(createPostDto, req.user);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: ObjectId) {
    return this.postService.findOne(id);
  }

  @Post('/my')
  findUsersPosts(@Req() req: Request & { user: User }) {
    return this.postService.findUsersPosts(req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: ObjectId,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request & { user: User },
  ) {
    return this.postService.update(id, updatePostDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: ObjectId) {
    return this.postService.remove(id);
  }
}
