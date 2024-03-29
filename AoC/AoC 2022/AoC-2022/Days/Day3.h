#pragma once
#include "Day.h"
#pragma once

#include <stdio.h>
#include <string>
#include <fstream>

using namespace std;

class Day3 :
	public Day
{
	// Inherited via Day
	virtual void ProcessInputA(ifstream& myfile) override;
	virtual void ProcessInputB(ifstream& myfile) override;

public:
	Day3();

private:
	int GetValue(char value);
	string GetIntersection(string first, string last);
	int GetIntersectionScore(string first, string last);
};

