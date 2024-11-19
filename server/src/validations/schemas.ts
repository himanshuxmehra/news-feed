import { z } from 'zod';

export const authSchemas = {
  register: z.object({
    body: z.object({
      email: z.string().email('Invalid email'),
      password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(
          /[^A-Za-z0-9]/,
          'Password must contain at least one special character',
        ),
      name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters'),
    }),
  }),

  login: z.object({
    body: z.object({
      email: z.string().email('Invalid email'),
      password: z.string().min(1, 'Password is required'),
    }),
  }),

  changePassword: z.object({
    body: z.object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(
          /[^A-Za-z0-9]/,
          'Password must contain at least one special character',
        ),
    }),
  }),
};

export const postSchemas = {
  create: z.object({
    body: z.object({
      content: z
        .string()
        .min(1, 'Content is required')
        .max(1000, 'Content cannot exceed 1000 characters'),
      mediaUrls: z.array(z.string().url('Invalid URL')).optional(),
      parentPostId: z.string().uuid('Invalid post ID').optional(),
    }),
  }),

  update: z.object({
    body: z.object({
      content: z
        .string()
        .min(1, 'Content is required')
        .max(1000, 'Content cannot exceed 1000 characters'),
      mediaUrls: z.array(z.string().url('Invalid URL')).optional(),
    }),
    params: z.object({
      id: z.string().uuid('Invalid post ID'),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().uuid('Invalid post ID'),
    }),
  }),

  getMany: z.object({
    query: z.object({
      sort: z.enum(['date', 'likes', 'replies']).optional().default('date'),
      order: z.enum(['asc', 'desc']).optional().default('desc'),
      page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
      limit: z
        .string()
        .regex(/^\d+$/)
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit cannot exceed 100')
        .transform(Number)
        .optional()
        .default('20'),
    }),
  }),

  search: z.object({
    query: z.object({
      q: z
        .string()
        .min(1, 'Search query is required')
        .max(100, 'Search query too long'),
      sort: z
        .enum(['relevance', 'date', 'likes'])
        .optional()
        .default('relevance'),
      order: z.enum(['asc', 'desc']).optional().default('desc'),
      page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
      limit: z
        .string()
        .regex(/^\d+$/)
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit cannot exceed 100')
        .transform(Number)
        .optional()
        .default('20'),
    }),
  }),
};

// --Needs improvement
// export const uploadSchemas = {
//   upload: z.object({
//     files: z
//       .array(
//         z.object({
//           mimetype: z
//             .string()
//             .regex(/^image\/(jpeg|png|gif)$/, 'Invalid file type'),
//           size: z.number().max(5 * 1024 * 1024, 'File size cannot exceed 5MB'),
//         }),
//       )
//       .max(4, 'Cannot upload more than 4 files'),
//   }),

//   delete: z.object({
//     body: z.object({
//       url: z.string().url('Invalid URL'),
//     }),
//   }),
// };

export const likeSchemas = {
  checkLikeStatus: z.object({
    params: z.object({
      postId: z.string().uuid('Invalid post ID'),
    }),
  }),
};

// Optional: Common reusable schemas
export const commonSchemas = {
  pagination: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
    limit: z
      .string()
      .regex(/^\d+$/)
      .min(1, 'Limit must be at least 1')
      .max(100, 'Limit cannot exceed 100')
      .transform(Number)
      .optional()
      .default('20'),
  }),

  uuid: z.string().uuid('Invalid ID'),

  url: z.string().url('Invalid URL'),

  dateRange: z.object({
    from: z.string().datetime(),
    to: z.string().datetime(),
  }),
};

export const userSchemas = {
  create: z.object({
    body: z.object({
      email: z.string().email('Invalid email address'),
      password: z
        .string()
        .min(6, 'Password must be at least 6 characters long'),
      name: z.string().min(1, 'Name is required'),
    }),
  }),
  getByEmail: z.object({
    params: z.object({
      email: z.string().email('Invalid email address'),
    }),
  }),
  getById: z.object({
    params: z.object({
      id: z.string().uuid('Invalid user ID'),
    }),
  }),
};
