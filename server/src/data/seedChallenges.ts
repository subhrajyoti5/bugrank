import { Challenge } from '@bugrank/shared';

/**
 * Initial seed challenges for the platform
 * These will be loaded into memory when the server starts
 */
export const seedChallenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'Fix Array Index Bug',
    description: 'This C++ code has an array index out of bounds bug. The loop iterates one time too many, causing undefined behavior. Fix the loop condition to prevent accessing an invalid index.',
    difficulty: 'easy',
    language: 'cpp',
    buggyCode: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {10, 20, 30, 40, 50};
    
    // Bug: Loop goes beyond array bounds
    for(int i = 0; i <= numbers.size(); i++) {
        std::cout << numbers[i] << " ";
    }
    
    return 0;
}`,
    expectedOutput: '10 20 30 40 50',
    timeLimit: 300,
    baseScore: 100,
    createdAt: new Date('2026-01-01'),
  },
  {
    id: 'challenge-2',
    title: 'Fix Memory Leak',
    description: 'This C++ code has a memory leak because the Resource class allocates memory in the constructor but never frees it. Add a proper destructor to prevent memory leaks.',
    difficulty: 'medium',
    language: 'cpp',
    buggyCode: `#include <iostream>

class Resource {
public:
    int* data;
    
    Resource(int size) {
        data = new int[size];
    }
    
    // Bug: Missing destructor - memory leak
    void display() {
        std::cout << "Resource used\\n";
    }
};

int main() {
    Resource res(100);
    res.display();
    return 0;
}`,
    expectedOutput: 'Resource used',
    timeLimit: 600,
    baseScore: 150,
    createdAt: new Date('2026-01-02'),
  },
  {
    id: 'challenge-3',
    title: 'Fix Null Pointer Exception',
    description: 'This Java code attempts to use a null reference, causing a NullPointerException. Move the null check before using the variable to fix the bug.',
    difficulty: 'easy',
    language: 'java',
    buggyCode: `public class Main {
    public static void main(String[] args) {
        String text = null;
        
        // Bug: NullPointerException - checking null after use
        System.out.println(text.length());
        
        if (text != null) {
            System.out.println("Text is: " + text);
        }
    }
}`,
    expectedOutput: 'Null check passed',
    timeLimit: 300,
    baseScore: 100,
    createdAt: new Date('2026-01-03'),
  },
  {
    id: 'challenge-4',
    title: 'Fix Race Condition',
    description: 'This Java code has a race condition where multiple threads access a shared counter without synchronization. Add proper synchronization to ensure thread safety.',
    difficulty: 'hard',
    language: 'java',
    buggyCode: `public class Counter {
    private int count = 0;
    
    // Bug: No synchronization - race condition
    public void increment() {
        count++;
    }
    
    public int getCount() {
        return count;
    }
    
    public static void main(String[] args) throws InterruptedException {
        Counter counter = new Counter();
        
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                counter.increment();
            }
        });
        
        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                counter.increment();
            }
        });
        
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        
        System.out.println("Count: " + counter.getCount());
    }
}`,
    expectedOutput: 'Count: 2000',
    timeLimit: 900,
    baseScore: 200,
    createdAt: new Date('2026-01-04'),
  },
  {
    id: 'challenge-5',
    title: 'Fix Integer Overflow',
    description: 'This C++ code has an integer overflow bug when calculating the sum of large numbers. Use appropriate data types or checks to prevent overflow.',
    difficulty: 'medium',
    language: 'cpp',
    buggyCode: `#include <iostream>

int main() {
    int a = 2000000000;
    int b = 2000000000;
    
    // Bug: Integer overflow when adding large numbers
    int sum = a + b;
    
    std::cout << "Sum: " << sum << std::endl;
    
    return 0;
}`,
    expectedOutput: 'Sum: 4000000000',
    timeLimit: 600,
    baseScore: 150,
    createdAt: new Date('2026-01-05'),
  },
];
