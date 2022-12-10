#pragma once
#include "Day.h"

struct pos {
    int x;
    int y;
    bool operator==(const pos& that) const = default;
    weak_ordering operator<=>(const pos& that) const = default;
};

class Day9 :
    public Day
{
public:
    Day9();

    // Inherited via Day
    virtual void ProcessInputA(ifstream& myfile) override;
    void DrawGrid(vector<pos> rope, std::vector<std::string>& grids);
    void DrawGrid(int tailX, int tailY, int headX, int headY, std::vector<std::string>& grids);
    virtual void ProcessInputB(ifstream& myfile) override;
};

