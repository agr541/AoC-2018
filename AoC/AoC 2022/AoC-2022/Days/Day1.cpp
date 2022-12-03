
#include "Day1.h"
#include <stdio.h>
#include <string>
#include <fstream>

using namespace std;


Day1::Day1() {
	initialInput = "Resources\\Day2\\input.txt";
	secondaryInput = "Resources\\Day2\\example.txt";
	input = initialInput;
}

string Day1::GetName()
{
	return "Day 1";
}
string Day1::GetInput()
{
	return input;
}
void Day1::SwitchInput() {
	if (input == initialInput) {
		input = secondaryInput;
	}
	else {
		input = initialInput;
	}
}


void Day1::ProcessInputA(ifstream& myfile)
{
	int largestCount = 0;
	int count = 0;
	string line;
	while (getline(myfile, line))
	{
		if (line.length() != 0) {
			count += stoi(line);
		}
		else {
			if (count > largestCount) {
				largestCount = count;
			}
			count = 0;
		}
	}

	printf("Answer:%d\n", largestCount);
}
void Day1::ProcessInputB(ifstream& myfile)
{

	string line;
	int highestCounts[] = { 0,0,0 };
	int lowestValueIndex = 0;
	int length = sizeof(highestCounts) / sizeof(highestCounts[0]);
	int currentCount = 0;
	while (getline(myfile, line))
	{
		if (line.length() != 0) {
			currentCount += stoi(line);
		}
		else {
			if (highestCounts[lowestValueIndex] < currentCount) {
				highestCounts[lowestValueIndex] = currentCount;
			}
			int lowestCount = -1;
			for (int index = 0; index < length; index++) {
				if (lowestCount == -1 || lowestCount > highestCounts[index]) {
					lowestValueIndex = index;
					lowestCount = highestCounts[index];
				}
			}
			currentCount = 0;
		}
	}

	int answer = 0;
	for (int largestCount : highestCounts)
	{
		answer += largestCount;
	}
	printf("Answer:%d\n", answer);

};
