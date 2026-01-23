// ID: 6

#include <iostream>
#include <cstring>

class String {
private:
    char* data;
    int length;
    
public:
    String(const char* str) {
        length = strlen(str);
        data = new char[length + 1];
        strcpy(data, str);
    }
    
    String(const String& other) {
        data = other.data;
        length = other.length;
    }
    
    ~String() {
        delete[] data;
    }
    
    void display() const {
        std::cout << "String: " << data << std::endl;
    }
};

int main() {
    String s1("Hello");
    String s2 = s1;  // Shallow copy - both reference same memory
    s1.display();
    s2.display();
    return 0;
}
