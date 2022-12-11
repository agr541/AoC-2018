#pragma once
#include "Day.h"

class Day10 :
    public Day
{
public:
    Day10();

    // Inherited via Day
    virtual void ProcessInputA(ifstream& myfile) override;
    virtual void ProcessInputB(ifstream& myfile) override;
    void drawPixel(int& pixelIndex, int x, std::string& answer);
};



