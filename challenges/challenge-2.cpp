// ID: 2

#include <iostream>

class Calculator {
private:
    int sum;
    
public:
    Calculator() : sum(0) {}
    
    void add(int value) {
        sum += value;
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
}
