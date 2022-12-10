#pragma once
#include "Day.h"
class Day8 :
    public Day
{
public:

	Day8();
	// Inherited via Day
	virtual void ProcessInputA(ifstream& myfile) override;
	virtual void ProcessInputB(ifstream& myfile) override;

};

