#include "Day6.h"
#include <fstream>
#include <vector>
#include <algorithm>

using namespace std;
Day6::Day6() : Day("Day 6")
{
}
void Day6::ProcessInputA(ifstream& myfile)
{

	string line;
	while (getline(myfile, line)) {
		auto answer = GetUniqueSequenceEndIndex(line, 4);
		printf("Answer:%i\n", answer);
	}

}

int Day6::GetUniqueSequenceEndIndex(std::string& line, int length)
{
	int result = 0;
	for (int i = length; i < line.length(); i++) {


		auto prev = line.substr(i - length, length);

		sort(prev.begin(), prev.end());
		string uniquePrev;
		unique_copy(prev.begin(), prev.end(), back_inserter(uniquePrev));

		if (uniquePrev.length() == prev.length()) {
			result = i;
			break;
		}

	}
	return result;
}



void Day6::ProcessInputB(ifstream& myfile)
{
	string line;
	while (getline(myfile, line)) {
		auto answer = GetUniqueSequenceEndIndex(line, 14);
		printf("Answer:%i\n", answer);
	}
}
