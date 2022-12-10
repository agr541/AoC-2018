#pragma once
#include "Day.h"
#include <stack>

class Day5 :
    public Day
{
    // Inherited via Day
    virtual void ProcessInputA(ifstream& myfile) override;
    void InitialzeStacks(std::string& line, std::vector<std::stack<char>>& stacks);
    virtual void ProcessInputB(ifstream& myfile) override;

public:
    Day5();

};
