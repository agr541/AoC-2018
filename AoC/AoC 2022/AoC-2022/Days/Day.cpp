#include "Day.h"
#include <stdio.h>
#include <fstream>
#include <vector>
#include <iostream>
#include <filesystem>
#include <set>
using namespace std;


Day::Day(string name)
{
	_name = name;
	/*auto currentPath = filesystem::current_path();
	string sep = currentPath.preferred_separator();
	string path = currentPath.c_str() + sep + "Resources" + sep + _name;
	*/
	const std::filesystem::path resources{ "Resources\\" + _name };
	for (auto& p : std::filesystem::directory_iterator{ resources })
	{
		if (p.is_regular_file()) {
			
			_inputs.push_back(p.path().string());
		}
	}
}

string Day::GetName()
{
	return _name;
}

string Day::GetInput()
{
	return _inputs.at(_inputIndex);

}

void Day::SwitchInput()
{
	_inputIndex++;
	if (_inputIndex > _inputs.size()) {
		_inputIndex = 0;
	}
}

void Day::RunA()
{
	string input = GetInput();
	ifstream myfile(input);
	if (myfile.is_open())
	{
		ProcessInputA(myfile);
		myfile.close();
	}
}

void Day::RunB()
{
	string input = GetInput();
	ifstream myfile(input);
	if (myfile.is_open())
	{
		ProcessInputB(myfile);
		myfile.close();
	}
};

