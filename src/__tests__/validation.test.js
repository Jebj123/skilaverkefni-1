import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('Validation Middleware', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe('Body Validation', () => {
    it('should return 400 status for missing required fields in articles', async () => {
      const response = await request(app).post('/api/articles').send({});

      expect(response.status).toBe(400);
    });

    it('should return validation error body for missing required fields in articles', async () => {
      const response = await request(app).post('/api/articles').send({});

      expect(response.body.error).toBeDefined();
      expect(response.body.error.status).toBe(400);
      expect(response.body.error.message).toBeDefined();
      expect(response.body.error.details).toBeDefined();
    });

    it('should return 400 status for missing required fields in authors', async () => {
      const response = await request(app).post('/api/authors').send({});

      expect(response.status).toBe(400);
    });

    it('should return validation error body for missing required fields in authors', async () => {
      const response = await request(app).post('/api/authors').send({});

      expect(response.body.error).toBeDefined();
      expect(response.body.error.status).toBe(400);
      expect(response.body.error.message).toBeDefined();
      expect(response.body.error.details).toBeDefined();
    });

    it('should return 400 status for string length constraint violations', async () => {
      const invalidArticle = {
        title: 'Test',
        content: 'Short',
        authorId: '8cb5070c-a1be-42a6-969b-51e3bfe69bcc',
      };

      const response = await request(app)
        .post('/api/articles')
        .send(invalidArticle);

      expect(response.status).toBe(400);
    });

    it('should return validation error body with content field error for string length violations', async () => {
      const invalidArticle = {
        title: 'Test',
        content: 'Short',
        authorId: '8cb5070c-a1be-42a6-969b-51e3bfe69bcc',
      };

      const response = await request(app)
        .post('/api/articles')
        .send(invalidArticle);

      expect(response.body.error).toBeDefined();
      expect(response.body.error.status).toBe(400);
      expect(response.body.error.message).toBeDefined();
      expect(response.body.error.details).toBeDefined();
      const contentError = response.body.error.details.find(
        (d) => d.field === 'content'
      );
      expect(contentError).toBeDefined();
    });

    it('should return 400 status for invalid email format', async () => {
      const invalidAuthor = {
        name: 'Test User',
        email: 'not-an-email',
      };

      const response = await request(app)
        .post('/api/authors')
        .send(invalidAuthor);

      expect(response.status).toBe(400);
    });

    it('should return validation error body with email field error for invalid format', async () => {
      const invalidAuthor = {
        name: 'Test User',
        email: 'not-an-email',
      };

      const response = await request(app)
        .post('/api/authors')
        .send(invalidAuthor);

      expect(response.body.error).toBeDefined();
      expect(response.body.error.status).toBe(400);
      expect(response.body.error.message).toBeDefined();
      const emailError = response.body.error.details.find(
        (d) => d.field === 'email'
      );
      expect(emailError).toBeDefined();
    });

    it('should return 400 status for invalid UUID format in authorId', async () => {
      const invalidArticle = {
        title: 'Test Article',
        content: 'This is enough content for the article',
        authorId: 'not-a-uuid',
      };

      const response = await request(app)
        .post('/api/articles')
        .send(invalidArticle);

      expect(response.status).toBe(400);
    });

    it('should return validation error body with authorId field error for invalid UUID', async () => {
      const invalidArticle = {
        title: 'Test Article',
        content: 'This is enough content for the article',
        authorId: 'not-a-uuid',
      };

      const response = await request(app)
        .post('/api/articles')
        .send(invalidArticle);

      expect(response.body.error).toBeDefined();
      expect(response.body.error.status).toBe(400);
      expect(response.body.error.message).toBeDefined();
      const authorIdError = response.body.error.details.find(
        (d) => d.field === 'authorId'
      );
      expect(authorIdError).toBeDefined();
    });

    it('should return 201 status for optional fields handled correctly (author bio)', async () => {
      const authorWithoutBio = {
        name: 'Test User',
        email: 'test@example.com',
      };

      const response = await request(app)
        .post('/api/authors')
        .send(authorWithoutBio);

      expect(response.status).toBe(201);
    });

    it('should return created author body for optional fields handled correctly (author bio)', async () => {
      const authorWithoutBio = {
        name: 'Test User',
        email: 'test@example.com',
      };

      const response = await request(app)
        .post('/api/authors')
        .send(authorWithoutBio);

      expect(response.body.name).toBe(authorWithoutBio.name);
      expect(response.body.email).toBe(authorWithoutBio.email);
    });

    it('should return 400 status for multiple validation errors', async () => {
      const invalidArticle = {
        content: 'Short',
        authorId: 'not-uuid',
      };

      const response = await request(app)
        .post('/api/articles')
        .send(invalidArticle);

      expect(response.status).toBe(400);
    });

    it('should return multiple error details in body for multiple validation errors', async () => {
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

    it('should return 400 status for empty strings in required fields', async () => {
      const invalidAuthor = {
        name: '',
        email: 'test@example.com',
      };

      const response = await request(app)
        .post('/api/authors')
        .send(invalidAuthor);

      expect(response.status).toBe(400);
    });

    it('should return validation error body for empty strings in required fields', async () => {
      const invalidAuthor = {
        name: '',
        email: 'test@example.com',
      };

      const response = await request(app)
        .post('/api/authors')
        .send(invalidAuthor);

      expect(response.body.error).toBeDefined();
      expect(response.body.error.status).toBe(400);
      expect(response.body.error.message).toBeDefined();
    });
  });

  describe('Params Validation', () => {
    it('should return 400 status for invalid UUID format in article ID params', async () => {
      const response = await request(app).get('/api/articles/invalid-uuid');

      expect(response.status).toBe(400);
    });

    it('should return validation error body for invalid UUID format in article ID params', async () => {
      const response = await request(app).get('/api/articles/invalid-uuid');

      expect(response.body.error).toBeDefined();
      expect(response.body.error.status).toBe(400);
      expect(response.body.error.message).toBeDefined();
      expect(response.body.error.details).toBeDefined();
    });

    it('should return 400 status for invalid UUID format in author ID params', async () => {
      const response = await request(app).get('/api/authors/invalid-uuid');

      expect(response.status).toBe(400);
    });

    it('should return validation error body for invalid UUID format in author ID params', async () => {
      const response = await request(app).get('/api/authors/invalid-uuid');

      expect(response.body.error).toBeDefined();
      expect(response.body.error.status).toBe(400);
      expect(response.body.error.message).toBeDefined();
      expect(response.body.error.details).toBeDefined();
    });

    it('should return 400 status for invalid UUID format in delete article endpoint', async () => {
      const response = await request(app).delete('/api/articles/not-a-uuid');

      expect(response.status).toBe(400);
    });

    it('should return validation error body for invalid UUID format in delete article endpoint', async () => {
      const response = await request(app).delete('/api/articles/not-a-uuid');

      expect(response.body.error).toBeDefined();
      expect(response.body.error.status).toBe(400);
      expect(response.body.error.message).toBeDefined();
    });

    it('should return 400 status for invalid UUID format in delete author endpoint', async () => {
      const response = await request(app).delete('/api/authors/not-a-uuid');

      expect(response.status).toBe(400);
    });

    it('should return validation error body for invalid UUID format in delete author endpoint', async () => {
      const response = await request(app).delete('/api/authors/not-a-uuid');

      expect(response.body.error).toBeDefined();
      expect(response.body.error.status).toBe(400);
      expect(response.body.error.message).toBeDefined();
    });

    it('should return 400 status for invalid UUID format in author articles endpoint', async () => {
      const response = await request(app).get(
        '/api/authors/invalid-uuid/articles'
      );

      expect(response.status).toBe(400);
    });

    it('should return validation error body for invalid UUID format in author articles endpoint', async () => {
      const response = await request(app).get(
        '/api/authors/invalid-uuid/articles'
      );

      expect(response.body.error).toBeDefined();
      expect(response.body.error.status).toBe(400);
      expect(response.body.error.message).toBeDefined();
    });
  });

  describe('Error Response Format', () => {
    it('should return 400 status for error response format validation', async () => {
      const response = await request(app).post('/api/articles').send({});

      expect(response.status).toBe(400);
    });

    it('should return proper error structure body with details array', async () => {
      const response = await request(app).post('/api/articles').send({});

      expect(response.body.error).toBeDefined();
      expect(response.body.error.status).toBe(400);
      expect(response.body.error.message).toBeDefined();
      expect(Array.isArray(response.body.error.details)).toBe(true);
    });

    it('should return 400 status for validation error details format check', async () => {
      const invalidArticle = {
        title: 'Test',
        content: 'Short',
        authorId: 'not-uuid',
      };

      const response = await request(app)
        .post('/api/articles')
        .send(invalidArticle);

      expect(response.status).toBe(400);
    });

    it('should include field and message in validation error details body', async () => {
      const invalidArticle = {
        title: 'Test',
        content: 'Short',
        authorId: 'not-uuid',
      };

      const response = await request(app)
        .post('/api/articles')
        .send(invalidArticle);

      expect(response.body.error.details).toBeDefined();
      response.body.error.details.forEach((detail) => {
        expect(detail).toHaveProperty('field');
        expect(detail).toHaveProperty('message');
        expect(typeof detail.field).toBe('string');
        expect(typeof detail.message).toBe('string');
      });
    });
  });
});
