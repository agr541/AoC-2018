#include "Day7.h"
#include <stack>
#include <algorithm>

Day7::Day7() : Day("Day 7")
{
}

Dir::Dir(string name, Dir* parent) {
	Name = name;
	Parent = parent;
	Subdirs = vector<Dir*>();
};

void Day7::ProcessInputA(ifstream& myfile)
{
	string line;
	Dir* root = 0;
	Dir* currentDir = 0;

	while (getline(myfile, line))
	{
		switch (line[0])
		{
		case '$':
			if (line.substr(2, 2) == "cd") {
				auto dirName = line.substr(5);

				if (dirName == "..") {
					currentDir = currentDir->Parent;
				}
				else {

					auto dir = new Dir(dirName, currentDir);
					if (currentDir != 0) {
						currentDir->Subdirs.push_back(dir);
					}
					else {
						root = dir;
					}
					currentDir = dir;
				}
			}
			break;
		default:
			if (line.substr(0, 3) != "dir") {
				size_t spaceIndex = line.find(' ');
				string sizeString = line.substr(0, spaceIndex);
				int size = stoi(sizeString);
				auto parent = currentDir;
				while (parent != 0) {
					parent->Size += size;
					parent = parent->Parent;
				}
			}
			break;
		}
	}

	int answer = SumSizesUnder(100000, root);
	printf("Answer: %i", answer);

}

void Day7::ProcessInputB(ifstream& myfile)
{
	string line;
	Dir* root = 0;
	Dir* currentDir = 0;

	while (getline(myfile, line))
	{
		switch (line[0])
		{
		case '$':
			if (line.substr(2, 2) == "cd") {
				auto dirName = line.substr(5);

				if (dirName == "..") {
					currentDir = currentDir->Parent;
				}
				else {

					auto dir = new Dir(dirName, currentDir);
					if (currentDir != 0) {
						currentDir->Subdirs.push_back(dir);
					}
					else {
						root = dir;
					}
					currentDir = dir;
				}
			}
			break;
		default:
			if (line.substr(0, 3) != "dir") {
				size_t spaceIndex = line.find(' ');
				string sizeString = line.substr(0, spaceIndex);
				int size = stoi(sizeString);
				auto parent = currentDir;
				while (parent != 0) {
					parent->Size += size;
					parent = parent->Parent;
				}
			}
			break;
		}
	}

	int totalSize = 70000000;
	int free = totalSize-root->Size;
	int required = 30000000;
	int shortage = free - required;


	int answer = FindSmallestOver(shortage*-1, root);
	printf("Answer: %i", answer);
}

int Day7::SumSizesUnder(int maxSize, Dir* dir)
{
	int result = 0;
	if (dir->Size <= maxSize) {
		result += dir->Size;
	}
	for (Dir* subDir : dir->Subdirs) {
		result += SumSizesUnder(maxSize, subDir);
	}
	
	return result;

}

int Day7::FindSmallestOver(int minSize, Dir* dir)
{
	int result = 0;
	auto dirSizes = vector<int>();
	int size = dir->Size;
	if (size > minSize) {
		dirSizes.push_back(dir->Size);
	}
	for (Dir* subDir : dir->Subdirs) {
		int smallestOver = FindSmallestOver(minSize, subDir);
		if (smallestOver > 0) {
			dirSizes.push_back(smallestOver);
		}
	}
	
	sort(dirSizes.begin(), dirSizes.end());

	if (dirSizes.size() > 0) {
		result = dirSizes[0];
	}

	return result;
}
