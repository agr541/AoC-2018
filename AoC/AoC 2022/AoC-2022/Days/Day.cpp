#include "Day.h"

#include <stdio.h>
#include <string>
#include <fstream>
#include <vector>

using namespace std;


Day::Day()
{
}

void Day::RunA()
{
	string input = GetInput();
	ifstream myfile(input);
	if (myfile.is_open())
	{
		ProcessInputA(myfile);
		myfile.close();
	}
}

void Day::RunB()
{
	string input = GetInput();
	ifstream myfile(input);
	if (myfile.is_open())
	{
		ProcessInputB(myfile);
		myfile.close();
	}
};

