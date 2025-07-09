import { fastify } from 'fastify';
import fastifyCors from '@fastify/cors';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { env } from './env.ts';

import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getRoomsRoute } from './http/routes/get-rooms.ts';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: 'localhost:5173',
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get('/health', () => {
  return { status: 'ok' };
});

app.register(getRoomsRoute)

app.listen({ port: env.PORT });