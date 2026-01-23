// ID: 10

#include <iostream>
#include <thread>
#include <vector>

class Buffer {
private:
    int data[10];
    int count;
    
public:
    Buffer() : count(0) {}
    
    void produce(int value) {
        if(count < 10) {
            data[count++] = value;
        }
    }
    
    int consume() {
        if(count > 0) {
            return data[--count];
        }
        return -1;
    }
    
    int getCount() const {
        return count;
    }
};

int main() {
    Buffer buffer;
    
    std::thread producer([]() {
        for(int i = 0; i < 100; i++) {
            // buffer.produce(i);  // Race condition
        }
    });
    
    std::thread consumer([]() {
        for(int i = 0; i < 100; i++) {
            // buffer.consume();  // Race condition
        }
    });
    
    producer.join();
    consumer.join();
    
    std::cout << "Buffer operations completed\n";
    return 0;
}
