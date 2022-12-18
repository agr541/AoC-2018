#pragma once
#include "Day.h"

class lst {
public:
	lst(lst* parent);
	void add(lst item);
	vector<lst>* subLst;
	int c;
	lst* parent;
	
	string toString();


	friend bool operator==(lst const&, lst const&) = default;
};

class Day13 :
	public Day
{



public:
	Day13();
	bool Compare(lst left, lst right, bool& stop);
	bool CompareFirstItem(vector<lst>* left, vector<lst>* right, bool& stop);
	bool Compare(vector<lst>* left, vector<lst>* right, bool& stop);

	// Inherited via Daybool &stop
	virtual void ProcessInputA(ifstream& myfile) override;
	lst* ParseList(lst*& currentList, string line);

	virtual void ProcessInputB(ifstream& myfile) override;
};

