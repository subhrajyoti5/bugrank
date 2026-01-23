// ID: 3

#include <iostream>

class Counter {
private:
    mutable int count;
    
public:
    Counter() : count(0) {}
    
    void increment() {
        count++;
    }
    
    void getCount() const {
        count++;
        std::cout << "Count: " << count << std::endl;
    }
};

int main() {
    const Counter counter;
    counter.getCount();
    return 0;
}
