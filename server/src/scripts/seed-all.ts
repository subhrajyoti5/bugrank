import { challengeDb } from '../data/storage';
import { seedChallenges } from '../data/seedChallenges';
import pool from '../config/database';

async function seedAll() {
  console.log('🚀 Starting manual database seeding...');
  
  try {
    const existing = await challengeDb.getAll();
    console.log(`📊 Current challenges in DB: ${existing.length}`);
    
    let seededCount = 0;
    for (const challenge of seedChallenges) {
      const exists = existing.find(c => c.id === challenge.id);
      if (!exists) {
        await challengeDb.create(challenge);
        console.log(`✅ Seeded: ${challenge.id} - ${challenge.title}`);
        seededCount++;
      } else {
        console.log(`⏩ Skipped (already exists): ${challenge.id}`);
      }
    }
    
    console.log(`\n🎉 Seeding complete! Total new challenges added: ${seededCount}`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seedAll();
