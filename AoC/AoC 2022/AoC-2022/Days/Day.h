#pragma once

#include <stdio.h>
#include <string>
#include <fstream>
using namespace std;

class Day
{
public:
	Day();

	virtual string GetName() = 0;
	virtual string GetInput() = 0;

	virtual void SwitchInput() = 0;
	void RunA();
	virtual void ProcessInputA(ifstream& myfile) = 0;
	void RunB();
	virtual void ProcessInputB(ifstream& myfile) = 0;
};

