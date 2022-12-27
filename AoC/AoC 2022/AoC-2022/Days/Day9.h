#pragma once
#include "Day.h"

struct sensor {
    int x;
    int y;
    bool operator==(const sensor& that) const = default;
    weak_ordering operator<=>(const sensor& that) const = default;
};

class Day9 :
    public Day
{
public:
    Day9();

    // Inherited via Day
    virtual void ProcessInputA(ifstream& myfile) override;
    void DrawGrid(vector<sensor> rope, std::vector<std::string>& grids);
    void DrawGrid(int tailX, int tailY, int headX, int headY, std::vector<std::string>& grids);
    virtual void ProcessInputB(ifstream& myfile) override;
};

