import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Post } from 'src/post/schemas/post.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './schemas/comment.schemas';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<Comment>,
    @InjectModel(Post.name)
    private postModel: Model<Post>,
  ) {}

  async create(
    postId: ObjectId,
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<Post> {
    try {
      if (!postId) {
        throw new BadRequestException('Post id is required');
      }
      if (!createCommentDto.content) {
        throw new BadRequestException('Comment text is required');
      }
      const comment = await this.commentModel.create({
        ...createCommentDto,
        author: user.id,
        postId: postId,
      });

      const post = await this.postModel
        .findByIdAndUpdate(
          postId,
          {
            $push: { comments: comment.id },
          },
          { new: true },
        )
        .populate('comments');

      return post;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<Comment[]> {
    try {
      const comments = await this.commentModel.find();
      return comments;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: ObjectId): Promise<Comment> {
    try {
      const comment = await this.commentModel.findById(id);
      return comment;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: ObjectId, updateCommentDto: UpdateCommentDto, user: User) {
    try {
      const isSameUser = await this.commentModel.findOne({
        _id: id,
        author: user.id,
      });
      if (!isSameUser) {
        throw new Error('You are not authorized to update this comment');
      }
      const comment = await this.commentModel.findByIdAndUpdate(
        id,
        updateCommentDto,
        { new: true },
      );
      return comment;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: ObjectId, user: User) {
    try {
      const isSameUser = await this.commentModel.findOne({
        _id: id,
        author: user.id,
      });
      if (!isSameUser) {
        throw new Error('You are not authorized to delete this comment');
      }
      const comment = await this.commentModel.findByIdAndDelete(id);
      return comment;
    } catch (error) {
      throw new Error(error);
    }
  }
}
