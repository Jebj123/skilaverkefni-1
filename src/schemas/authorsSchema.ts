import { z } from 'zod';


export const authorSchema = z.object({
    name: z.string({ error: 'Name is required' }).trim().min(1).max(100, 'Name must be at most 100 characters'),
    email: z.string({ error: 'Email is required' }).trim().pipe(z.email('Invalid email format').toLowerCase()),
    bio: z.string().trim().optional(),

}
);

export const authorIdSchema = z.object({

    id: z.string().uuidv4()
}
);
