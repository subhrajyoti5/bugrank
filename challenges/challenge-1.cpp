// ID: 1

#include <iostream>

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
    
    void display() {
        std::cout << "Buffer initialized with size: " << size << std::endl;
    }
};

int main() {
    DataBuffer buf(100);
    buf.display();
    return 0;
}
