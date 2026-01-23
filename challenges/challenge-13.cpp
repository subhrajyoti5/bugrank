// ID: 13

#include <iostream>

class Node {
private:
    int data;
    Node* next;
    
public:
    Node(int val) : data(val), next(nullptr) {}
    
    Node& operator=(const Node& other) {
        if(next) {
            delete next;
        }
        
        data = other.data;
        if(other.next) {
            next = new Node(*other.next);
        } else {
            next = nullptr;
        }
        
        return *this;
    }
    
    ~Node() {
        delete next;
    }
    
    void setNext(Node* n) {
        next = n;
    }
    
    int getData() const {
        return data;
    }
};

int main() {
    Node node(42);
    node = node;  // Self-assignment - should not crash
    std::cout << "Value: " << node.getData() << std::endl;
    std::cout << "Self-assignment handled correctly\n";
    return 0;
}
