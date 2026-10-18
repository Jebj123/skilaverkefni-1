import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('Articles Routes', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe('GET /api/articles', () => {
    it('should return 200 status', async () => {
      const response = await request(app).get('/api/articles');

      expect(response.status).toBe(200);
    });

    it('should return an array in response body', async () => {
      const response = await request(app).get('/api/articles');

      const articles = response.body;
      expect(Array.isArray(articles)).toBe(true);
    });
  });

  describe('GET /api/articles/:id', () => {
    it('should return 400 status for invalid UUID format', async () => {
      const response = await request(app).get('/api/articles/invalid-id');

      expect(response.status).toBe(400);
    });

    it('should return error body with details for invalid UUID format', async () => {
      const response = await request(app).get('/api/articles/invalid-id');

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBeDefined();
      expect(response.body.error.details).toBeDefined();
    });

    it('should return 404 status when article not found', async () => {
      const response = await request(app).get(
        '/api/articles/a02a8897-b3b9-40d1-9b3a-e0010fd6454f'
      );

      expect(response.status).toBe(404);
    });

    it('should return error body when article not found', async () => {
      const response = await request(app).get(
        '/api/articles/a02a8897-b3b9-40d1-9b3a-e0010fd6454f'
      );

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBeDefined();
    });
  });

  describe('POST /api/articles', () => {
    it('should return 400 status when title is missing', async () => {
      const invalidArticle = {
        content: 'Some content here that is long enough',
        authorId: '8cb5070c-a1be-42a6-969b-51e3bfe69bcc',
      };

      const response = await request(app)
        .post('/api/articles')
        .send(invalidArticle);

      expect(response.status).toBe(400);
    });

    it('should return validation error body when title is missing', async () => {
      const invalidArticle = {
        content: 'Some content here that is long enough',
        authorId: '8cb5070c-a1be-42a6-969b-51e3bfe69bcc',
      };

      const response = await request(app)
        .post('/api/articles')
        .send(invalidArticle);

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBe('Validation failed');
      expect(response.body.error.details).toBeDefined();
    });

    it('should return 400 status when content is too short', async () => {
      const invalidArticle = {
        title: 'Test Title',
        content: 'Short',
        authorId: '8cb5070c-a1be-42a6-969b-51e3bfe69bcc',
      };

      const response = await request(app)
        .post('/api/articles')
        .send(invalidArticle);

      expect(response.status).toBe(400);
    });

    it('should return validation error body when content is too short', async () => {
      const invalidArticle = {
        title: 'Test Title',
        content: 'Short',
        authorId: '8cb5070c-a1be-42a6-969b-51e3bfe69bcc',
      };

      const response = await request(app)
        .post('/api/articles')
        .send(invalidArticle);

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBe('Validation failed');
    });

    it('should return 400 status when authorId is not a valid UUID', async () => {
      const invalidArticle = {
        title: 'Test Title',
        content: 'This is a long enough content for the article',
        authorId: 'invalid-uuid',
      };

      const response = await request(app)
        .post('/api/articles')
        .send(invalidArticle);

      expect(response.status).toBe(400);
    });

    it('should return validation error body when authorId is not a valid UUID', async () => {
      const invalidArticle = {
        title: 'Test Title',
        content: 'This is a long enough content for the article',
        authorId: 'invalid-uuid',
      };

      const response = await request(app)
        .post('/api/articles')
        .send(invalidArticle);

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBe('Validation failed');
    });

    it('should return 400 status with multiple validation errors', async () => {
      const invalidArticle = {
        content: 'Short',
        authorId: 'not-uuid',
      };

      const response = await request(app)
        .post('/api/articles')
        .send(invalidArticle);

      expect(response.status).toBe(400);
    });

    it('should return multiple error details in body with multiple validation errors', async () => {
      const invalidArticle = {
        content: 'Short',
        authorId: 'not-uuid',
      };

      const response = await request(app)
        .post('/api/articles')
        .send(invalidArticle);

      expect(response.body.error).toBeDefined();
      expect(response.body.error.details).toBeDefined();
      expect(response.body.error.details.length).toBeGreaterThan(1);
    });

    it('should return 400 status when body is empty', async () => {
      const response = await request(app).post('/api/articles').send({});

      expect(response.status).toBe(400);
    });

    it('should return error body when body is empty', async () => {
      const response = await request(app).post('/api/articles').send({});

      expect(response.body.error).toBeDefined();
    });

    it('should return 201 status when creating article with valid data', async () => {
      const author = await request(app)
        .post('/api/authors')
        .send({ name: 'Test Author', email: 'test@example.com' });

      const newArticle = {
        title: 'Test Article',
        content: 'This is a test article with enough content',
        authorId: author.body.id,
      };

      const response = await request(app)
        .post('/api/articles')
        .send(newArticle);

      expect(response.status).toBe(201);
    });

     it('should return created article in body when creating with valid data', async () => {
      const author = await request(app)
        .post('/api/authors')
        .send({ name: 'Test Author', email: 'test@example.com' });

      const newArticle = {
        title: 'Test Article',
        content: 'This is a test article with enough content',
        authorId: author.body.id,
      };

      const response = await request(app)
        .post('/api/articles')
        .send(newArticle);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.title).toBe(newArticle.title);
      expect(response.body.content).toBe(newArticle.content);
      expect(response.body.authorId).toBe(newArticle.authorId);
    });
  });

  describe('DELETE /api/articles/:id', () => {
    it('should return 400 status for invalid UUID in delete', async () => {
      const response = await request(app).delete('/api/articles/not-a-uuid');

      expect(response.status).toBe(400);
    });

    it('should return validation error body for invalid UUID in delete', async () => {
      const response = await request(app).delete('/api/articles/not-a-uuid');

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBe('Validation failed');
    });

    it('should return 404 status when article to delete not found', async () => {
      const response = await request(app).delete(
        '/api/articles/a02a8897-b3b9-40d1-9b3a-e0010fd6454f'
      );

      expect(response.status).toBe(404);
    });

    it('should return error body when article to delete not found', async () => {
      const response = await request(app).delete(
        '/api/articles/a02a8897-b3b9-40d1-9b3a-e0010fd6454f'
      );

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBe('Article not found');
    });
  });
});
