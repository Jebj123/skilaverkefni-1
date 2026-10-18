import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('Authors Routes', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe('GET /api/authors', () => {
    it('should return 200 status', async () => {
      const response = await request(app).get('/api/authors');

      expect(response.status).toBe(200);
    });

    it('should return an array in response body', async () => {
      const response = await request(app).get('/api/authors');

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/authors/:id', () => {
    it('should return 400 status for invalid UUID format', async () => {
      const response = await request(app).get('/api/authors/invalid-id');

      expect(response.status).toBe(400);
    });

    it('should return error body with details for invalid UUID format', async () => {
      const response = await request(app).get('/api/authors/invalid-id');

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBeDefined();
      expect(response.body.error.details).toBeDefined();
    });

    it('should return 404 status when author not found', async () => {
      const response = await request(app).get(
        '/api/authors/8cb5070c-a1be-42a6-969b-51e3bfe69bcc'
      );

      expect(response.status).toBe(404);
    });

    it('should return error body when author not found', async () => {
      const response = await request(app).get(
        '/api/authors/8cb5070c-a1be-42a6-969b-51e3bfe69bcc'
      );

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBeDefined();
    });
  });

  describe('GET /api/authors/:id/articles', () => {
    it('should return 400 status for invalid UUID in articles endpoint', async () => {
      const response = await request(app).get(
        '/api/authors/invalid-id/articles'
      );

      expect(response.status).toBe(400);
    });

    it('should return error body for invalid UUID in articles endpoint', async () => {
      const response = await request(app).get(
        '/api/authors/invalid-id/articles'
      );

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBeDefined();
    });

    it('should return 404 status when author not found', async () => {
      const response = await request(app).get(
        '/api/authors/8cb5070c-a1be-42a6-969b-51e3bfe69bcc/articles'
      );

      expect(response.status).toBe(404);
    });

    it('should return error body when author not found', async () => {
      const response = await request(app).get(
        '/api/authors/8cb5070c-a1be-42a6-969b-51e3bfe69bcc/articles'
      );

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBeDefined();
    });
  });

  describe('POST /api/authors', () => {
    it('should return 400 status when name is missing', async () => {
      const invalidAuthor = {
        email: 'test@example.com',
        bio: 'Some bio',
      };

      const response = await request(app)
        .post('/api/authors')
        .send(invalidAuthor);

      expect(response.status).toBe(400);
    });

    it('should return validation error body when name is missing', async () => {
      const invalidAuthor = {
        email: 'test@example.com',
        bio: 'Some bio',
      };

      const response = await request(app)
        .post('/api/authors')
        .send(invalidAuthor);

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBeDefined();
      expect(response.body.error.details).toBeDefined();
    });

    it('should return 400 status when email is invalid', async () => {
      const invalidAuthor = {
        name: 'Test User',
        email: 'invalid-email',
        bio: 'Some bio',
      };

      const response = await request(app)
        .post('/api/authors')
        .send(invalidAuthor);

      expect(response.status).toBe(400);
    });

    it('should return validation error body when email is invalid', async () => {
      const invalidAuthor = {
        name: 'Test User',
        email: 'invalid-email',
        bio: 'Some bio',
      };

      const response = await request(app)
        .post('/api/authors')
        .send(invalidAuthor);

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBeDefined();
    });

    it('should return 400 status when name is empty string', async () => {
      const invalidAuthor = {
        name: '',
        email: 'test@example.com',
      };

      const response = await request(app)
        .post('/api/authors')
        .send(invalidAuthor);

      expect(response.status).toBe(400);
    });

    it('should return validation error body when name is empty string', async () => {
      const invalidAuthor = {
        name: '',
        email: 'test@example.com',
      };

      const response = await request(app)
        .post('/api/authors')
        .send(invalidAuthor);

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBeDefined();
    });

    it('should return 400 status with multiple validation errors', async () => {
      const invalidAuthor = {
        name: '',
        email: 'not-an-email',
      };

      const response = await request(app)
        .post('/api/authors')
        .send(invalidAuthor);

      expect(response.status).toBe(400);
    });

    it('should return multiple error details in body with multiple validation errors', async () => {
      const invalidAuthor = {
        name: '',
        email: 'not-an-email',
      };

      const response = await request(app)
        .post('/api/authors')
        .send(invalidAuthor);

      expect(response.body.error).toBeDefined();
      expect(response.body.error.details).toBeDefined();
      expect(response.body.error.details.length).toBeGreaterThan(1);
    });

    it('should return 400 status when body is empty', async () => {
      const response = await request(app).post('/api/authors').send({});

      expect(response.status).toBe(400);
    });

    it('should return error body when body is empty', async () => {
      const response = await request(app).post('/api/authors').send({});

      expect(response.body.error).toBeDefined();
    });

    it('should return 201 status when creating author with valid data', async () => {
      const newAuthor = {
        name: 'Test Author',
        email: 'test@example.com',
        bio: 'Test bio',
      };

      const response = await request(app).post('/api/authors').send(newAuthor);

      expect(response.status).toBe(201);
    });

    it('should return created author in body when creating with valid data', async () => {
      const newAuthor = {
        name: 'Test Author',
        email: 'test@example.com',
        bio: 'Test bio',
      };

      const response = await request(app).post('/api/authors').send(newAuthor);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.name).toBe(newAuthor.name);
      expect(response.body.email).toBe(newAuthor.email);
      expect(response.body.bio).toBe(newAuthor.bio);
    });

    it('should return 201 status when creating author without bio (optional field)', async () => {
      const newAuthor = {
        name: 'Test Author',
        email: 'test@example.com',
      };

      const response = await request(app).post('/api/authors').send(newAuthor);

      expect(response.status).toBe(201);
    });

    it('should return created author in body when creating without bio (optional field)', async () => {
      const newAuthor = {
        name: 'Test Author',
        email: 'test@example.com',
      };

      const response = await request(app).post('/api/authors').send(newAuthor);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.name).toBe(newAuthor.name);
      expect(response.body.email).toBe(newAuthor.email);
    });
  });

  describe('DELETE /api/authors/:id', () => {
    it('should return 400 status for invalid UUID in delete', async () => {
      const response = await request(app).delete('/api/authors/not-a-uuid');

      expect(response.status).toBe(400);
    });

    it('should return validation error body for invalid UUID in delete', async () => {
      const response = await request(app).delete('/api/authors/not-a-uuid');

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBe('Validation failed');
    });

    it('should return 404 status when author to delete not found', async () => {
      const response = await request(app).delete(
        '/api/authors/8cb5070c-a1be-42a6-969b-51e3bfe69bcc'
      );

      expect(response.status).toBe(404);
    });

    it('should return error body when author to delete not found', async () => {
      const response = await request(app).delete(
        '/api/authors/8cb5070c-a1be-42a6-969b-51e3bfe69bcc'
      );

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBe('Author not found');
    });
  });
});
