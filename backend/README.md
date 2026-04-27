Tanàna Madio backend placeholder

Setup:

1. Copy `.env.example` to `.env` and configure your PostgreSQL credentials.
2. Install dependencies: `npm install`
3. Load DB schema: `psql -h <host> -U <user> -d <db> -f src/config/schema.sql`
4. Run dev server: `npm run dev`
