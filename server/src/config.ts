import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { City } from './cities/entities/city.entity';
export const config = () => ({
  port: 3001,
  clientUrl: 'http://localhost:3000',
  database: {
    type: 'postgres',
    host: 'localhost',
    port: '5432',
    username: 'postgres',
    password: '12345',
    database: 'postgres',
    schema: 'public',
    ssl: false,
    entities: [City],
    // synchronize: true,
    logging: 'all',
    namingStrategy: new SnakeNamingStrategy(),
  },
});
