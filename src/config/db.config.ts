import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB || 'mongodb://localhost/movie-db',
  port: 27017,
}));
