// ID: 14

#include <iostream>

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
    
    Interface1* ptr1 = impl;
    Interface2* ptr2 = (Interface2*)ptr1;
    
    ptr2->process();
    
    delete impl;
    return 0;
}
