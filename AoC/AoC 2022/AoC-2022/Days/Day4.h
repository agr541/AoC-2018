#pragma once
#include "Day.h"

#include <stdio.h>
#include <string>
#include <fstream>

using namespace std;

class Day4 :
	public Day
{
	// Inherited via Day
	virtual void ProcessInputA(ifstream& myfile) override;
	virtual void ProcessInputB(ifstream& myfile) override;

public:
	Day4();

};

vector<string> Split(string input, char delimiter);
