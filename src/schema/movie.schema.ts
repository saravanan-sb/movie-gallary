// movie.schema.ts
import * as mongoose from 'mongoose';

export const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, required: true },
  streaming_link: { type: String, required: true },
});

export interface MovieDocument extends mongoose.Document {
  title: string;
  genre: string;
  rating: number;
  streaming_link: string;
}
