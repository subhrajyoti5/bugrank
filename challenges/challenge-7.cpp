// ID: 7

#include <iostream>
#include <thread>
#include <vector>

class Singleton {
private:
    static Singleton* instance;
    int id;
    
    Singleton() : id(0) {}
    
public:
    static Singleton* getInstance() {
        if(instance == nullptr) {
            instance = new Singleton();
        }
        return instance;
    }
    
    int getId() const { return id; }
};

Singleton* Singleton::instance = nullptr;

int main() {
    std::vector<std::thread> threads;
    for(int i = 0; i < 10; i++) {
        threads.emplace_back([]() {
            Singleton* s = Singleton::getInstance();
            std::cout << "Instance id: " << s->getId() << std::endl;
        });
    }
    
    for(auto& t : threads) {
        t.join();
    }
    return 0;
}
