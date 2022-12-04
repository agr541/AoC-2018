#include "Day.h"
#include "Day1.h"
#include <stdio.h>
#include <string>
#include <fstream>

using namespace std;

Day1::Day1() : Day("Day 1") {
	
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

	auto answer = 0;
	for (auto largestCount : highestCounts)
	{
		answer += largestCount;
	}
	printf("Answer:%d\n", answer);

};
