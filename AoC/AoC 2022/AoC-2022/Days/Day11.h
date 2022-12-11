#pragma once
#include "Day.h"
class Monkey {
public:
    Monkey(string name, string items, string operation, string test, string testTrue, string testFalse);
    string name;
    int value;
    vector<int> items;
    char op;
    int* left;
    int* right;

    void operate();
    void test(vector<Monkey*>* monkeys);
};

class Day11 :
    public Day
{
public:
    Day11();
    // Inherited via Day
    virtual void ProcessInputA(ifstream& myfile) override;
    virtual void ProcessInputB(ifstream& myfile) override;
};

