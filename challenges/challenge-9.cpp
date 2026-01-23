// ID: 9

#include <iostream>

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
    
    res->use();
    
    delete res;
    
    return 0;
}
