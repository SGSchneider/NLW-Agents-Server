import { fastify } from 'fastify';
import fastifyCors from '@fastify/cors';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { env } from './env.ts';

import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getRoomsRoute } from './http/routes/get-rooms.ts';
import { createRoomsRoute } from './http/routes/create-room.ts';
import { getRoomQuestionsRoute } from './http/routes/get-room-questions.ts';
import { createQuestionRoute } from './http/routes/creat-question.ts';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: 'http://localhost:5173',
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get('/health', () => {
  return { status: 'ok' };
});

app.register(getRoomsRoute)
app.register(createRoomsRoute)
app.register(getRoomQuestionsRoute)
app.register(createQuestionRoute)

app.listen({ port: env.PORT });