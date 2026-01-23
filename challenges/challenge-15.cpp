// ID: 15

#include <iostream>
#include <atomic>
#include <thread>
#include <vector>

class LockFreeQueue {
private:
    std::atomic<int> head{0};
    std::atomic<int> tail{0};
    int buffer[100];
    
public:
    void enqueue(int value) {
        int t = tail.load();
        buffer[t] = value;
        tail.store(t + 1);
    }
    
    int dequeue() {
        int h = head.load();
        int value = buffer[h];
        head.store(h + 1);
        return value;
    }
};

int main() {
    LockFreeQueue queue;
    queue.enqueue(42);
    std::cout << queue.dequeue() << std::endl;
    return 0;
}
