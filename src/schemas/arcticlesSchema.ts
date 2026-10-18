import { z } from 'zod';

export const articleSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(100, 'Too Long'),
    content: z.string().trim().min(10, 'Content must be at least 10 characters'),
    authorId: z.uuidv4(),
});

export const articleIdSchema = z.object({
    id: z.string().uuidv4()
});
