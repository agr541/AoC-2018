#pragma once
#include "Day.h"
class Day14 :
    public Day
{
public:
    Day14();
    // Inherited via Day
    virtual void ProcessInputA(ifstream& myfile) override;
    virtual void ProcessInputB(ifstream& myfile) override;
};

