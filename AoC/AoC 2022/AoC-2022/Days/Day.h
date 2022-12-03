
#pragma once
#include <string>
#include <fstream>
#include <vector>


using namespace std;

class Day
{
protected:
	string _name;
	size_t _inputIndex = 0;
	vector<string> _inputs;

public:
	Day(string name);

	string GetName();
	string GetInput();

	void SwitchInput();
	void RunA();
	virtual void ProcessInputA(ifstream& myfile) = 0;
	void RunB();
	virtual void ProcessInputB(ifstream& myfile) = 0;
};

