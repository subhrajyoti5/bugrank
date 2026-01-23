// ID: 11

#include <iostream>
#include <stdexcept>

class Transaction {
private:
    int accountBalance;
    int transactionAmount;
    bool committed;
    
public:
    Transaction(int balance, int amount) 
        : accountBalance(balance), transactionAmount(amount), committed(false) {}
    
    void commit() {
        if(transactionAmount <= 0) {
            throw std::invalid_argument("Invalid amount");
        }
        
        accountBalance -= transactionAmount;
        
        if(accountBalance < 0) {
            throw std::runtime_error("Insufficient funds");
        }
        
        committed = true;
        std::cout << "Transaction committed\n";
    }
    
    int getBalance() const {
        return accountBalance;
    }
};

int main() {
    try {
        Transaction txn(100, 200);
        txn.commit();
    } catch(const std::exception& e) {
        std::cout << "Error: " << e.what() << std::endl;
    }
    std::cout << "Transaction committed safely\n";
    return 0;
}
