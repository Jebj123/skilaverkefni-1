import express from 'express';
import { errorHandler } from './middleware/errorHandler.js';
import articleRoutes from './routes/articles.js';
import authorRoutes from './routes/authors.js';

export const createApp = () => {
  const app = express();

  app.use(express.json());

  // Routes
  app.use('/api/articles', articleRoutes);
  app.use('/api/authors', authorRoutes);

  // Error Handler
  app.use(errorHandler);

  return app;
};

