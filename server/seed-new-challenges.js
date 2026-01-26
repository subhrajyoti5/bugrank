require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bugrank_auth',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

const newChallenges = [
  {
    id: 'challenge-16',
    title: 'Fix Diamond Problem with Virtual Inheritance',
    description: 'This C++ code has a diamond inheritance problem causing ambiguous calls. The GameObject class inherits from both InputComponent and RenderComponent, which both inherit from Component. Fix this using virtual inheritance.',
    difficulty: 'medium',
    language: 'cpp',
    buggyCode: `#include <iostream>

class Component {
public:
    virtual void initialize() {
        std::cout << "Component initialized\\n";
    }
    virtual ~Component() {}
};

class InputComponent : public Component {
public:
    void initialize() override {
        std::cout << "InputComponent initialized\\n";
    }
};

class RenderComponent : public Component {
public:
    void initialize() override {
        std::cout << "RenderComponent initialized\\n";
    }
};

class GameObject : public InputComponent, public RenderComponent {
public:
    void initialize() override {
        std::cout << "GameObject initialized\\n";
    }
};

int main() {
    GameObject obj;
    obj.initialize();
    std::cout << "Ambiguity resolved with virtual inheritance\\n";
    return 0;
}`,
    expectedOutput: 'GameObject initialized\nAmbiguity resolved with virtual inheritance',
    timeLimit: 600,
    baseScore: 150,
    testCase: {
      input: '',
      expectedOutput: 'GameObject initialized\nAmbiguity resolved with virtual inheritance\n',
    }
  },
  {
    id: 'challenge-17',
    title: 'Fix Race Condition in Thread Synchronization',
    description: 'This multithreaded C++ program has a race condition. Multiple threads are accessing and modifying the shared counter without proper synchronization. Add mutex locks to prevent data races.',
    difficulty: 'hard',
    language: 'cpp',
    buggyCode: `#include <iostream>
#include <thread>
#include <vector>

int counter = 0;

void incrementCounter(int iterations) {
    for (int i = 0; i < iterations; i++) {
        counter++; // Bug: Race condition - no synchronization
    }
}

int main() {
    const int NUM_THREADS = 4;
    const int ITERATIONS = 1000;
    
    std::vector<std::thread> threads;
    
    for (int i = 0; i < NUM_THREADS; i++) {
        threads.emplace_back(incrementCounter, ITERATIONS);
    }
    
    for (auto& t : threads) {
        t.join();
    }
    
    std::cout << "Final counter value: " << counter << std::endl;
    std::cout << "Expected: " << (NUM_THREADS * ITERATIONS) << std::endl;
    
    return 0;
}`,
    expectedOutput: 'Final counter value: 4000\nExpected: 4000',
    timeLimit: 600,
    baseScore: 200,
    testCase: {
      input: '',
      expectedOutput: 'Final counter value: 4000\nExpected: 4000\n',
    }
  },
  {
    id: 'challenge-18',
    title: 'Fix Template Specialization Bug',
    description: 'This C++ template has a bug in partial specialization. The template should provide optimized behavior for pointer types, but the specialization is incorrectly defined. Fix the template specialization syntax.',
    difficulty: 'medium',
    language: 'cpp',
    buggyCode: `#include <iostream>

template<typename T>
class Container {
private:
    T data;
public:
    Container(T val) : data(val) {}
    
    void process() {
        std::cout << "Processing regular type: " << data << std::endl;
    }
};

// Bug: Incorrect template specialization syntax
template<typename T>
class Container<T> {  // Should be Container<T*>
private:
    T* data;
public:
    Container(T* val) : data(val) {}
    
    void process() {
        if (data) {
            std::cout << "Processing pointer type: " << *data << std::endl;
        }
    }
};

int main() {
    int value = 42;
    Container<int> c1(value);
    Container<int*> c2(&value);
    
    c1.process();
    c2.process();
    
    return 0;
}`,
    expectedOutput: 'Processing regular type: 42\nProcessing pointer type: 42',
    timeLimit: 600,
    baseScore: 150,
    testCase: {
      input: '',
      expectedOutput: 'Processing regular type: 42\nProcessing pointer type: 42\n',
    }
  }
];

async function seedNewChallenges() {
  const client = await pool.connect();
  
  try {
    console.log('Seeding new challenges...');
    
    for (const challenge of newChallenges) {
      await client.query(
        `INSERT INTO challenges (id, title, description, difficulty, language, buggy_code, expected_output, time_limit, base_score, test_cases, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO NOTHING`,
        [
          challenge.id,
          challenge.title,
          challenge.description,
          challenge.difficulty,
          challenge.language,
          challenge.buggyCode,
          challenge.expectedOutput,
          challenge.timeLimit,
          challenge.baseScore,
          JSON.stringify(challenge.testCase),
          new Date()
        ]
      );
      console.log(`✅ Inserted ${challenge.id}: ${challenge.title}`);
    }
    
    console.log(`\n✅ Successfully seeded ${newChallenges.length} new challenges!`);
  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedNewChallenges();
