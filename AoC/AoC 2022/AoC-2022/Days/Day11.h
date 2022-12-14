#pragma once
#include "Day.h"

using namespace std;

typedef long long int item_t;
class Monkey {
public:
    Monkey(string name, string items, string operation, string test, string testTrue, string testFalse);
    void inspect2(vector<Monkey*>* monkeys, item_t cm);
    void inspect(vector<Monkey*>* monkeys);
    
    item_t inspectCount;
    string name;
    vector<item_t> items;
    item_t testDivisible;
private:
    char op;
    item_t* left;
    item_t* right;
    
    string testTrue;
    string testFalse;
    item_t old;
    void operate(item_t& result);
    bool test(item_t value);
    
    
    
};

class Day11 :
    public Day
{
public:
    Day11();
    // Inherited via Day
    virtual void ProcessInputA(ifstream& myfile) override;
    void RunRounds(std::vector<Monkey*>* monkeys, int count);
    void ParseInput(std::ifstream& myfile, std::vector<Monkey*>* monkeys);
    void RunRounds2(std::vector<Monkey*>* monkeys, int count);
    virtual void ProcessInputB(ifstream& myfile) override;
};

