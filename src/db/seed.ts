import { reset, seed } from 'drizzle-seed';
import { db, sql } from './connection.ts';
import { schema } from './schema/index.ts';

await reset(db, schema);

await seed(db, schema).refine((f) => {
  return {
    rooms: {
      count: 20,
      columns: {
        name: f.companyName(),
        description: f.loremIpsum(),
        createdAt: f.date({
          maxDate: new Date(),
          minDate: new Date('2025-01-01'),
        }),
      },
      with: {
        questions: 5,
      },
    },
    questions: {
      columns: {
        question: f.city(),
        createdAt: f.date({
          maxDate: new Date(),
          minDate: new Date('2025-01-01'),
        }),
      },
    },
  };
});

await sql.end();
//biome-ignore lint/suspicious/noConsole: only for development
console.log('Database reset and seeded successfully.');
