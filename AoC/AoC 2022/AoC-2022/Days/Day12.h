#pragma once
#include "Day.h"
class Day12 :
    public Day
{
public:
    Day12();
    // Inherited via Day
    virtual void ProcessInputA(ifstream& myfile) override;
    virtual void ProcessInputB(ifstream& myfile) override;
};

