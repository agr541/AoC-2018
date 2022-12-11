#include "Day11.h"

Day11::Day11() : Day("Day 11")
{
}

void Day11::ProcessInputA(ifstream& myfile)
{
	int answer = 0;
	vector<Monkey*>* monkeys = new vector<Monkey*>();
	string name;
	while (getline(myfile, name))
	{
		if (name != "") {
			string startingItems;
			string operation;
			string test;
			string testTrue;
			string testFalse;

			getline(myfile, startingItems);
			getline(myfile, operation);
			getline(myfile, test);
			getline(myfile, testTrue);
			getline(myfile, testFalse);

			auto m = new Monkey(name, startingItems, operation, test, testTrue, testFalse);
			monkeys->push_back(m);
		}
	}
	printf("Answer: %i", answer);
}

void Day11::ProcessInputB(ifstream& myfile)
{
	int answer = 0;

	string line;
	while (getline(myfile, line))
	{
	}
	printf("Answer: %i", answer);
}

Monkey::Monkey(string name, string items, string operation, string test, string testTrue, string testFalse)
{
	this->name = name.substr(0, name.length()-1);
	
	_off_t offset = items.find(':')+1;
	auto commaIndex = items.find(',', offset);
	while (commaIndex != string::npos) {

		auto item = items.substr(offset + 1, commaIndex-offset-1);
		auto parsed = stoi(item);

		this->items.push_back(parsed);
		offset = commaIndex + 1;
		commaIndex = items.find(',', offset);
	}
	
	auto lastItem = items.substr(offset);
	auto parsedLastItem = stoi(lastItem);

	this->items.push_back(parsedLastItem);

	if (operation.contains('*')) {
		op = '*';
	}
	else if (operation.contains('+')) {
		op = '+';
	}
	this->operation = 


	this->name = name.substr(0);

}
