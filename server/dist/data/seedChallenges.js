"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedChallenges = void 0;
/**
 * Initial seed challenges for the platform
 * These will be loaded into memory when the server starts
 * Focus on critical OOP concepts and OS-level bugs in C++
 */
exports.seedChallenges = [
    {
        id: 'challenge-1',
        title: 'Fix Memory Leak with Missing Destructor',
        description: 'This C++ class has a memory leak because the destructor is not properly implemented. The dynamically allocated data is never freed. Implement a proper destructor following RAII principle.',
        difficulty: 'easy',
        language: 'cpp',
        buggyCode: `#include <iostream>

class DataBuffer {
private:
    int* buffer;
    int size;
    
public:
    DataBuffer(int sz) : size(sz) {
        buffer = new int[size];
        for(int i = 0; i < size; i++) {
            buffer[i] = i * 10;
        }
    }
    
    // Bug: Missing destructor - memory leak
    
    void display() {
        std::cout << "Buffer initialized with size: " << size << std::endl;
    }
};

int main() {
    DataBuffer buf(100);
    buf.display();
    return 0;
}`,
        expectedOutput: 'Buffer initialized with size: 100',
        timeLimit: 600,
        baseScore: 100,
        testCase: {
            input: '',
            expectedOutput: 'Buffer initialized with size: 100\n',
        },
        createdAt: new Date('2026-01-01'),
    },
    {
        id: 'challenge-2',
        title: 'Fix Integer Overflow Bug',
        description: 'This C++ code has an integer overflow when summing large numbers. Use appropriate data types to handle large values.',
        difficulty: 'easy',
        language: 'cpp',
        buggyCode: `#include <iostream>

class Calculator {
private:
    int sum;
    
public:
    Calculator() : sum(0) {}
    
    void add(int value) {
        sum += value;  // Bug: Overflow with large numbers
    }
    
    void displaySum() {
        std::cout << "Sum: " << sum << std::endl;
    }
};

int main() {
    Calculator calc;
    calc.add(2000000000);
    calc.add(2000000000);
    calc.displaySum();
    return 0;
}`,
        expectedOutput: 'Sum: 4000000000',
        timeLimit: 600,
        baseScore: 100,
        testCase: {
            input: '',
            expectedOutput: 'Sum: 4000000000\n',
        },
        createdAt: new Date('2026-01-02'),
    },
    {
        id: 'challenge-3',
        title: 'Fix Const Correctness Violation',
        description: 'This C++ class violates const correctness by allowing modifications in const methods. Fix the const correctness issues to prevent unintended state changes.',
        difficulty: 'easy',
        language: 'cpp',
        buggyCode: `#include <iostream>

class Counter {
private:
    mutable int count;  // Should not use mutable incorrectly
    
public:
    Counter() : count(0) {}
    
    void increment() {
        count++;
    }
    
    // Bug: This method modifies state but is marked const
    void getCount() const {
        count++;  // This should not be allowed
        std::cout << "Count: " << count << std::endl;
    }
};

int main() {
    const Counter counter;
    counter.getCount();
    return 0;
}`,
        expectedOutput: 'Count: 1',
        timeLimit: 600,
        baseScore: 100,
        testCase: {
            input: '',
            expectedOutput: 'Count: 1\n',
        },
        createdAt: new Date('2026-01-03'),
    },
    {
        id: 'challenge-4',
        title: 'Fix Virtual Function Override Bug',
        description: 'This C++ code has a polymorphism bug where the derived class does not properly override the virtual function due to signature mismatch or missing override keyword.',
        difficulty: 'medium',
        language: 'cpp',
        buggyCode: `#include <iostream>

class Shape {
public:
    virtual void calculateArea() const {
        std::cout << "Calculating area...\\n";
    }
    virtual ~Shape() {}
};

class Circle : public Shape {
private:
    double radius;
    
public:
    Circle(double r) : radius(r) {}
    
    // Bug: Signature doesn't match - missing const
    void calculateArea() {
        std::cout << "Circle area: " << (3.14 * radius * radius) << std::endl;
    }
};

int main() {
    const Circle circle(5.0);
    circle.calculateArea();
    return 0;
}`,
        expectedOutput: 'Circle area: 78.5',
        timeLimit: 600,
        baseScore: 150,
        testCase: {
            input: '',
            expectedOutput: 'Dog sound: Woof!\n',
        },
        createdAt: new Date('2026-01-04'),
    },
    {
        id: 'challenge-5',
        title: 'Fix Missing Virtual Destructor',
        description: 'This C++ code has a critical bug where the base class destructor is not virtual. This causes incomplete cleanup when deleting derived class objects through base class pointers.',
        difficulty: 'medium',
        language: 'cpp',
        buggyCode: `#include <iostream>

class Animal {
protected:
    char* name;
    
public:
    Animal(const char* n) {
        name = new char[50];
        std::cout << "Animal created\\n";
    }
    
    // Bug: Destructor not virtual - derived destructor won't be called
    ~Animal() {
        delete[] name;
        std::cout << "Animal destroyed\\n";
    }
};

class Dog : public Animal {
private:
    char* breed;
    
public:
    Dog(const char* n, const char* b) : Animal(n) {
        breed = new char[50];
        std::cout << "Dog created\\n";
    }
    
    ~Dog() {
        delete[] breed;
        std::cout << "Dog destroyed\\n";
    }
};

int main() {
    Animal* dog = new Dog("Buddy", "Labrador");
    delete dog;  // Only Animal::~Animal() is called, not Dog::~Dog()
    return 0;
}`,
        expectedOutput: 'Dog destroyed\\nAnimal destroyed',
        timeLimit: 600,
        baseScore: 150,
        testCase: {
            input: '',
            expectedOutput: 'Transfer completed efficiently\n',
        },
        createdAt: new Date('2026-01-05'),
    },
    {
        id: 'challenge-6',
        title: 'Fix Shallow Copy Bug',
        description: 'This C++ class has a shallow copy problem in the copy constructor. Multiple objects will point to the same dynamically allocated data, causing crashes and double deletion.',
        difficulty: 'medium',
        language: 'cpp',
        buggyCode: `#include <iostream>
#include <cstring>

class String {
private:
    char* data;
    int length;
    
public:
    String(const char* str) {
        length = strlen(str);
        data = new char[length + 1];
        strcpy(data, str);
    }
    
    // Bug: Shallow copy - both objects point to same memory
    String(const String& other) {
        data = other.data;  // Should deep copy
        length = other.length;
    }
    
    ~String() {
        delete[] data;
    }
    
    void display() const {
        std::cout << "String: " << data << std::endl;
    }
};

int main() {
    String s1("Hello");
    String s2 = s1;  // Shallow copy - both reference same memory
    s1.display();
    s2.display();
    return 0;
}`,
        expectedOutput: 'String: Hello',
        timeLimit: 600,
        baseScore: 150,
        testCase: {
            input: '',
            expectedOutput: 'Original: Hello\nCopy: Hello\n',
        },
        createdAt: new Date('2026-01-06'),
    },
    {
        id: 'challenge-7',
        title: 'Fix Race Condition in Singleton Pattern',
        description: 'This C++ singleton implementation has a race condition in the getInstance() method. Multiple threads could create multiple instances simultaneously. Fix it using thread-safe initialization.',
        difficulty: 'hard',
        language: 'cpp',
        buggyCode: `#include <iostream>
#include <thread>
#include <vector>

class Singleton {
private:
    static Singleton* instance;
    int id;
    
    Singleton() : id(0) {}
    
public:
    // Bug: Not thread-safe - race condition
    static Singleton* getInstance() {
        if(instance == nullptr) {
            instance = new Singleton();
        }
        return instance;
    }
    
    int getId() const { return id; }
};

Singleton* Singleton::instance = nullptr;

int main() {
    std::vector<std::thread> threads;
    for(int i = 0; i < 10; i++) {
        threads.emplace_back([]() {
            Singleton* s = Singleton::getInstance();
            std::cout << "Instance id: " << s->getId() << std::endl;
        });
    }
    
    for(auto& t : threads) {
        t.join();
    }
    return 0;
}`,
        expectedOutput: 'Single instance created',
        timeLimit: 900,
        baseScore: 200,
        testCase: {
            input: '',
            expectedOutput: 'Instance id: 0\nInstance id: 0\nInstance id: 0\n',
        },
        createdAt: new Date('2026-01-07'),
    },
    {
        id: 'challenge-8',
        title: 'Fix Object Slicing Bug',
        description: 'This C++ code has object slicing where a derived object is assigned to a base class object by value. This loses derived class data and virtual function behavior.',
        difficulty: 'hard',
        language: 'cpp',
        buggyCode: `#include <iostream>

class Vehicle {
protected:
    int speed;
    
public:
    Vehicle(int s = 0) : speed(s) {}
    
    virtual void display() const {
        std::cout << "Vehicle speed: " << speed << std::endl;
    }
    
    virtual ~Vehicle() {}
};

class Car : public Vehicle {
private:
    int numDoors;
    
public:
    Car(int s, int doors) : Vehicle(s), numDoors(doors) {}
    
    void display() const override {
        std::cout << "Car speed: " << speed << ", Doors: " << numDoors << std::endl;
    }
};

int main() {
    Car car(100, 4);
    // Bug: Object slicing - car is converted to Vehicle
    Vehicle v = car;  // Slicing occurs here
    v.display();
    car.display();
    return 0;
}`,
        expectedOutput: 'Car speed: 100, Doors: 4',
        timeLimit: 900,
        baseScore: 200,
        testCase: {
            input: '',
            expectedOutput: 'Type: Car\nSpeed: 100\n',
        },
        createdAt: new Date('2026-01-08'),
    },
    {
        id: 'challenge-9',
        title: 'Fix Double Deletion and Use-After-Free',
        description: 'This C++ code has memory corruption bugs where memory is deleted multiple times and used after deletion. Implement proper resource management.',
        difficulty: 'hard',
        language: 'cpp',
        buggyCode: `#include <iostream>

class Resource {
private:
    int* data;
    
public:
    Resource(int size) {
        data = new int[size];
        std::cout << "Resource allocated\\n";
    }
    
    ~Resource() {
        delete[] data;
        std::cout << "Resource destroyed\\n";
    }
    
    void use() {
        std::cout << "Using resource\\n";
    }
};

int main() {
    Resource* res = new Resource(100);
    
    res->use();
    delete res;
    
    // Bug: Use-after-free
    res->use();
    
    // Bug: Double deletion
    delete res;
    
    return 0;
}`,
        expectedOutput: 'Resource destroyed',
        timeLimit: 900,
        baseScore: 200,
        testCase: {
            input: '',
            expectedOutput: 'Using resource\nResource destroyed\n',
        },
        createdAt: new Date('2026-01-09'),
    },
    {
        id: 'challenge-10',
        title: 'Fix Producer-Consumer Synchronization Bug',
        description: 'This C++ code has synchronization issues in a producer-consumer pattern. Multiple threads access shared resources without proper locking, causing data races.',
        difficulty: 'hard',
        language: 'cpp',
        buggyCode: `#include <iostream>
#include <thread>
#include <vector>

class Buffer {
private:
    int data[10];
    int count;
    
public:
    Buffer() : count(0) {}
    
    // Bug: No synchronization - data race
    void produce(int value) {
        if(count < 10) {
            data[count++] = value;
        }
    }
    
    int consume() {
        if(count > 0) {
            return data[--count];
        }
        return -1;
    }
    
    int getCount() const {
        return count;
    }
};

int main() {
    Buffer buffer;
    
    std::thread producer([]() {
        for(int i = 0; i < 100; i++) {
            // buffer.produce(i);  // Race condition
        }
    });
    
    std::thread consumer([]() {
        for(int i = 0; i < 100; i++) {
            // buffer.consume();  // Race condition
        }
    });
    
    producer.join();
    consumer.join();
    
    std::cout << "Buffer operations completed\\n";
    return 0;
}`,
        expectedOutput: 'Buffer operations completed',
        timeLimit: 900,
        baseScore: 200,
        testCase: {
            input: '',
            expectedOutput: 'Produced: 100\nConsumed: 100\n',
        },
        createdAt: new Date('2026-01-10'),
    },
    {
        id: 'challenge-11',
        title: 'Fix RAII Principle Violation',
        description: 'This C++ code violates the RAII (Resource Acquisition Is Initialization) principle. Resources are not properly managed in the scope lifecycle.',
        difficulty: 'hard',
        language: 'cpp',
        buggyCode: `#include <iostream>
#include <fstream>

class FileHandler {
private:
    FILE* file;
    
public:
    FileHandler(const char* filename) {
        file = fopen(filename, "r");
        std::cout << "File opened\\n";
    }
    
    // Bug: Missing proper RAII - file not closed in destructor
    ~FileHandler() {
        std::cout << "FileHandler destroyed\\n";
        // Missing: if(file) fclose(file);
    }
    
    void read() {
        if(file) {
            std::cout << "Reading file...\\n";
        }
    }
};

int main() {
    {
        FileHandler handler("test.txt");
        handler.read();
    }  // File is not properly closed here
    
    std::cout << "Scope ended\\n";
    return 0;
}`,
        expectedOutput: 'File properly closed',
        timeLimit: 900,
        baseScore: 200,
        testCase: {
            input: '',
            expectedOutput: 'Error: Insufficient funds\nBalance: 1000\n',
        },
        createdAt: new Date('2026-01-11'),
    },
    {
        id: 'challenge-12',
        title: 'Fix Inheritance and Method Resolution Bug',
        description: 'This C++ code has an inheritance bug where method resolution is incorrect due to improper use of scope resolution operator and virtual functions.',
        difficulty: 'hard',
        language: 'cpp',
        buggyCode: `#include <iostream>

class Base {
public:
    virtual void process() {
        std::cout << "Base processing\\n";
    }
    
    virtual ~Base() {}
};

class Middle : public Base {
public:
    void process() override {
        std::cout << "Middle processing\\n";
    }
};

class Derived : public Middle {
public:
    // Bug: Calling wrong parent method
    void process() override {
        Base::process();  // Should call Middle::process()
        std::cout << "Derived processing\\n";
    }
};

int main() {
    Derived d;
    d.process();
    
    Base* b = &d;
    b->process();
    
    return 0;
}`,
        expectedOutput: 'Middle processing\\nDerived processing',
        timeLimit: 900,
        baseScore: 200,
        testCase: {
            input: '',
            expectedOutput: 'Area: 314.159\n',
        },
        createdAt: new Date('2026-01-12'),
    },
    {
        id: 'challenge-13',
        title: 'Fix Copy Assignment Operator Bug',
        description: 'This C++ class is missing the copy assignment operator. Without it, the default assignment performs shallow copy causing memory corruption.',
        difficulty: 'hard',
        language: 'cpp',
        buggyCode: `#include <iostream>
#include <cstring>

class DynamicArray {
private:
    int* data;
    int size;
    
public:
    DynamicArray(int sz) : size(sz) {
        data = new int[size];
        for(int i = 0; i < size; i++) {
            data[i] = 0;
        }
    }
    
    DynamicArray(const DynamicArray& other) : size(other.size) {
        data = new int[size];
        std::copy(other.data, other.data + size, data);
    }
    
    // Bug: Missing copy assignment operator
    // Default assignment causes double deletion
    
    ~DynamicArray() {
        delete[] data;
    }
    
    void fill(int value) {
        for(int i = 0; i < size; i++) {
            data[i] = value;
        }
    }
};

int main() {
    DynamicArray arr1(5);
    arr1.fill(10);
    
    DynamicArray arr2(10);
    arr2 = arr1;  // Shallow copy - memory corruption
    
    return 0;
}`,
        expectedOutput: 'Assignment completed safely',
        timeLimit: 900,
        baseScore: 200,
        testCase: {
            input: '',
            expectedOutput: 'Value: 42\nSelf-assignment handled correctly\n',
        },
        createdAt: new Date('2026-01-13'),
    },
    {
        id: 'challenge-14',
        title: 'Fix Vtable Corruption Bug',
        description: 'This C++ code has a vtable corruption issue where improper casting and multiple inheritance cause incorrect virtual function resolution.',
        difficulty: 'hard',
        language: 'cpp',
        buggyCode: `#include <iostream>

class Interface1 {
public:
    virtual void execute() {
        std::cout << "Interface1 execute\\n";
    }
    virtual ~Interface1() {}
};

class Interface2 {
public:
    virtual void process() {
        std::cout << "Interface2 process\\n";
    }
    virtual ~Interface2() {}
};

class Implementation : public Interface1, public Interface2 {
public:
    void execute() override {
        std::cout << "Implementation execute\\n";
    }
    
    void process() override {
        std::cout << "Implementation process\\n";
    }
};

int main() {
    Implementation* impl = new Implementation();
    
    // Bug: Unsafe casting without considering multiple inheritance
    Interface1* ptr1 = impl;
    Interface2* ptr2 = (Interface2*)ptr1;  // Incorrect cast
    
    ptr2->process();
    
    delete impl;
    return 0;
}`,
        expectedOutput: 'Implementation process',
        timeLimit: 900,
        baseScore: 200,
        testCase: {
            input: '',
            expectedOutput: 'Base method called\n',
        },
        createdAt: new Date('2026-01-14'),
    },
    {
        id: 'challenge-15',
        title: 'Fix Memory Order Violation in Lock-Free Code',
        description: 'This C++ code has memory ordering issues in lock-free programming. Atomic operations without proper memory barriers can cause data races.',
        difficulty: 'hard',
        language: 'cpp',
        buggyCode: `#include <iostream>
#include <atomic>
#include <thread>
#include <vector>

class LockFreeQueue {
private:
    std::atomic<int> head{0};
    std::atomic<int> tail{0};
    int buffer[100];
    
public:
    // Bug: Missing memory barriers
    void enqueue(int value) {
        int t = tail.load();  // Should use memory_order_acquire
        buffer[t] = value;
        tail.store(t + 1);  // Should use memory_order_release
    }
    
    int dequeue() {
        int h = head.load();  // Memory ordering issue
        int value = buffer[h];
        head.store(h + 1);  // Memory ordering issue
        return value;
    }
};

int main() {
    LockFreeQueue queue;
    queue.enqueue(42);
    std::cout << queue.dequeue() << std::endl;
    return 0;
}`,
        expectedOutput: '42',
        timeLimit: 900,
        baseScore: 200,
        testCase: {
            input: '',
            expectedOutput: '42\n',
        },
        createdAt: new Date('2026-01-15'),
    },
    {
        id: 'challenge-16',
        title: 'Check if the given set is an equivalence relation',
        description: 'Given a set of ordered pairs, determine if they form an equivalence relation by checking for reflexivity, symmetry, and transitivity. The buggy code has incomplete checks that fail to properly validate all three properties.',
        difficulty: 'medium',
        language: 'cpp',
        buggyCode: `#include <iostream>
#include <set>
#include <vector>
using namespace std;

class EquivalenceChecker {
private:
    set<pair<int, int>> relation;
    set<int> elements;
    
public:
    void addPair(int a, int b) {
        relation.insert({a, b});
        elements.insert(a);
        elements.insert(b);
    }
    
    // Bug: Incomplete reflexivity check
    bool isReflexive() {
        for(int elem : elements) {
            if(relation.find({elem, elem}) == relation.end()) {
                return false;
            }
        }
        return true;  // Missing check for empty set case
    }
    
    // Bug: Incomplete symmetry check
    bool isSymmetric() {
        for(auto& p : relation) {
            // Missing check for reverse pair
            if(p.first != p.second) {
                return true;  // Wrong logic - should check reverse exists
            }
        }
        return false;
    }
    
    // Bug: Incomplete transitivity check
    bool isTransitive() {
        for(auto& p1 : relation) {
            for(auto& p2 : relation) {
                if(p1.second == p2.first) {
                    // Missing: check if (p1.first, p2.second) exists
                    return true;  // Wrong - returns too early
                }
            }
        }
        return true;
    }
    
    bool isEquivalence() {
        return isReflexive() && isSymmetric() && isTransitive();
    }
};

int main() {
    EquivalenceChecker checker;
    
    // Test case: {(1,1), (2,2), (3,3), (1,2), (2,1), (2,3), (3,2), (1,3), (3,1)}
    checker.addPair(1, 1);
    checker.addPair(2, 2);
    checker.addPair(3, 3);
    checker.addPair(1, 2);
    checker.addPair(2, 1);
    checker.addPair(2, 3);
    checker.addPair(3, 2);
    checker.addPair(1, 3);
    checker.addPair(3, 1);
    
    if(checker.isEquivalence()) {
        cout << "The relation is an equivalence relation" << endl;
    } else {
        cout << "The relation is NOT an equivalence relation" << endl;
    }
    
    return 0;
}`,
        expectedOutput: 'The relation is an equivalence relation',
        timeLimit: 900,
        baseScore: 150,
        testCase: {
            input: '',
            expectedOutput: 'The relation is an equivalence relation\n',
        },
        createdAt: new Date('2026-01-16'),
    },
    {
        id: 'challenge-17',
        title: 'Fix Deadlock in Dining Philosophers Problem',
        description: 'This C++ implementation of the Dining Philosophers problem has a deadlock issue due to improper resource allocation. Modify the code to prevent deadlock while allowing philosophers to eat concurrently.',
        difficulty: 'hard',
        language: 'cpp',
        buggyCode: `#include <iostream>
#include <thread>
#include <mutex>
#include <vector>
#include <chrono>

using namespace std;

const int NUM_PHILOSOPHERS = 5;
mutex forks[NUM_PHILOSOPHERS];

class Philosopher {
private:
    int id;
    int leftFork;
    int rightFork;
    
public:
    Philosopher(int i) : id(i) {
        leftFork = i;
        rightFork = (i + 1) % NUM_PHILOSOPHERS;
    }
    
    void dine() {
        // Bug: All philosophers pick up left fork first, then right
        // This creates circular wait condition leading to deadlock
        forks[leftFork].lock();
        cout << "Philosopher " << id << " picked up left fork\\n";
        
        this_thread::sleep_for(chrono::milliseconds(10));
        
        forks[rightFork].lock();
        cout << "Philosopher " << id << " picked up right fork\\n";
        
        // Eating
        cout << "Philosopher " << id << " is eating\\n";
        this_thread::sleep_for(chrono::milliseconds(50));
        
        forks[rightFork].unlock();
        forks[leftFork].unlock();
        
        cout << "Philosopher " << id << " finished eating\\n";
    }
};

int main() {
    vector<thread> threads;
    vector<Philosopher> philosophers;
    
    for(int i = 0; i < NUM_PHILOSOPHERS; i++) {
        philosophers.emplace_back(i);
    }
    
    for(int i = 0; i < NUM_PHILOSOPHERS; i++) {
        threads.emplace_back([&philosophers, i]() {
            philosophers[i].dine();
        });
    }
    
    for(auto& t : threads) {
        t.join();
    }
    
    cout << "All philosophers finished dining" << endl;
    return 0;
}`,
        expectedOutput: 'All philosophers finished dining',
        timeLimit: 1200,
        baseScore: 250,
        testCase: {
            input: '',
            expectedOutput: 'All philosophers finished dining\n',
        },
        createdAt: new Date('2026-01-17'),
    },
    {
        id: 'challenge-18',
        title: 'Fix Stack Overflow in Recursive Function',
        description: 'This C++ code has a stack overflow issue due to uncontrolled recursion depth. Modify the recursive function to include a base case and prevent infinite recursion.',
        difficulty: 'easy',
        language: 'cpp',
        buggyCode: `#include <iostream>
using namespace std;

class RecursiveFunctions {
public:
    // Bug: Missing base case
    int factorial(int n) {
        return n * factorial(n - 1);
    }
};

int main() {
    RecursiveFunctions rf;
    cout << "Factorial of 5: " << rf.factorial(5) << endl;
    return 0;
}`,
        expectedOutput: 'Factorial of 5: 120',
        timeLimit: 600,
        baseScore: 100,
        testCase: {
            input: '',
            expectedOutput: 'Factorial of 5: 120\n',
        },
        createdAt: new Date('2026-01-18'),
    },
    {
        id: 'challenge-19',
        title: 'Optimize O(N^2) Sorting Algorithm',
        description: 'This C++ code implements a simple O(N^2) sorting algorithm (Bubble Sort). Optimize it to use a more efficient sorting algorithm with O(N log N) time complexity, such as Merge Sort or Quick Sort.',
        difficulty: 'medium',
        language: 'cpp',
        buggyCode: `#include <iostream>
using namespace std;

class Sorter {
public:
    // Bug: O(N^2) time complexity
    void bubbleSort(int arr[], int n) {
        for(int i = 0; i < n-1; i++) {
            for(int j = 0; j < n-i-1; j++) {
                if(arr[j] > arr[j+1]) {
                    int temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }
    }
};

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr)/sizeof(arr[0]);
    
    Sorter sorter;
    sorter.bubbleSort(arr, n);
    
    cout << "Sorted array: ";
    for(int i = 0; i < n; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
    
    return 0;
}`,
        expectedOutput: 'Sorted array: 11 12 22 25 34 64 90',
        timeLimit: 600,
        baseScore: 150,
        testCase: {
            input: '',
            expectedOutput: 'Sorted array: 11 12 22 25 34 64 90\n',
        },
        createdAt: new Date('2026-01-19'),
    },
];
