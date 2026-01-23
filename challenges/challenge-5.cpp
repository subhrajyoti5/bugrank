// ID: 5

#include <iostream>
#include <utility>

class DataContainer {
private:
    int* buffer;
    int size;
    
public:
    DataContainer(int sz) : size(sz) {
        buffer = new int[size];
        std::cout << "DataContainer created with size: " << size << std::endl;
    }
    
    DataContainer(DataContainer&& other) {
        buffer = other.buffer;
        size = other.size;
    }
    
    ~DataContainer() {
        delete[] buffer;
        std::cout << "DataContainer destroyed\n";
    }
    
    void display() const {
        std::cout << "Buffer size: " << size << std::endl;
    }
};

int main() {
    DataContainer data(1000);
    DataContainer moved = std::move(data);  // Should use move, not copy
    moved.display();
    std::cout << "Transfer completed efficiently\n";
    return 0;
}
