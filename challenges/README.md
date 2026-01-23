# BugRank Challenge Library

This folder contains 16 curated C++ OOP challenges focused on critical system programming concepts and debugging skills.

## Challenge Distribution

### Easy Tier (4 challenges)
- **challenge-1.cpp** - Fix Memory Leak with Missing Destructor
- **challenge-2.cpp** - Fix Integer Overflow Bug
- **challenge-3.cpp** - Fix Const Correctness Violation
- **challenge-4.cpp** - Fix Virtual Function Override Bug

### Medium Tier (2 challenges)
- **challenge-5.cpp** - Fix Move Semantics Bug
- **challenge-6.cpp** - Fix Shallow Copy Bug

### Hard Tier (10 challenges)
- **challenge-7.cpp** - Fix Race Condition in Singleton Pattern
- **challenge-8.cpp** - Fix Object Slicing Bug
- **challenge-9.cpp** - Fix Double Deletion and Use-After-Free
- **challenge-10.cpp** - Fix Producer-Consumer Synchronization Bug
- **challenge-11.cpp** - Fix Exception Safety Bug (Strong Guarantee)
- **challenge-12.cpp** - Fix Inheritance and Method Resolution Bug
- **challenge-13.cpp** - Fix Self-Assignment Bug
- **challenge-14.cpp** - Fix Vtable Corruption Bug (Multiple Inheritance)
- **challenge-15.cpp** - Fix Memory Order Violation in Lock-Free Code
- **challenge-16.cpp** - Fix Diamond Problem in Multiple Inheritance

## Topics Covered

### Object-Oriented Programming (OOP)
- Classes, Constructors, Destructors
- Inheritance and Polymorphism
- Virtual Functions and Abstract Classes
- Encapsulation and Const Correctness
- Copy Semantics (Copy Constructor, Copy Assignment)

### Memory Management
- Dynamic Memory Allocation/Deallocation
- RAII (Resource Acquisition Is Initialization)
- Pointer Management
- Memory Leaks and Double Deletion

### System Programming
- Thread Synchronization
- Race Conditions
- Lock-Free Programming
- Static Initialization Order

### Critical Bugs
- Object Slicing
- Shallow vs Deep Copy
- Virtual Function Resolution
- Undefined Behavior

## Usage

Each challenge file contains:
1. Buggy C++ code with OOP structure
2. Comments indicating the bug and expected fix
3. Expected output showing correct behavior

### Compile and Test
```bash
g++ -std=c++17 challenge-1.cpp -o challenge-1
./challenge-1
```

### Fix the Bug
Read the description and comments, identify the bug, and implement the fix while maintaining the overall structure and expected output.

## Key Learning Objectives

1. Understand C++ OOP principles in practice
2. Recognize critical system programming bugs
3. Apply proper resource management patterns
4. Write thread-safe code
5. Debug complex inheritance hierarchies
6. Master memory safety concepts

---

**Total Challenges**: 16  
**Language**: C++ with OOP Focus  
**Difficulty Range**: Easy → Hard  
**Focus**: Critical System Programming & OOP Concepts
