import { z } from 'zod';


export const authorSchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(100, 'Too Long'),
    email: z.string().trim().pipe(z.email('Invalid email format').toLowerCase()),
    bio: z.string().trim().optional(),

}
);

export const authorIdSchema = z.object({

    id: z.string().uuidv4()
}
);
