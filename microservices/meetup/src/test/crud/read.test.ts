import mongoose from 'mongoose';

describe('CRUD operations', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
  });

});