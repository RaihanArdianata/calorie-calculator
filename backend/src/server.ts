import { serve } from '@hono/node-server';
import app from './index';

serve(app);