import mongoose, { Schema, InferSchemaType } from 'mongoose';

const ExhibitionSchema = new Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  endDate: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['upcoming', 'past'], default: 'upcoming' },
  image: { type: String, required: true },
  registrationOpen: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  artworks: [{ type: Schema.Types.ObjectId, ref: 'Artwork' }],
  artistId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export type ExhibitionDoc = InferSchemaType<typeof ExhibitionSchema> & { _id: string };

export const ExhibitionModel = mongoose.models.Exhibition || mongoose.model('Exhibition', ExhibitionSchema);


