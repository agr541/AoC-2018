#include "Day11.h"
#include <climits>
#include <vector>
#include <algorithm>
#include <iterator>
#include <ranges>
#include <set>

using namespace std;
Day11::Day11() : Day("Day 11")
{
}


void Day11::ProcessInputA(ifstream& myfile)
{
	item_t answer = 0;
	vector<Monkey*>* monkeys = new vector<Monkey*>();

	ParseInput(myfile, monkeys);
	RunRounds(monkeys, 20);

	sort(monkeys->rbegin(), monkeys->rend(), [](Monkey* a, Monkey* b) {
		return a->inspectCount < b->inspectCount;
		});
	answer = (*monkeys)[0]->inspectCount * (*monkeys)[1]->inspectCount;
	printf("Answer: %llu", answer);
}

void Day11::RunRounds(std::vector<Monkey*>* monkeys, int count)
{
	for (int i = 0; i < count; i++) {
		bool print = (i + 1 <= 20 || (i + 1) % 1000 == 0);
		if (print) { printf("round %i:\r\n", i + 1); }

		for (auto monkey : *monkeys) {
			if (print) { printf("%s is inspecting\r\n", monkey->name.c_str()); };
			monkey->inspect(monkeys);
			for (auto item : monkey->items) {
				printf("item:%llu\r\n", item);
			}
			if (print) {
				printf("inspectcount:%llu\r\n", monkey->inspectCount);
			}
		}
		if (print) {
			printf("\r\n\r\n");
		}
	}

}


void Day11::ParseInput(std::ifstream& myfile, std::vector<Monkey*>* monkeys)
{
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
}


void Day11::RunRounds2(std::vector<Monkey*>* monkeys, int count)
{
	item_t cm = 1;
	for (Monkey* m : *monkeys) {
		cm *= m->testDivisible;
	};

	for (int i = 0; i < count; i++) {
		bool print = (i + 1 <= 20 || (i + 1) % 1000 == 0);
		if (print) { printf("round %i:\r\n", i + 1); }

		for (auto monkey : *monkeys) {
			if (print) { printf("%s is inspecting\r\n", monkey->name.c_str()); };
			monkey->inspect2(monkeys, cm);
			for (auto item : monkey->items) {
				printf("item:%llu\r\n", item);
			}
			if (print) {
				printf("inspectcount:%llu\r\n", monkey->inspectCount);
			}
		}
		if (print) {
			printf("\r\n\r\n");
		}
	}

}


void Day11::ProcessInputB(ifstream& myfile)
{
	item_t answer = 0;
	vector<Monkey*>* monkeys = new vector<Monkey*>();

	ParseInput(myfile, monkeys);
	RunRounds2(monkeys, 10'000);

	sort(monkeys->rbegin(), monkeys->rend(), [](Monkey* a, Monkey* b) {
		return a->inspectCount < b->inspectCount;
		});
	answer = (*monkeys)[0]->inspectCount * (*monkeys)[1]->inspectCount;
	printf("Answer: %llu", answer);
}

Monkey::Monkey(string nameString, string itemsString, string operationString, string testString, string testTrueString, string testFalseString)
{
	this->name = nameString.substr(0, nameString.length() - 1);

	auto offset = itemsString.find(':') + 1;
	auto commaIndex = itemsString.find(',', offset);
	while (commaIndex != string::npos) {

		auto item = itemsString.substr(offset + 1, commaIndex - offset - 1);
		item_t parsed = stoull(item);
		this->items.push_back(parsed);

		offset = static_cast<unsigned long long>((int)commaIndex) + 1;
		commaIndex = itemsString.find(',', offset);
	}

	auto lastItem = itemsString.substr(offset);
	item_t parsedLastItem = stoull(lastItem);
	this->items.push_back(parsedLastItem);

	if (operationString.contains('*')) {
		op = '*';
	}
	else if (operationString.contains('+')) {
		op = '+';
	}

	auto opIndex = operationString.find(op);
	auto equalsIndex = operationString.find('=');
	auto l = operationString.substr(equalsIndex + 2, opIndex - 1 - equalsIndex - 2);
	auto r = operationString.substr(opIndex + 2);

	if (l == "old") {
		left = &old;
	}
	else {
		item_t* i = new item_t();
		*i = stoull(l);
		left = i;
	}
	if (r == "old") {
		right = &old;
	}
	else {
		item_t* i = new item_t();
		*i = stoull(r);
		right = i;
	}


	auto lastSpace = testString.find_last_of(' ');
	auto div = testString.substr(lastSpace + 1);
	item_t d = stoull(div);
	testDivisible = d;

	lastSpace = testTrueString.find_last_of(' ');
	this->testTrue = "Monkey " + testTrueString.substr(lastSpace + 1);

	lastSpace = testFalseString.find_last_of(' ');
	this->testFalse = "Monkey " + testFalseString.substr(lastSpace + 1);

}

void Monkey::inspect2(vector<Monkey*>* monkeys, item_t cm)
{
	for (int i = 0; i < items.size(); i++) {
		if (items[i] != 0) {
			inspectCount++;
			old = items[i];
			item_t newValue = 0;
			operate(newValue);

			auto nv = newValue % cm;

			string monkeyName = testTrue;
			if (nv % testDivisible != 0) {
				monkeyName = testFalse;
			}

			auto receiver = find_if(monkeys->begin(), monkeys->end(), [&monkeyName](const Monkey* obj) {return obj->name == monkeyName; });
			if (receiver != monkeys->end()) {
				receiver[0]->items.push_back(nv);
				items[i] = 0;
			}
		}
	}
	erase(items, 0);

}

void Monkey::inspect(vector<Monkey*>* monkeys)
{
	for (int i = 0; i < items.size(); i++) {
		if (items[i]!=0) {
			inspectCount++;
			old = items[i];
			item_t newValue = 0;
			operate(newValue);
			
			newValue /= 3;
			
			string monkeyName = testTrue;
			if (!test(newValue)) {
				monkeyName = testFalse;
			}

			auto receiver = find_if(monkeys->begin(), monkeys->end(), [&monkeyName](const Monkey* obj) {return obj->name == monkeyName; });
			if (receiver != monkeys->end()) {
				receiver[0]->items.push_back(newValue);
				items[i] = 0;
			}
		}
	}
	erase(items, 0);

}

void Monkey::operate(item_t& result)
{
	switch (op) {
	case '+':
		result = *right + *left;
		break;
	case '*':
		//if (((*right * *left) % testDivisible) == 0) {
		result = *right * *left;
		//}
		
		break;
	default:
		break;
	}
}

bool Monkey::test(item_t value)
{
	return ((value % testDivisible) == 0);
}



