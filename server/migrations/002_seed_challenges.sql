-- Seed script to insert challenges from code into database
-- Run this after the main migration

-- You'll need to run this with the challenges data from seedChallenges.ts
-- For now, this is a template. The actual seeding should be done via the app or a Node script.

-- Example challenge insert (you can modify based on your actual challenges):
-- INSERT INTO challenges (id, title, description, difficulty, buggy_code, correct_code, test_cases, time_limit, points, tags)
-- VALUES 
-- ('challenge-1', 'Array Index Bug', 'Fix the array index out of bounds error', 'easy', 
--  'buggy code here', 'correct code here', '[]'::jsonb, 300, 100, ARRAY['arrays', 'debugging']);

-- To seed challenges from your Node.js app, add this to server/src/index.ts after DB connection:
-- import { seedChallenges } from './data/seedChallenges';
-- import { challengeDb } from './data/storage';
-- 
-- // Seed challenges on startup if database is empty
-- (async () => {
--   const existingChallenges = await challengeDb.getAll();
--   if (existingChallenges.length === 0) {
--     console.log('Seeding challenges to database...');
--     for (const challenge of seedChallenges) {
--       await challengeDb.create(challenge);
--     }
--     console.log(`✅ Seeded ${seedChallenges.length} challenges`);
--   }
-- })();

SELECT 'Challenges table ready for seeding. Use Node.js script to seed from seedChallenges.ts' as message;
