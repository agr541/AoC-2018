#include "DayOne.h"
#include <stdio.h>
#include <string>
#include <fstream>
#include <vector>

using namespace std;


string initialInput = "DayOne-input.txt";
string secondaryInput = "DayOne-example.txt";
string input = initialInput;


string DayOne::GetName()
{
	return "Day 1";
}
string DayOne::GetInput()
{
	return input;
}
void DayOne::SwitchInput() {
	if (input == initialInput) {
		input = secondaryInput;
	}
	else {
		input = initialInput;
	}
}

void DayOne::RunA()
{

	string line;
	ifstream myfile(input);
	if (myfile.is_open())
	{

		int largestCount = 0;
		int count = 0;
		while (getline(myfile, line))
		{
			if (line.length() != 0) {
				count += std::stoi(line);
			}
			else {
				if (count > largestCount) {
					largestCount = count;
				}
				count = 0;
			}
		}
		myfile.close();
		printf("Answer:%d\n", largestCount);
	}
}
void DayOne::RunB()
{
	string line;
	ifstream myfile(input);
	if (myfile.is_open())
	{

		int highestCounts[] = { 0,0,0 };
		int lowestValueIndex = 0;
		int length = sizeof(highestCounts) / sizeof(highestCounts[0]);
		int currentCount = 0;
		while (getline(myfile, line))
		{
			if (line.length() != 0) {
				currentCount += std::stoi(line);
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
		myfile.close();
		int answer = 0;
		for (int largestCount : highestCounts)
		{
			answer += largestCount;
		}
		printf("Answer:%d\n", answer);
	}
};

