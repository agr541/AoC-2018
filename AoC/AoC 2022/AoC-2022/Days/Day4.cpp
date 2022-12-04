#include "Day4.h"
#include <set>
#include <algorithm>
#include <string>
#include <vector>
#include <fstream>

using namespace std;

Day4::Day4() : Day("Day 4") {
}


void Day4::ProcessInputA(ifstream& myfile)
{
	int answer = 0;
	string line;

	while (getline(myfile, line))
	{

		auto splitChar = ',';
		auto ranges = Split(line, ',');
		auto range1 = Split(ranges[0], '-');
		auto range2 = Split(ranges[1], '-');

		int begin1 = stoi(range1[0]);
		int end1 = stoi(range1[1]);

		int begin2 = stoi(range2[0]);
		int end2 = stoi(range2[1]);

		if ((begin1 <= begin2 && end1 >= end2) ||
			(begin2 <= begin1 && end2 >= end1)) {
			answer++;
		}


	}

	printf("Answer:%d\n", answer);
}
vector<string> Split(string input, char delimiter) {
	vector<string>* result = new vector<string>();
	size_t offset = 0;
	auto delimiterPosition = input.find(delimiter, offset);
	while (delimiterPosition != std::string::npos) {
		result->push_back(input.substr(offset, delimiterPosition));
		offset = delimiterPosition + 1;
		delimiterPosition = input.find(delimiter, offset);
	}
	if (offset > 0) {
		result->push_back(input.substr(offset, input.length() - offset));
	}

	return *result;
}

void Day4::ProcessInputB(ifstream& myfile)
{

	int answer = 0;
	string line;
	while (getline(myfile, line))
	{
		auto ranges = Split(line, ',');
		auto range1 = Split(ranges[0], '-');
		auto range2 = Split(ranges[1], '-');

		int begin1 = stoi(range1[0]);
		int end1 = stoi(range1[1]);

		int begin2 = stoi(range2[0]);
		int end2 = stoi(range2[1]);

		if (((begin1 >= begin2 && begin1 <= end2) ||
			(end1 >= begin2 && end1 <= end2)) ||
			((begin1 <= begin2 && end1 >= end2) ||
			(begin2 <= begin1 && end2 >= end1))) {
			answer++;
		}
	}

	printf("Answer:%d\n", answer);
}

