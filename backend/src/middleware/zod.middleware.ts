import { Context, Next } from 'hono';
import { ZodError, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.parseBody();
      const parsedData = schema.parse(body);
      c.set('parsedData', parsedData);
      await next();
    } catch (error) {

      if (error instanceof SyntaxError) {
        return c.json({ error: 'Invalid JSON format' }, 400);
      } else if (error instanceof ZodError) {
        return c.json({
          error: 'Validation failed', details: error.errors.map(({ message, path, ...a }) => {
            return ({ message, path });
          })
        }, 400);
      } else {
        return c.json({ error: 'Server error' }, 500);
      }
    }
  };
};
