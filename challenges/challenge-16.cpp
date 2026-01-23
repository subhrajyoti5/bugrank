// ID: 16

#include <iostream>

class Component {
public:
    virtual void initialize() {
        std::cout << "Component initialized\n";
    }
    virtual ~Component() {}
};

class InputComponent : public Component {
public:
    void initialize() override {
        std::cout << "InputComponent initialized\n";
    }
};

class RenderComponent : public Component {
public:
    void initialize() override {
        std::cout << "RenderComponent initialized\n";
    }
};

class GameObject : public InputComponent, public RenderComponent {
public:
    void initialize() override {
        std::cout << "GameObject initialized\n";
    }
};

int main() {
    GameObject obj;
    obj.initialize();
    std::cout << "Ambiguity resolved with virtual inheritance\n";
    return 0;
}
