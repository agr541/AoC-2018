#pragma once
#include "Day.h"
class Day6 :
    public Day
{
public:
    Day6();
    // Inherited via Day
    virtual void ProcessInputA(ifstream& myfile) override;
    int GetUniqueSequenceEndIndex(std::string& line, int length);
    virtual void ProcessInputB(ifstream& myfile) override;
};

