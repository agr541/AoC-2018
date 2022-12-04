
#pragma once
#include "..\Day.h"


#include <stdio.h>
#include <string>
#include <fstream>

using namespace std;

class DayTemplate :
	public Day
{
	// Inherited via Day

	virtual void ProcessInputA(ifstream& myfile) override;
	virtual void ProcessInputB(ifstream& myfile) override;

public:
	DayTemplate();

private:
	string initialInput;
	string secondaryInput;
	string input;
};

