// ID: 12

#include <iostream>

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
    void process() override {
        Base::process();
        std::cout << "Derived processing\n";
    }
};

int main() {
    Derived d;
    d.process();
    
    Base* b = &d;
    b->process();
    
    return 0;
}
