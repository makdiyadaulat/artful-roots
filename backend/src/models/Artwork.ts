import mongoose, { Schema, InferSchemaType } from 'mongoose';

const ArtworkSchema = new Schema({
  title: { type: String, required: true },
  artistId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  artist: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  likes: { type: Number, default: 0 },
  medium: { type: String },
  size: { type: String },
  description: { type: String },
}, { timestamps: true });

export type ArtworkDoc = InferSchemaType<typeof ArtworkSchema> & { _id: string };

export const ArtworkModel = mongoose.models.Artwork || mongoose.model('Artwork', ArtworkSchema);


