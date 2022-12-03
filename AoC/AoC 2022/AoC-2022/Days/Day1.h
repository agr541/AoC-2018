#pragma once

#include <string>
#include "Day.h"

class Day1 
	: public Day
{

	// Inherited via Day
	virtual string GetName() override;
	virtual string GetInput() override;
	virtual void SwitchInput() override;
	virtual void ProcessInputA(ifstream& myfile) override;
	virtual void ProcessInputB(ifstream& myfile) override;

public:
	Day1();

private:
	string initialInput = "Resources\\Day1\\input.txt";
	string secondaryInput = "Resources\\Day1\\example.txt";
	string input = initialInput;

};

