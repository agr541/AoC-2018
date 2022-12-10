#include "Day9.h"
#include <algorithm>
#include <ranges>
#include <string>

using namespace std;
Day9::Day9() : Day("Day 9")
{
}


void Day9::ProcessInputA(ifstream& myfile)
{
	string line;


	int headX = 0;
	int headY = 0;
	vector<pos> tailPositions = vector<pos>();
	pos p = pos();
	p.x = headX;
	p.y = headY;
	tailPositions.push_back(p);

	int tailX = tailPositions.back().x;
	int tailY = tailPositions.back().y;

	vector<string> grids = vector<string>();
	DrawGrid(tailX, tailY, headX, headY, grids);

	while (getline(myfile, line))
	{
		string distanceString = line.substr(2);
		int distance = stoi(distanceString);
		for (int d = 0; d < distance; d++) {
			switch (line[0]) {
			case 'R':
				headX++;
				break;
			case 'L':
				headX--;
				break;
			case 'U':
				headY++;
				break;
			case 'D':
				headY--;
				break;
			default:
				break;
			}

			int xDif = tailX - headX;
			int yDif = tailY - headY;
			if (((abs(xDif) == 2) && yDif == 0) || ((abs(yDif) == 2) && xDif == 0)) {
				tailX += (int)(xDif * -0.5);
				tailY += (int)(yDif * -0.5);
			}
			else if (xDif != 0 && yDif != 0 && (abs(xDif) > 1 || abs(yDif) > 1)) {

				tailX += (xDif < 0) ? 1 : -1;
				tailY += (yDif < 0) ? 1 : -1;
			}
			pos p = pos();
			p.x = tailX;
			p.y = tailY;
			tailPositions.push_back(p);

			DrawGrid(tailX, tailY, headX, headY, grids);
		}
	}

	ranges::sort(tailPositions);
	const auto ret = ranges::unique(tailPositions);
	tailPositions.erase(ret.begin(), ret.end());

	printf("Answer: %zi", tailPositions.size());

	for (auto grid : grids) {
		printf("%s\r\n", grid.c_str());
	}
}

void Day9::DrawGrid(vector<pos> rope, std::vector<std::string>& grids) {

	int width = 26;
	int height = 21;
	string emptyGrid = "";
	for (int r = 0; r < height; r++) {

		for (int c = 0; c < width; c++) {
			emptyGrid += ".";
		}
		emptyGrid += "\r\n";
	}
	
	
	string grid = emptyGrid;
	for (int i = 0; i < rope.size(); i++) {
		pos p = rope[i];
		char marker = 'H';
		if (i > 0) {
			marker = (char)(i + 48);
		}
		int markerIndex = (p.x + ((height-1) - p.y) * (width+2));
		if (markerIndex < emptyGrid.length() && grid[markerIndex] == '.') {
			grid[markerIndex] = marker;
		}
	}
	grids.push_back(grid);
}

void Day9::DrawGrid(int tailX, int tailY, int headX, int headY, std::vector<std::string>& grids)
{

	int tailIndex = (tailX + (4 - tailY) * 8);
	int headIndex = (headX + (4 - headY) * 8);
	string emptyGrid = "......\r\n......\r\n......\r\n......\r\n......\r\n";
	if (tailIndex < emptyGrid.length() && headIndex < emptyGrid.length()) {
		string grid = emptyGrid;
		grid[tailIndex] = 'T';
		grid[headIndex] = 'H';
		grids.push_back(grid);
	}


}


void Day9::ProcessInputB(ifstream& myfile)
{
	string line;
	vector<pos> rope = vector<pos>();

	vector<pos> positionHistory = vector<pos>();
	for (int i = 0; i < 10; i++) {
		pos knot = pos();
		knot.x = 11;
		knot.y = 5;
		rope.push_back(knot);
	}
	positionHistory.push_back(rope.back());


	vector<string> grids = vector<string>();
	DrawGrid(rope, grids);

	while (getline(myfile, line))
	{

		string distanceString = line.substr(2);
		int distance = stoi(distanceString);
		for (int d = 0; d < distance; d++) {

			pos head = rope.front();
			switch (line[0]) {
			case 'R':
				head.x++;
				break;
			case 'L':
				head.x--;
				break;
			case 'U':
				head.y++;
				break;
			case 'D':
				head.y--;
				break;
			default:
				break;
			}
			rope[0] = head;
			for (int i = 1; i < rope.size(); i++) {

				pos p = rope[i];
				int xDif = p.x - rope[i - 1].x;
				int yDif = p.y - rope[i - 1].y;
				if (((abs(xDif) == 2) && yDif == 0) || ((abs(yDif) == 2) && xDif == 0)) {
					p.x += (int)(xDif * -0.5);
					p.y += (int)(yDif * -0.5);
				}
				else if (xDif != 0 && yDif != 0 && (abs(xDif) > 1 || abs(yDif) > 1)) {

					p.x += (xDif < 0) ? 1 : -1;
					p.y += (yDif < 0) ? 1 : -1;
				}
				rope[i] = p;
			}
			positionHistory.push_back(rope.back());
			
		}
		DrawGrid(rope, grids);
	}

	ranges::sort(positionHistory);
	const auto ret = ranges::unique(positionHistory);
	positionHistory.erase(ret.begin(), ret.end());

	for (auto grid : grids) {
		printf("%s\r\n", grid.c_str());
	}
	printf("Answer: %zi\n", positionHistory.size());

}
