#include "..\Day.h"
#include "DayTemplate.h"
#include <stdio.h>
#include <string>
#include <fstream>

using namespace std;

DayTemplate::DayTemplate() : Day("DayTemplate") {
}


void DayTemplate::ProcessInputA(ifstream& myfile)
{
	int answer = 0;
	string line;
	while (getline(myfile, line))
	{
		
	}

	printf("Answer:%d\n", answer);

}

void DayTemplate::ProcessInputB(ifstream& myfile)
{
	int answer = 0;
	string line;
	while (getline(myfile, line))
	{

	}

	printf("Answer:%d\n", answer);
}

