import { Injectable } from '@nestjs/common';
import { MovieDto } from './app.controller';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieSchema, MovieDocument } from './schema/movie.schema';

@Injectable()
export class AppService {
  constructor(@InjectModel('Movie') private readonly movieModel: Model<MovieDocument>) {}
  
  async getMovies() {
    try {
      return await this.movieModel.find().exec();
    } catch(error) {
      return {status: 500, msg: 'Something went wrong.'}
    }
  }

  async getSearchedMovies(searchText: string) {
    try {
      if (searchText) {
        const lowerCaseSearch = searchText.toLowerCase();
        return await this.movieModel.find({
          $or: [
            { title: { $regex: lowerCaseSearch, $options: 'i' } },
            { genre: { $regex: lowerCaseSearch, $options: 'i' } },
          ],
        }).exec()
      } else {
        return { message: 'Search text not found.' };
      }
    } catch (error) {
      return {status: 500, msg: 'Something went wrong.'}
    }
  }

  async addMovie(newMovie: MovieDto) {
    try {
      const createdMovie = new this.movieModel(newMovie);
      return await createdMovie.save();
    } catch (error) {
      return {status: 500, msg: 'Something went wrong.'}
    }
  }

  async updateMovie(id: string, updatedMovie: MovieDto) {
    try {
      const updatedDocument = await this.movieModel.findByIdAndUpdate(id, updatedMovie, { new: true }).exec();

      if (updatedDocument) {
        return updatedDocument;
      } else {
        return { status: 404, msg: 'Movie not found' };
      }
    } catch (error) {
      return { status: 500, msg: 'Something went wrong.' };
    }
}


  async deleteMovie(id: string) {
    try {
      const deletedMovie = await this.movieModel.findByIdAndDelete(id);

      if (deletedMovie) {
        return { message: 'Movie deleted successfully' };
      } else {
        return { status: 404, msg: 'Movie not found' };
      }
    } catch (error) {
      return { status: 500, msg: 'Something went wrong.' };
    }
}

}
