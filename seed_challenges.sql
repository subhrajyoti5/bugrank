-- Clean up existing challenges (optional, since you said it's empty)
TRUNCATE challenges CASCADE;

INSERT INTO challenges (id, title, description, difficulty, language, buggy_code, expected_output, test_cases, time_limit, base_score, created_at)
VALUES 
('challenge-1', 'Fix Memory Leak with Missing Destructor', 'This C++ class has a memory leak because the destructor is not properly implemented. The dynamically allocated data is never freed. Implement a proper destructor following RAII principle.', 'easy', 'cpp', 
$$#include <iostream>

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
}$$, 'Buffer initialized with size: 100', '{"input": "", "expectedOutput": "Buffer initialized with size: 100\n"}'::jsonb, 600, 100, '2026-01-01'),

('challenge-2', 'Fix Integer Overflow Bug', 'This C++ code has an integer overflow when summing large numbers. Use appropriate data types to handle large values.', 'easy', 'cpp', 
$$#include <iostream>

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
}$$, 'Sum: 4000000000', '{"input": "", "expectedOutput": "Sum: 4000000000\n"}'::jsonb, 600, 100, '2026-01-02'),

('challenge-3', 'Fix Const Correctness Violation', 'This C++ class violates const correctness by allowing modifications in const methods. Fix the const correctness issues to prevent unintended state changes.', 'easy', 'cpp', 
$$#include <iostream>

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
}$$, 'Count: 1', '{"input": "", "expectedOutput": "Count: 1\n"}'::jsonb, 600, 100, '2026-01-03'),

('challenge-4', 'Fix Virtual Function Override Bug', 'This C++ code has a polymorphism bug where the derived class does not properly override the virtual function due to signature mismatch or missing override keyword.', 'medium', 'cpp', 
$$#include <iostream>

class Shape {
public:
    virtual void calculateArea() const {
        std::cout << "Calculating area...\n";
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
}$$, 'Circle area: 78.5', '{"input": "", "expectedOutput": "Circle area: 78.5\n"}'::jsonb, 600, 150, '2026-01-04'),

('challenge-5', 'Fix Missing Virtual Destructor', 'This C++ code has a critical bug where the base class destructor is not virtual. This causes incomplete cleanup when deleting derived class objects through base class pointers.', 'medium', 'cpp', 
$$#include <iostream>

class Animal {
protected:
    char* name;
    
public:
    Animal(const char* n) {
        name = new char[50];
        std::cout << "Animal created\n";
    }
    
    // Bug: Destructor not virtual - derived destructor won't be called
    ~Animal() {
        delete[] name;
        std::cout << "Animal destroyed\n";
    }
};

class Dog : public Animal {
private:
    char* breed;
    
public:
    Dog(const char* n, const char* b) : Animal(n) {
        breed = new char[50];
        std::cout << "Dog created\n";
    }
    
    ~Dog() {
        delete[] breed;
        std::cout << "Dog destroyed\n";
    }
};

int main() {
    Animal* dog = new Dog("Buddy", "Labrador");
    delete dog;  // Only Animal::~Animal() is called, not Dog::~Dog()
    return 0;
}$$, 'Dog destroyed\nAnimal destroyed', '{"input": "", "expectedOutput": "Dog destroyed\nAnimal destroyed\n"}'::jsonb, 600, 150, '2026-01-05'),

('challenge-6', 'Fix Shallow Copy Bug', 'This C++ class has a shallow copy problem in the copy constructor. Multiple objects will point to the same dynamically allocated data, causing crashes and double deletion.', 'medium', 'cpp', 
$$#include <iostream>
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
}$$, 'String: Hello', '{"input": "", "expectedOutput": "Original: Hello\nCopy: Hello\n"}'::jsonb, 600, 150, '2026-01-06'),

('challenge-7', 'Fix Race Condition in Singleton Pattern', 'This C++ singleton implementation has a race condition in the getInstance() method. Multiple threads could create multiple instances simultaneously. Fix it using thread-safe initialization.', 'hard', 'cpp', 
$$#include <iostream>
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
}$$, 'Single instance created', '{"input": "", "expectedOutput": "Instance id: 0\nInstance id: 0\nInstance id: 0\n"}'::jsonb, 900, 200, '2026-01-07'),

