#include "Day5.h"
#include <set>
#include <algorithm>
#include <string>
#include <vector>
#include <fstream>
#include <stack>
#include <queue>

using namespace std;

void Day5::ProcessInputA(ifstream& myfile)
{
	string answer = "";
	string line;
	vector<stack<char>> stacks = vector<stack<char>>::vector();
	bool initPhase = true;
	bool instructionPhase = false;
	stack<string> initLines = stack<string>::stack();
	while (getline(myfile, line))
	{
		if (initPhase && line.contains('[')) {
			initLines.push(line);
		}
		else if (instructionPhase) {
			
			size_t lineLength = line.length();
			size_t amountEnd = line.find(' ', 5);
			string amountString = line.substr(5, amountEnd - 5);
			size_t toStart = line.find("to");
			string fromString = line.substr(amountEnd + 6, lineLength - toStart - 3);
			string toString = line.substr(toStart + 3);


			int amount = stoi(amountString);
			int from = stoi(fromString);
			int to = stoi(toString);

			for (int i = 0; i < amount; i++) {
				char p = stacks[from - 1].top();
				stacks[from - 1].pop();
				stacks[to - 1].push(p);
			}

		}

		if (line.length() == 0) {
			while (!initLines.empty()) {
				auto initLine = initLines.top();
				initLines.pop();
				InitialzeStacks(initLine, stacks);
			}
			
			instructionPhase = true;
		}
	}

	for (stack s : stacks) {
		if (!s.empty()) {
			answer += s.top();
		}
	}
	printf("Answer:%s\n", answer.c_str());
}


void Day5::InitialzeStacks(std::string& line, std::vector<std::stack<char>>& stacks)
{
	size_t lineLength = line.length();
	if (stacks.empty()) {
		for (int i = 0; i < lineLength / 3; i++) {
			stacks.push_back(stack<char>::stack());
		}
	}
	for (int i = 1; i < line.length(); i += 4) {
		if (i < line.length()) {
			if (line[i] != ' ') {
				int li = i / 4;
				stacks[li].push(line[i]);
			}
		}
	}
	
}

void Day5::ProcessInputB(ifstream& myfile)
{
	string answer = "";
	string line;
	vector<stack<char>> stacks = vector<stack<char>>::vector();
	bool initPhase = true;
	bool instructionPhase = false;
	stack<string> initLines = stack<string>::stack();
	while (getline(myfile, line))
	{
		if (initPhase && line.contains('[')) {
			initLines.push(line);
		}
		else if (instructionPhase) {

			size_t lineLength = line.length();
			size_t amountEnd = line.find(' ', 5);
			string amountString = line.substr(5, amountEnd - 5);
			size_t toStart = line.find("to");
			string fromString = line.substr(amountEnd + 6, lineLength - toStart - 3);
			string toString = line.substr(toStart + 3);


			int amount = stoi(amountString);
			int from = stoi(fromString);
			int to = stoi(toString);

			stack<char> load = stack<char>::stack();
			for (int i = 0; i < amount; i++) {
				char p = stacks[from - 1].top();
				stacks[from - 1].pop();
				load.push(p);
			}

			while (!load.empty()) {
				stacks[to - 1].push(load.top());
				load.pop();
			}
			

		}

		if (line.length() == 0) {
			while (!initLines.empty()) {
				auto initLine = initLines.top();
				initLines.pop();
				InitialzeStacks(initLine, stacks);
			}

			instructionPhase = true;
		}
	}

	for (stack s : stacks) {
		if (!s.empty()) {
			answer += s.top();
		}
	}
	printf("Answer:%s\n", answer.c_str());
}

Day5::Day5() : Day("Day 5")
{
}
