import { z } from 'zod';

export const articleSchema = z.object({
    title: z.string({ error: 'Title is required' }).trim().min(1).max(100, 'Too Long'),
    content: z.string({ error: 'Content is required' }).trim().min(10, 'Content must be at least 10 characters'),
    authorId: z.uuidv4('Author ID must be a valid UUID'),
});

export const articleIdSchema = z.object({
    id: z.string().uuidv4()
});
