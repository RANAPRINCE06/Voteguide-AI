import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILesson extends Document {
  title: string;
  description: string;
  order: number;
  icon: string;
}

const LessonSchema: Schema<ILesson> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, required: true, unique: true },
    icon: { type: String, required: true },
  },
  { timestamps: true }
);

const Lesson: Model<ILesson> = mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema);

export default Lesson;
