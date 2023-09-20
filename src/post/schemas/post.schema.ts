import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Comment } from 'src/comment/schemas/comment.schemas';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      delete ret.__v;
      delete ret._id;
      delete ret.updatedAt;
    },
  },
})
export class Post extends Document {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  content: string;

  @Prop({ default: 0, type: Number })
  likeCount: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Comment.name }],
    default: [],
  })
  comments: ObjectId[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  author: ObjectId;
}

export const PostSchema =
  SchemaFactory.createForClass(Post).plugin(softDeletePlugin);
