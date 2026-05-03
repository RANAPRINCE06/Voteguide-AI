import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  firebaseId: string;
  name: string;
  email: string;
  progress: string[]; // Array of completed lesson IDs
  badges: string[];
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    firebaseId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    progress: { type: [String], default: [] },
    badges: { type: [String], default: [] },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
