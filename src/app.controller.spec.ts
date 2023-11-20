// movie.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller'; // Correct the import statement
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieDocument } from './schema/movie.schema';
import { Query } from 'mongoose';
import { AppService } from './app.service';

describe('MovieController', () => {
  let controller: AppController; // Correct the type to AppController
  let movieModel: Model<MovieDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController], // Correct the controller reference
      providers: [
        AppService,
        {
          provide: getModelToken('Movie'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    movieModel = module.get<Model<MovieDocument>>(getModelToken('Movie'));
  });

  describe('getAllMovies', () => {
    it('should return an array of movies', async () => {
      const expectedMovies: MovieDocument[] = [
        {
          title: 'Inception',
          genre: 'Sci-Fi',
          rating: 9.3,
          streaming_link: 'http://example.com/inception',
        } as MovieDocument,
      ];
  
      const execMock = jest.fn().mockResolvedValueOnce(expectedMovies);
  
      jest.spyOn(movieModel, 'find').mockReturnValueOnce({
        exec: execMock,
      } as unknown as Query<MovieDocument[], MovieDocument>);
  
      const result = await controller.getAllMovies();

      expect(result).toEqual(expectedMovies);
      expect(execMock).toHaveBeenCalled();
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie', async () => {
      const movieId = '655b7a33bcc39f87ea578296';

      jest.spyOn(movieModel, 'findByIdAndDelete').mockResolvedValueOnce(null);

      const result = await controller.deleteMovie(movieId);

      expect(result).toEqual({ message: 'Movie deleted successfully' });
      expect(movieModel.findByIdAndDelete).toHaveBeenCalledWith(movieId);
    });
  });
});
