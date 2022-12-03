#include "Day3.h"
#include <set>
#include <algorithm>
#include <string>
#include <vector>
#include <fstream>

using namespace std;

Day3::Day3() {
	initialInput = "Resources\\Day3\\input.txt";
	secondaryInput = "Resources\\Day3\\example.txt";
	input = initialInput;
}

string Day3::GetName()
{
	return "Day 3";
}
string Day3::GetInput()
{
	return input;
}
void Day3::SwitchInput() {
	if (input == initialInput) {
		input = secondaryInput;
	}
	else {
		input = initialInput;
	}
}

void Day3::ProcessInputA(ifstream& myfile)
{
	int answer = 0;
	string line;
	while (getline(myfile, line))
	{
		size_t compartmentSize = line.length() / 2;
		auto first = line.substr(0, compartmentSize);
		auto last = line.substr(compartmentSize, compartmentSize);
		answer += GetIntersectionScore(first, last);
	}
	printf("Answer:%d\n", answer);
}

string Day3::GetIntersection(string first, string last) {
	sort(first.begin(), first.end());
	sort(last.begin(), last.end());

	string matches = "";
	set_intersection(first.begin(), first.end(), last.begin(), last.end(), back_inserter(matches));

	string unique = "";
	unique_copy(matches.begin(), matches.end(), back_inserter(unique));
	return unique;
}

int Day3::GetIntersectionScore(string first, string last)
{
	int result = 0;
	
	string unique = GetIntersection(first, last);

	for (char match : unique) {
		result += GetValue(match);
	}

	return result;
}

int Day3::GetValue(char value)
{
	int result = 0;
	if (value >= 'a') {
		result = (int)(value - ('a' - 1));
	}
	else {
		result = (int)(value - ('A' - 27));
	}
	return result;
}

void Day3::ProcessInputB(ifstream& myfile)
{

	int answer = 0;
	string group[] = {"","",""};
	string line;
	int groupMemberIndex = 0;
	while (getline(myfile, line))
	{
		group[groupMemberIndex++] = line;
		if (groupMemberIndex == 3) {
			groupMemberIndex = 0;
			string intersection = "";
			for (string groupMember : group) {
				if (intersection == "") {
					intersection = groupMember;
				}
				intersection = GetIntersection(groupMember, intersection);
			}
			answer += GetValue(intersection[0]);
		}
		
	}

	printf("Answer:%d\n", answer);
}

