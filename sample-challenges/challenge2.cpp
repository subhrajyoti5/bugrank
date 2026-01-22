// Sample buggy C++ code - Memory Leak
const char* buggyCode = R"(
#include <iostream>

class Resource {
public:
    int* data;
    
    Resource(int size) {
        data = new int[size];
    }
    
    // Bug: Missing destructor - memory leak
    void display() {
        std::cout << "Resource used\n";
    }
};

int main() {
    Resource res(100);
    res.display();
    return 0;
}
)";
