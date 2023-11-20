import { Module , OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieSchema } from './schema/movie.schema';
import { SeederService } from './seeder.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGO_URI,
      }),
    }),
    MongooseModule.forFeature([{ name: 'Movie', schema: MovieSchema }])
  ],
  controllers: [AppController],
  providers: [AppService, SeederService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seederService: SeederService) {}

  async onModuleInit() {
    const movies = [
      {
        id: 1,
        title: 'Inception',
        genre: 'Sci-Fi',
        rating: 9.3,
        streaming_link: 'http://example.com/inception',
      },
      {
        id: 2,
        title: 'The Dark Knight',
        genre: 'Action',
        rating: 9.0,
        streaming_link: 'http://example.com/darkknight',
      },
      {
        id: 3,
        title: 'The Bright Knight',
        genre: 'Action',
        rating: 9.0,
        streaming_link: 'http://example.com/darkknight',
      },
    ];

    await this.seederService.seedData(movies);
    console.log('Data seeded successfully!');
  }
}
