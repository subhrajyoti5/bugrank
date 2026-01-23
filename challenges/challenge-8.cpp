// ID: 8

#include <iostream>

class Vehicle {
protected:
    int speed;
    
public:
    Vehicle(int s = 0) : speed(s) {}
    
    virtual void display() const {
        std::cout << "Vehicle speed: " << speed << std::endl;
    }
    
    virtual ~Vehicle() {}
};

class Car : public Vehicle {
private:
    int numDoors;
    
public:
    Car(int s, int doors) : Vehicle(s), numDoors(doors) {}
    
    void display() const override {
        std::cout << "Car speed: " << speed << ", Doors: " << numDoors << std::endl;
    }
};

int main() {
    Car car(100, 4);
    Vehicle v = car;
    v.display();
    car.display();
    return 0;
}
