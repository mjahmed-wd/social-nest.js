import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { PostModule } from 'src/post/post.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentSchema } from './schemas/comment.schemas';

@Module({
  imports: [
    AuthModule,
    PostModule,
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
