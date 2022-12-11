#include "Day10.h"

Day10::Day10() : Day("Day 10")
{

}

void Day10::ProcessInputA(ifstream& myfile)
{
	int answer = 0;
	int cycle = 1;
	int addArg = 0;
	vector<tuple<int, int>> values = vector<tuple<int, int>>();
	int x = 1;
	string line;
	while (getline(myfile, line))
	{
		
		auto opcode = line.substr(0, 4);
		
		
		addArg = 0;
		if (opcode == "addx") {
			addArg = stoi(line.substr(5));
			cycle++;
			if (cycle == 20 || cycle == 60 || cycle == 100 || cycle == 140 || cycle == 180 || cycle == 220) {
				answer += (cycle * x);
			}
			values.push_back(make_tuple(cycle, x));
			x += addArg;
			cycle++;
			if (cycle == 20 || cycle == 60 || cycle == 100 || cycle == 140 || cycle == 180 || cycle == 220) {
				answer += (cycle * x);
			}
			values.push_back(make_tuple(cycle, x));
		}
		else {
			cycle++;
			if (cycle == 20 || cycle == 60 || cycle == 100 || cycle == 140 || cycle == 180 || cycle == 220) {
				answer += (cycle * x);
			}
			values.push_back(make_tuple(cycle, x));
		}


	}
	x += addArg;
	printf("Answer: %i", answer);
}

void Day10::ProcessInputB(ifstream& myfile)
{
	string answer = "";
	int cycle = 1;
	int addArg = 0;
	vector<tuple<int, int>> values = vector<tuple<int, int>>();
	int x = 1;
	string line;
	int pixelIndex = 0;
	while (getline(myfile, line))
	{

		auto opcode = line.substr(0, 4);


		addArg = 0;
		if (opcode == "addx") {
			addArg = stoi(line.substr(5));
			cycle++;
			drawPixel(pixelIndex, x, answer);
			values.push_back(make_tuple(cycle, x));
			cycle++;
			drawPixel(pixelIndex, x, answer);
			x += addArg;

			values.push_back(make_tuple(cycle, x));
		}
		else {
			cycle++;
			drawPixel(pixelIndex, x, answer);
			values.push_back(make_tuple(cycle, x));
		}


	}
	x += addArg;
	printf("Answer:\r\n%s", answer.c_str());
}


void Day10::drawPixel(int& pixelIndex, int x, std::string& answer)
{
	if ((abs(x - pixelIndex)) <= 1) {
		answer += "#";
	}
	else {
		answer += ".";
	}
	pixelIndex++;
	if (pixelIndex == 40) {
		answer += "\r\n";
		pixelIndex = 0;
	}

}