('challenge-8', 'Fix Object Slicing Bug', 'This C++ code has object slicing where a derived object is assigned to a base class object by value. This loses derived class data and virtual function behavior.', 'hard', 'cpp', 
$$#include <iostream>

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
}$$, 'Car speed: 100, Doors: 4', '{"input": "", "expectedOutput": "Type: Car\nSpeed: 100\n"}'::jsonb, 900, 200, '2026-01-08'),

('challenge-9', 'Fix Double Deletion and Use-After-Free', 'This C++ code has memory corruption bugs where memory is deleted multiple times and used after deletion. Implement proper resource management.', 'hard', 'cpp', 
$$#include <iostream>

class Resource {
private:
    int* data;
    
public:
    Resource(int size) {
        data = new int[size];
        std::cout << "Resource allocated\n";
    }
    
    ~Resource() {
        delete[] data;
        std::cout << "Resource destroyed\n";
    }
    
    void use() {
        std::cout << "Using resource\n";
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
}$$, 'Resource destroyed', '{"input": "", "expectedOutput": "Using resource\nResource destroyed\n"}'::jsonb, 900, 200, '2026-01-09'),

('challenge-10', 'Fix Producer-Consumer Synchronization Bug', 'This C++ code has synchronization issues in a producer-consumer pattern. Multiple threads access shared resources without proper locking, causing data races.', 'hard', 'cpp', 
$$#include <iostream>
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
    
    std::cout << "Buffer operations completed\n";
    return 0;
}$$, 'Buffer operations completed', '{"input": "", "expectedOutput": "Produced: 100\nConsumed: 100\n"}'::jsonb, 900, 200, '2026-01-10'),

('challenge-11', 'Fix RAII Principle Violation', 'This C++ code violates the RAII (Resource Acquisition Is Initialization) principle. Resources are not properly managed in the scope lifecycle.', 'hard', 'cpp', 
$$#include <iostream>
#include <fstream>

class FileHandler {
private:
    FILE* file;
    
public:
    FileHandler(const char* filename) {
        file = fopen(filename, "r");
        std::cout << "File opened\n";
    }
    
    // Bug: Missing proper RAII - file not closed in destructor
    ~FileHandler() {
        std::cout << "FileHandler destroyed\n";
        // Missing: if(file) fclose(file);
    }
    
    void read() {
        if(file) {
            std::cout << "Reading file...\n";
        }
    }
};

int main() {
    {
        FileHandler handler("test.txt");
        handler.read();
    }  // File is not properly closed here
    
    std::cout << "Scope ended\n";
    return 0;
}$$, 'File properly closed', '{"input": "", "expectedOutput": "Error: Insufficient funds\nBalance: 1000\n"}'::jsonb, 900, 200, '2026-01-11'),

('challenge-12', 'Fix Inheritance and Method Resolution Bug', 'This C++ code has an inheritance bug where method resolution is incorrect due to improper use of scope resolution operator and virtual functions.', 'hard', 'cpp', 
$$#include <iostream>

class Base {
public:
    virtual void process() {
        std::cout << "Base processing\n";
    }
    
    virtual ~Base() {}
};

class Middle : public Base {
public:
    void process() override {
        std::cout << "Middle processing\n";
    }
};

class Derived : public Middle {
public:
    // Bug: Calling wrong parent method
    void process() override {
        Base::process();  // Should call Middle::process()
        std::cout << "Derived processing\n";
    }
};

int main() {
    Derived d;
    d.process();
    
    Base* b = &d;
    b->process();
    
    return 0;
}$$, 'Middle processing\nDerived processing', '{"input": "", "expectedOutput": "Area: 314.159\n"}'::jsonb, 900, 200, '2026-01-12'),

