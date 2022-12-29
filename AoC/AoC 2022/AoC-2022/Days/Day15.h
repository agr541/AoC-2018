#pragma once
#include "Day.h"
class Day15 :
    public Day
{
public:
    Day15();
    // Inherited via Day
    virtual void ProcessInputA(ifstream& myfile) override;

    virtual void ProcessInputB(ifstream& myfile) override;
   
};

