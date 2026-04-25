// README: Challenge Translation Templates

This directory contains Java translations of the BugPulse C++ debugging challenges.

## Structure

- `Challenge1.java` → Java version of C++ challenge 1
- `Challenge2.java` → Java version of C++ challenge 2
- ... (18 total challenges)

## Naming Convention

Java files MUST be named `Challenge{N}.java` where the public class is `Challenge{N}`.
This ensures proper compilation with: `javac Challenge{N}.java`

## Running Challenges

Each Java challenge needs to be compiled then executed:

```bash
javac Challenge1.java
java Challenge1
```

Expected output:
```
Buffer initialized with size: 100
```

## Fixing Challenges

Students receive the buggy code and must fix it. Examples:

### Challenge 1: Resource Management
**Buggy**: Missing close() implementation
**Fix**: Implement proper resource cleanup

### Challenge 2: Numeric Overflow
**Buggy**: Using int for large numbers
**Fix**: Use long data type

## Translation Status

- [x] Challenge 1 - Java
- [x] Challenge 2 - Java
- [ ] Challenge 3-18 - Java (TODO)

## Notes

- Java version must use Java 17+ features
- All challenges must have a main() method for execution
- Use Scanner for input when needed
- Output format must match C++ version exactly
- Keep class names consistent: Challenge{N}

## Common Issues

### Compilation Error: Cannot find symbol
Ensure the **public class name matches the filename** exactly!

### Runtime Error
Ensure the class extends nothing and has no constructor arguments.
