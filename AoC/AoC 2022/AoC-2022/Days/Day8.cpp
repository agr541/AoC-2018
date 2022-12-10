#include<iterator> // for iterators
#include<vector> // for vectors

#include "Day8.h"

Day8::Day8() : Day("Day 8")
{
}

void Day8::ProcessInputA(ifstream& myfile)
{
	string line;

	vector<vector<int>> matrix = vector<vector<int>>();

	vector<vector<bool>> visibleMatrix = vector<vector<bool>>();
	while (getline(myfile, line))
	{
		auto row = vector<int>();
		auto visibleRow = vector<bool>();

		for (char c : line) {
			visibleRow.push_back(true);
			row.push_back(c - 48);
		}
		visibleMatrix.push_back(visibleRow);
		matrix.push_back(row);
	}

	int answer = matrix.size() * 2 + (matrix[0].size()-2) * 2;
	
	for (int y = 1; y < matrix.size() - 1; y++) {
		auto row = matrix[y];
		for (int x = 1; x < row.size() - 1; x++) {
			int h = row[x];

			bool blockedLeft = false;
			for (int xx = 0; xx < x; xx++) {
				if (row[xx] >= h) {
					blockedLeft = true;
					break;
				}
			}
			bool blockedRight = false;
			for (int xx = x + 1; xx < row.size(); xx++) {
				if (row[xx] >= h) {
					blockedRight = true;
					break;
				}
			}


			bool blockedTop = false;
			for (int yy = 0; yy < y; yy++) {
				if (matrix[yy][x] >= h) {
					blockedTop = true;
					break;
				}
			}


			bool blockedBottom = false;
			for (int yy = y + 1; yy < matrix.size(); yy++) {
				if (matrix[yy][x] >= h) {
					blockedBottom = true;
					break;
				}
			}


			visibleMatrix[y][x] = (!blockedBottom || !blockedLeft || !blockedRight || !blockedTop);
			if (!blockedBottom || !blockedLeft || !blockedRight || !blockedTop) {
				answer++;
			}
		}

	}



	printf("Answer: %i", answer);


}

void Day8::ProcessInputB(ifstream& myfile)
{
	string line;

	vector<vector<int>> matrix = vector<vector<int>>();

	vector<vector<bool>> visibleMatrix = vector<vector<bool>>();
	while (getline(myfile, line))
	{
		auto row = vector<int>();
		auto visibleRow = vector<bool>();

		for (char c : line) {
			visibleRow.push_back(true);
			row.push_back(c - 48);
		}
		visibleMatrix.push_back(visibleRow);
		matrix.push_back(row);
	}

	int answer = 0;

	for (int y = 0; y < matrix.size(); y++) {
		auto row = matrix[y];
		for (int x = 0; x < row.size() ; x++) {
			int h = row[x];

			int leftDistance = 0;
			for (int xx = x-1; xx >= 0; xx--) {
				leftDistance++;
				if (row[xx] >= h) {
					break;
				}
			}
			int rightDistance = 0;
			for (int xx = x + 1; xx < row.size(); xx++) {
				rightDistance++;
				if (row[xx] >= h) {
					break;
				}
			}


			int topDistance = 0;
			for (int yy = y-1; yy >= 0; yy--) {
				topDistance++;
				if (matrix[yy][x] >= h) {
					break;
				}
			}


			int bottomDistance = 0;
			for (int yy = y + 1; yy < matrix.size(); yy++) {
				bottomDistance++;
				if (matrix[yy][x] >= h) {
					break;
				}
			}

			int score = topDistance * leftDistance * rightDistance * bottomDistance;
			if (answer < score) {
				answer = score;
			}
			
			if (x == 2 && y == 3) {
				answer = answer;
			}
		}

	}



	printf("Answer: %i", answer);
}
