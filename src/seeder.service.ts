// seeder.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieDocument } from './schema/movie.schema';

@Injectable()
export class SeederService {
  constructor(@InjectModel('Movie') private readonly movieModel: Model<MovieDocument>) {}

  async seedData(movies: any[]): Promise<void> {
    // Clear existing data (optional)
    await this.movieModel.deleteMany({});

    // Insert new data
    await this.movieModel.insertMany(movies);
  }
}
