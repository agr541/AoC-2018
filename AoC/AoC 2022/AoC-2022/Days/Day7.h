#pragma once
#include "Day.h"


class Dir {
public:
	Dir(string name, Dir* parent);
	int Size;
	string Name;
	Dir* Parent;
	vector<Dir*> Subdirs;
};

class Day7 :
	public Day
{
public:

	

	Day7();
	// Inherited via Day
	virtual void ProcessInputA(ifstream& myfile) override;
	virtual void ProcessInputB(ifstream& myfile) override;

	int SumSizesUnder(int size, Dir* dir);
	int FindSmallestOver(int size, Dir* dir);



};
