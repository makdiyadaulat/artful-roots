import mongoose, { Schema, InferSchemaType } from 'mongoose';

const CommentSchema = new Schema({
  artworkId: { type: Schema.Types.ObjectId, ref: 'Artwork', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String, required: true },
  text: { type: String, required: true },
}, { timestamps: true });

export type CommentDoc = InferSchemaType<typeof CommentSchema> & { _id: string };

export const CommentModel = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);



