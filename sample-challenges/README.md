# Bugrank Challenge Data Seed Script

This directory contains sample buggy code challenges for Bugrank.

## How to Seed Challenges to Firestore

### Option 1: Manual Firebase Console
1. Go to Firebase Console > Firestore Database
2. Create a new collection called `challenges`
3. Add documents with the following structure:

```json
{
  "id": "challenge-1",
  "title": "Fix Array Index Bug",
  "description": "This C++ code has an array index out of bounds bug. The loop iterates one time too many, causing undefined behavior. Fix the loop condition to prevent accessing an invalid index.",
  "difficulty": "easy",
  "language": "cpp",
  "buggyCode": "See challenge1.cpp",
  "expectedOutput": "10 20 30 40 50",
  "timeLimit": 300,
  "baseScore": 100,
  "createdAt": "Current timestamp"
}
```

### Option 2: Use Firebase Admin SDK Script

Create a Node.js script to seed challenges:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const challenges = [
  {
    id: 'challenge-1',
    title: 'Fix Array Index Bug',
    description: 'This C++ code has an array index out of bounds bug...',
    difficulty: 'easy',
    language: 'cpp',
    buggyCode: `#include <iostream>...`,
    expectedOutput: '10 20 30 40 50',
    timeLimit: 300,
    baseScore: 100,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  // Add more challenges...
];

async function seedChallenges() {
  for (const challenge of challenges) {
    await db.collection('challenges').doc(challenge.id).set(challenge);
    console.log(`Added challenge: ${challenge.id}`);
  }
}

seedChallenges();
```

## Challenge Structure

Each challenge should have:
- **id**: Unique identifier
- **title**: Short descriptive title
- **description**: Detailed explanation of the bug
- **difficulty**: 'easy', 'medium', or 'hard'
- **language**: 'cpp' or 'java'
- **buggyCode**: The code with bugs
- **expectedOutput**: What the fixed code should output
- **timeLimit**: Seconds allowed
- **baseScore**: Starting points (before penalties)
- **createdAt**: Timestamp

## Example Challenges

1. **Array Index Bug** (Easy) - Loop condition error
2. **Memory Leak** (Medium) - Missing destructor
3. **Null Pointer** (Easy) - Null check after use
4. **Race Condition** (Hard) - Multithreading bug
5. **Integer Overflow** (Medium) - Arithmetic bug
