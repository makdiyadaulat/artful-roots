import mongoose, { Schema, InferSchemaType } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['artist', 'visitor'], required: true },
  avatar: { type: String, required: true },
  banner: { type: String },
  specialty: { type: String },
  location: { type: String },
  followers: { type: Number, default: 0 },
  artworksCount: { type: Number, default: 0 },
  totalLikes: { type: Number, default: 0 },
  bio: { type: String },
  skills: { type: [String], default: [] },
  joined: { type: String },
  social: {
    instagram: { type: String },
    website: { type: String },
    twitter: { type: String },
  },
}, { timestamps: true });

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: string };

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);


