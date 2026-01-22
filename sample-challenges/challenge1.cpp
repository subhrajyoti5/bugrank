// Sample buggy C++ code - Array Index Out of Bounds
const char* buggyCode = R"(
#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {10, 20, 30, 40, 50};
    
    // Bug: Loop goes beyond array bounds
    for(int i = 0; i <= numbers.size(); i++) {
        std::cout << numbers[i] << " ";
    }
    
    return 0;
}
)";
