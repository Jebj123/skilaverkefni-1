import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('Error Handler', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe('Validation Errors (ZodError)', () => {
    it('should return 400 status for validation errors', async () => {
      const response = await request(app).post('/api/articles').send({});

      expect(response.status).toBe(400);
    });

    it('should return error body with status and message for validation errors', async () => {
      const response = await request(app).post('/api/articles').send({});

      expect(response.body.error).toBeDefined();
      expect(response.body.error.status).toBe(400);
      expect(response.body.error.message).toBeDefined();
    });

    it('should return 400 status for validation errors with details', async () => {
      const response = await request(app).post('/api/articles').send({});

      expect(response.status).toBe(400);
    });

    it('should format validation error body with details array', async () => {
      const response = await request(app).post('/api/articles').send({});

      expect(response.body.error.status).toBe(400);
      expect(response.body.error.message).toBeDefined();
      expect(Array.isArray(response.body.error.details)).toBe(true);
      expect(response.body.error.details.length).toBeGreaterThan(0);
    });

    it('should return 400 status when validation has field path errors', async () => {
      const invalidData = {
        title: '',
        content: 'short',
        authorId: 'invalid',
      };

      const response = await request(app)
        .post('/api/articles')
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it('should include field paths in validation error details body', async () => {
      const invalidData = {
        title: '',
        content: 'short',
        authorId: 'invalid',
      };

      const response = await request(app)
        .post('/api/articles')
        .send(invalidData);

      expect(response.body.error.details).toBeDefined();
      response.body.error.details.forEach((detail) => {
        expect(detail.field).toBeDefined();
        expect(detail.message).toBeDefined();
      });
    });
  });

  describe('Not Found Errors', () => {
    it('should return 404 status when article not found', async () => {
      const response = await request(app).get(
        '/api/articles/a02a8897-b3b9-40d1-9b3a-e0010fd6454f'
      );

      expect(response.status).toBe(404);
    });

    it('should return error body with status and message when article not found', async () => {
      const response = await request(app).get(
        '/api/articles/a02a8897-b3b9-40d1-9b3a-e0010fd6454f'
      );

      expect(response.body.error).toBeDefined();
      expect(response.body.error.status).toBe(404);
      expect(response.body.error.message).toBeDefined();
    });

    it('should return 404 status when author not found', async () => {
      const response = await request(app).get(
        '/api/authors/8cb5070c-a1be-42a6-969b-51e3bfe69bcc'
      );

      expect(response.status).toBe(404);
    });

    it('should return error body with status and message when author not found', async () => {
      const response = await request(app).get(
        '/api/authors/8cb5070c-a1be-42a6-969b-51e3bfe69bcc'
      );

      expect(response.body.error).toBeDefined();
      expect(response.body.error.status).toBe(404);
      expect(response.body.error.message).toBeDefined();
    });

    it('should return 404 status when deleting non-existent article', async () => {
      const response = await request(app).delete(
        '/api/articles/a02a8897-b3b9-40d1-9b3a-e0010fd6454f'
      );

      expect(response.status).toBe(404);
    });

    it('should return error body when deleting non-existent article', async () => {
      const response = await request(app).delete(
        '/api/articles/a02a8897-b3b9-40d1-9b3a-e0010fd6454f'
      );

      expect(response.body.error).toBeDefined();
      expect(response.body.error.status).toBe(404);
      expect(response.body.error.message).toBeDefined();
    });

    it('should return 404 status when deleting non-existent author', async () => {
      const response = await request(app).delete(
        '/api/authors/8cb5070c-a1be-42a6-969b-51e3bfe69bcc'
      );

      expect(response.status).toBe(404);
    });

    it('should return error body when deleting non-existent author', async () => {
      const response = await request(app).delete(
        '/api/authors/8cb5070c-a1be-42a6-969b-51e3bfe69bcc'
      );

      expect(response.body.error).toBeDefined();
      expect(response.body.error.status).toBe(404);
      expect(response.body.error.message).toBeDefined();
    });

    it('should return 404 status when getting articles for non-existent author', async () => {
      const response = await request(app).get(
        '/api/authors/8cb5070c-a1be-42a6-969b-51e3bfe69bcc/articles'
      );

      expect(response.status).toBe(404);
    });

    it('should return error body when getting articles for non-existent author', async () => {
      const response = await request(app).get(
        '/api/authors/8cb5070c-a1be-42a6-969b-51e3bfe69bcc/articles'
      );

      expect(response.body.error).toBeDefined();
      expect(response.body.error.status).toBe(404);
      expect(response.body.error.message).toBeDefined();
    });
  });

  //   describe('Error Response Format', () => {
  //     it('should always include success: false in error responses', async () => {
  //       const response = await request(app).post('/api/articles').send({});

  //       expect(response.body.error).toBeDefined();
  //       expect(response.body.error.success).toBe(false);
  //     });

  //     it('should always include message in error responses', async () => {
  //       const response = await request(app).get('/api/articles/invalid-id');

  //       expect(response.body.error).toBeDefined();
  //       expect(response.body.error.message).toBeDefined();
  //       expect(typeof response.body.error.message).toBe('string');
  //     });

  //     it('should include details only for validation errors', async () => {
  //       // Validation error - should have details
  //       const validationResponse = await request(app)
  //         .post('/api/articles')
  //         .send({});
  //       expect(validationResponse.body.error.details).toBeDefined();

  //       // Not found error - should not have details
  //       const notFoundResponse = await request(app).get(
  //         '/api/articles/a02a8897-b3b9-40d1-9b3a-e0010fd6454f'
  //       );
  //       expect(notFoundResponse.body.error.details).toBeUndefined();
  //     });

  //     it('should have consistent error structure across different error types', async () => {
  //       const responses = [
  //         await request(app).post('/api/articles').send({}), // Validation error
  //         await request(app).get(
  //           '/api/articles/a02a8897-b3b9-40d1-9b3a-e0010fd6454f'
  //         ), // Not found
  //       ];

  //       responses.forEach((response) => {
  //         expect(response.body.error).toBeDefined();
  //         expect(response.body.error.success).toBe(false);
  //         expect(response.body.error.message).toBeDefined();
  //       });
  //     });
  //   });

  //   describe('HTTP Status Codes', () => {
  //     it('should return 400 for validation errors', async () => {
  //       const response = await request(app).post('/api/articles').send({});
  //       expect(response.status).toBe(400);
  //     });

  //     it('should return 404 for not found errors', async () => {
  //       const response = await request(app).get(
  //         '/api/articles/a02a8897-b3b9-40d1-9b3a-e0010fd6454f'
  //       );
  //       expect(response.status).toBe(404);
  //     });

  //     it('should return 201 for successful creation', async () => {
  //       const newArticle = {
  //         title: 'Test Article',
  //         content: 'This is enough content for testing',
  //         authorId: '8cb5070c-a1be-42a6-969b-51e3bfe69bcc',
  //       };

  //       const response = await request(app)
  //         .post('/api/articles')
  //         .send(newArticle);
  //       expect(response.status).toBe(201);
  //     });

  //     it('should return 200 for successful GET requests', async () => {
  //       const response = await request(app).get('/api/articles');
  //       expect(response.status).toBe(200);
  //     });
  //   });
});
