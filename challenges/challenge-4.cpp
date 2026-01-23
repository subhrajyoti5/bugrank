// ID: 4

#include <iostream>

class Shape {
public:
    virtual void calculateArea() const {
        std::cout << "Calculating area...\n";
    }
    virtual ~Shape() {}
};

class Circle : public Shape {
private:
    double radius;
    
public:
    Circle(double r) : radius(r) {}
    
    void calculateArea() {
        std::cout << "Circle area: " << (3.14 * radius * radius) << std::endl;
    }
};

int main() {
    const Circle circle(5.0);
    circle.calculateArea();
    return 0;
}
