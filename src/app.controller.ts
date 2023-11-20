import { AppService } from './app.service';
import { Controller, Get, Post, Body, Put, Param, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import {
  ApiProperty,
  ApiOperation,
  ApiBadRequestResponse,
  ApiOkResponse
} from '@nestjs/swagger';
import { MovieSchema, MovieDocument } from './schema/movie.schema';

export class MovieDto {
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  streaming_link: string;

  @ApiProperty()
  genre: string;
}

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/movies')
  @ApiOperation({ summary: '(Get movies list.)' })
  @ApiOkResponse({ status: 200, description: 'List of all movies.' })
  @ApiBadRequestResponse({ status: 400, description: `Something went wrong.` })
  async getAllMovies(): Promise<MovieDocument | Object> {
    return await this.appService.getMovies()
  }
  
  @Get('/search')
  @ApiOperation({ summary: '(Search for a movie.)' })
  @ApiOkResponse({ status: 200, description: 'Matched movie results.' })
  @ApiBadRequestResponse({ status: 400, description: `Something went wrong.` })
  async getSearchedMovies(@Query('Search using Name or Genre') search: string): Promise<MovieDocument | Object> {
    return this.appService.getSearchedMovies(search)
  }

  @Post('/movies')
  @ApiOperation({ summary: '(Add a new Movie.)' })
  @ApiOkResponse({ status: 200, description: 'Movie Successfully added.' })
  @ApiBadRequestResponse({ status: 400, description: `Something went wrong.` })
  async addMovie(@Body() newMovie: MovieDto): Promise<MovieDocument | Object> {
    const requiredFields = ['title', 'genre', 'rating', 'streaming_link'];
    for (const field of requiredFields) {
      if (!(field in newMovie)) {
        throw new HttpException(`Missing required field: ${field}`, HttpStatus.BAD_REQUEST);
      }
    }
    return await this.appService.addMovie(newMovie);
  }

  @Put('/movies/:id')
  @ApiOperation({ summary: '(Update movie details based on Id.)' })
  @ApiOkResponse({ status: 200, description: 'Movie details successfully updated.' })
  @ApiBadRequestResponse({ status: 400, description: `Issue already in Resolved state` })
  async updateMovie(@Param('id') id: string, @Body() updatedMovie: MovieDto): Promise<MovieDocument | Object>{
    return await this.appService.updateMovie(id, updatedMovie);
  }

  @Delete('/movies/:id')
  @ApiOperation({ summary: '(Delete movie details based on ID.)' })
  @ApiOkResponse({ status: 200, description: 'Movie successfully deleted.' })
  @ApiBadRequestResponse({ status: 400, description: `Issue already in Resolved state` })
  async deleteMovie(@Param('id') id: string): Promise<MovieDocument | Object> {
    return await this.appService.deleteMovie(id);
  }
}
