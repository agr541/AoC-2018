#include "DayTemplate.h"
#include <stdio.h>
#include <string>
#include <fstream>

using namespace std;

DayTemplate::DayTemplate() {
	initialInput = "Resources\\Day2\\input.txt";
	secondaryInput = "Resources\\Day2\\example.txt";
	input = initialInput;
}

string DayTemplate::GetName()
{
	return "Day X";
}
string DayTemplate::GetInput()
{
	return input;
}
void DayTemplate::SwitchInput() {
	if (input == initialInput) {
		input = secondaryInput;
	}
	else {
		input = initialInput;
	}
}

void DayTemplate::ProcessInputA(ifstream& myfile)
{
	string line;
	while (getline(myfile, line))
	{
		
	}

	printf("Answer:%d\n", 0);

}

void DayTemplate::ProcessInputB(ifstream& myfile)
{
	string line;
	while (getline(myfile, line))
	{

	}

	printf("Answer:%d\n", 0);
}