('challenge-13', 'Fix Copy Assignment Operator Bug', 'This C++ class is missing the copy assignment operator. Without it, the default assignment performs shallow copy causing memory corruption.', 'hard', 'cpp', 
$$#include <iostream>
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
}$$, 'Assignment completed safely', '{"input": "", "expectedOutput": "Value: 42\nSelf-assignment handled correctly\n"}'::jsonb, 900, 200, '2026-01-13'),

('challenge-14', 'Fix Vtable Corruption Bug', 'This C++ code has a vtable corruption issue where improper casting and multiple inheritance cause incorrect virtual function resolution.', 'hard', 'cpp', 
$$#include <iostream>

class Interface1 {
public:
    virtual void execute() {
        std::cout << "Interface1 execute\n";
    }
    virtual ~Interface1() {}
};

class Interface2 {
public:
    virtual void process() {
        std::cout << "Interface2 process\n";
    }
    virtual ~Interface2() {}
};

class Implementation : public Interface1, public Interface2 {
public:
    void execute() override {
        std::cout << "Implementation execute\n";
    }
    
    void process() override {
        std::cout << "Implementation process\n";
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
}$$, 'Implementation process', '{"input": "", "expectedOutput": "Base method called\n"}'::jsonb, 900, 200, '2026-01-14'),

('challenge-15', 'Fix Memory Order Violation in Lock-Free Code', 'This C++ code has memory ordering issues in lock-free programming. Atomic operations without proper memory barriers can cause data races.', 'hard', 'cpp', 
$$#include <iostream>
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
}$$, '42', '{"input": "", "expectedOutput": "42\n"}'::jsonb, 900, 200, '2026-01-15'),

('challenge-16', 'Check if the given set is an equivalence relation', 'Given a set of ordered pairs, determine if they form an equivalence relation by checking for reflexivity, symmetry, and transitivity. The buggy code has incomplete checks that fail to properly validate all three properties.', 'medium', 'cpp', 
$$#include <iostream>
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
}$$, 'The relation is an equivalence relation', '{"input": "", "expectedOutput": "The relation is an equivalence relation\n"}'::jsonb, 900, 150, '2026-01-16'),

('challenge-17', 'Fix Deadlock in Dining Philosophers Problem', 'This C++ implementation of the Dining Philosophers problem has a deadlock issue due to improper resource allocation. Modify the code to prevent deadlock while allowing philosophers to eat concurrently.', 'hard', 'cpp', 
$$#include <iostream>
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
        cout << "Philosopher " << id << " picked up left fork\n";
        
        this_thread::sleep_for(chrono::milliseconds(10));
        
        forks[rightFork].lock();
        cout << "Philosopher " << id << " picked up right fork\n";
        
        // Eating
        cout << "Philosopher " << id << " is eating\n";
        this_thread::sleep_for(chrono::milliseconds(50));
        
        forks[rightFork].unlock();
        forks[leftFork].unlock();
        
        cout << "Philosopher " << id << " finished eating\n";
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
}$$, 'All philosophers finished dining', '{"input": "", "expectedOutput": "All philosophers finished dining\n"}'::jsonb, 1200, 250, '2026-01-17'),

('challenge-18', 'Fix Stack Overflow in Recursive Function', 'This C++ code has a stack overflow issue due to uncontrolled recursion depth. Modify the recursive function to include a base case and prevent infinite recursion.', 'easy', 'cpp', 
$$#include <iostream>
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
}$$, 'Factorial of 5: 120', '{"input": "", "expectedOutput": "Factorial of 5: 120\n"}'::jsonb, 600, 100, '2026-01-18'),

('challenge-19', 'Optimize O(N^2) Sorting Algorithm', 'This C++ code implements a simple O(N^2) sorting algorithm (Bubble Sort). Optimize it to use a more efficient sorting algorithm with O(N log N) time complexity, such as Merge Sort or Quick Sort.', 'medium', 'cpp', 
$$#include <iostream>
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
}$$, 'Sorted array: 11 12 22 25 34 64 90', '{"input": "", "expectedOutput": "Sorted array: 11 12 22 25 34 64 90\n"}'::jsonb, 600, 150, '2026-01-19');
