import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './schemas/post.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private postModel: SoftDeleteModel<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const { title, content } = createPostDto;
    try {
      const result = await this.postModel.create({
        title,
        content,
        author: user.id,
      });
      if (!result) {
        throw new BadRequestException('Bad Request');
      }
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll(): Promise<Post[]> {
    try {
      const result = await this.postModel
        .find()
        .populate('author')
        .populate('comments');
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOne(id: ObjectId): Promise<Post> {
    try {
      const result = await this.postModel
        .findById(id)
        .populate('author')
        .populate('comments');
      if (!result) {
        throw new NotFoundException('Not Found');
      }
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findUsersPosts(userId: ObjectId): Promise<Post[]> {
    try {
      const result = await this.postModel
        .find({ author: userId })
        .populate('author');
      if (!result) {
        throw new BadRequestException('Bad Request');
      }
      return result;
    } catch (error) {
      throw new BadRequestException('Bad Request');
    }
  }

  async update(
    id: ObjectId,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const isSameAuthor = await this.postModel.findOne({
      _id: id,
      author: user.id,
    });

    if (!isSameAuthor) {
      throw new ForbiddenException('Not permitted');
    }

    try {
      const result = this.postModel.findByIdAndUpdate(id, updatePostDto, {
        new: true,
      });
      if (!result) {
        throw new BadRequestException('Bad Request');
      }
      return result;
    } catch (error) {
      throw new BadRequestException('Bad Request');
    }
  }

  async remove(id: ObjectId) {
    try {
      const result = await this.postModel.softDelete({ _id: id });
      if (!result) {
        throw new BadRequestException('Bad Request');
      }
      return result;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Bad Request');
    }
  }
}
