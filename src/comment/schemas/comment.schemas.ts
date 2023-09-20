import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { User } from 'src/auth/schemas/user.schema';
// import { Post } from 'src/post/schemas/post.schema';
// import { SoftDelete } from 'soft-delete-mongoose-plugin';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      delete ret.__v;
      delete ret._id;
      delete ret.createdAt;
      delete ret.isDeleted;
      delete ret.deletedAt;
    },
  },
})
export class Comment extends Document {
  @Prop({ required: true, type: String })
  content: string;

  @Prop({ default: 0, type: Number })
  likeCount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  author: ObjectId;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Post.name })
  // postId: ObjectId;
}

export const CommentSchema =
  SchemaFactory.createForClass(Comment).plugin(softDeletePlugin);
