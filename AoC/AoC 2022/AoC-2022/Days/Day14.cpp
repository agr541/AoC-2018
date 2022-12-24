#include "Day14.h"
#include <functional>
#include <algorithm>
#include <iostream>
#include <conio.h>



Day14::Day14() :Day("Day 14")
{
}

struct pos {
	int x;
	int y;

	auto operator<=>(const pos&) const = default;

	auto operator<(const pos& p) {
		return y < p.y && x < p.x;
	}
};

void setY(string& val, pos& p, vector<pos>& points) {
	p.y = stoi(val);
	val = "";
	points.push_back(p);
	p = pos();
}

void setX(string& val, pos& p) {
	p.x = stoi(val);
	val = "";
}

pair<int, int> getminmax(vector<vector<pos>> items, function<int(pos)> f) {
	vector<int> trans = vector<int>();
	for (auto& item : items) {
		auto& transItem = *transform(item.begin(), item.end(), back_inserter(trans), f);
	}
	auto mm = minmax_element(trans.begin(), trans.end());

	auto& min = *mm.first;
	auto& max = *mm.second;

	return make_pair(min, max);
}


pair<int, int> getminmax(vector<string> items, function<int(string)> f) {
	vector<int> trans = vector<int>();
	for (auto& item : items) {
		trans.push_back(f(item));
	}
	auto mm = minmax_element(trans.begin(), trans.end());

	auto& min = *mm.first;
	auto& max = *mm.second;

	return make_pair(min, max);
}

vector<pos> getInbetweens(vector<vector<pos>> paths) {
	vector<pos> inbetweens = vector<pos>();
	for (auto p : paths) {

		for (int pntIndex = 0; pntIndex < p.size() - 1; pntIndex++) {
			pos posCurrent = p[pntIndex];
			pos posNext = p[pntIndex + 1];


			if (posCurrent.x == posNext.x) {
				auto biggestY = max(posCurrent.y, posNext.y);
				auto smallestY = min(posCurrent.y, posNext.y);

				for (int ibY = smallestY + 1; ibY <= biggestY; ibY++) {
					pos inbetween = pos();
					inbetween.x = posCurrent.x;
					inbetween.y = ibY;
					inbetweens.push_back(inbetween);
				}
			}


			if (posCurrent.y == posNext.y) {
				auto biggestX = max(posCurrent.x, posNext.x);
				auto smallestX = min(posCurrent.x, posNext.x);

				for (int ibX = smallestX + 1; ibX <= biggestX; ibX++) {
					pos inbetween = pos();
					inbetween.y = posCurrent.y;
					inbetween.x = ibX;
					inbetweens.push_back(inbetween);
				}
			}
		}
	}
	return inbetweens;
}

bool overlaps(pos& p, vector<pos>& coords) {
	//return binary_search(coords.begin(), coords.end(), p);
	//return coords.find(p) != coords.end();
	//return coords.contains(p);
	return ((find(coords.begin(), coords.end(), p)) != coords.end());
}

void drawGrid(vector<vector<pos>> paths, int& answer) {

	pos sandSource = pos();
	sandSource.x = 500;
	sandSource.y = 0;

	auto minMaxX = getminmax(paths, [](pos a) {
		return a.x;
		});
	auto minMaxY = getminmax(paths, [](pos a) {
		return a.y;
		});

	minMaxX.first = min(sandSource.x, minMaxX.first);
	minMaxX.second = max(sandSource.x, minMaxX.second);

	minMaxY.first = min(sandSource.y, minMaxY.first);
	minMaxY.second = max(sandSource.y, minMaxY.second);


	vector<string> xCoords = vector<string>();
	for (auto x = minMaxX.first; x <= minMaxX.second; x++)
	{
		string sX = to_string(x);
		xCoords.push_back(sX);
	}
	auto minMaxXLength = getminmax(xCoords, [](string a) {
		return a.length();
		});

	for (auto& xc : xCoords) {
		while (xc.length() < minMaxXLength.second) {
			xc = " " + xc;
		}
	}

	vector<string> yCoords = vector<string>();
	for (auto y = minMaxY.first; y <= minMaxX.second; y++)
	{
		string sY = to_string(y);
		yCoords.push_back(sY);
	}
	auto minMaxYLength = getminmax(yCoords, [](string a) {
		return a.length();
		});
	for (auto& yc : yCoords) {
		while (yc.length() < minMaxYLength.second) {
			yc = " " + yc;
		}
	}

	vector<pos> inbetweens = getInbetweens(paths);

	vector<pos> sand = vector<pos>();
	vector<pos> rocks = vector<pos>();
	
	for (auto y = minMaxY.first; y <= minMaxY.second; y++) {
		for (auto x = minMaxX.first; x <= minMaxX.second; x++) {

			bool rock = false;
			for (auto p : paths) {
				if (!rock) {
					for (auto pnt : p) {
						if (pnt.x == x && pnt.y == y) {
							rock = true;
							break;
						}
					}
					for (auto pnt : inbetweens) {
						if (pnt.x == x && pnt.y == y) {
							rock = true;
							break;
						}
					}
				}
			}
			if (rock) {
				pos prock = pos();
				prock.x = x;
				prock.y = y;
				
				rocks.push_back(prock);
			}
		}
	}

	int i = 0;
	while (answer == 0) {
		i++;
		pos newSand = pos();
		newSand.x = sandSource.x;
		newSand.y = sandSource.y;

		while (!overlaps(newSand, rocks) &&
			!overlaps(newSand, sand)) {

			newSand.y++;
			if (overlaps(newSand, sand) ||
				overlaps(newSand, rocks)) {
				newSand.x--;
				if (overlaps(newSand, sand) ||
					overlaps(newSand, rocks)) {
					newSand.x += 2;
					if (overlaps(newSand, sand) ||
						overlaps(newSand, rocks)) {
						newSand.y--;
						newSand.x--;
						break;
					}
				}
			}

			if (newSand.y >= minMaxY.second) {
				answer = i - 1;
				break;
			}

		};

		sand.push_back(newSand);

		if (i < 25 || answer != 0) {
			system("CLS");

			vector<string> xCoordsCopy = vector<string>();
			for (auto xcc : xCoords) {
				xCoordsCopy.push_back(xcc);
			}


			for (auto x = 0; x < minMaxXLength.second; x++)
			{
				for (int mmy = 0; mmy < minMaxXLength.second; mmy++) {
					printf(" ");
				}

				for (auto& xc : xCoordsCopy) {
					if (!xc.empty()) {
						printf("%s", xc.substr(0, 1).c_str());
						xc = xc.substr(1);
					}
					else {
						printf(" ");
					}
				}
				printf("\r\n");
			}

			for (auto y = minMaxY.first; y <= minMaxY.second; y++) {
				auto yss = to_string(y).length();
				for (int mmy = yss; mmy < minMaxXLength.second - 1; mmy++) {
					printf(" ");
				}

				printf("%i ", y);

				for (auto x = minMaxX.first; x <= minMaxX.second; x++) {

					pos p = pos();
					p.x = x;
					p.y = y;

					if (sandSource == p) {
						printf("+");
					}
					else if (overlaps(p, rocks)) {
						printf("#");
					}
					else if (overlaps(p, sand)) {
						printf("o");
					}
					else {
						printf(".");
					}



				}

				printf("\r\n");
			}
		}

	}

}

void drawGridWithBottom(vector<vector<pos>> paths, int& answer) {
	system("cls");
	
	pos sandSource = pos();
	sandSource.x = 500;
	sandSource.y = 0;
	printf("getting min/max...\r\n");

	auto minMaxX = getminmax(paths, [](pos a) {
		return a.x;
		});
	auto minMaxY = getminmax(paths, [](pos a) {
		return a.y;
		});

	minMaxX.first = min(sandSource.x, minMaxX.first);
	minMaxX.second = max(sandSource.x, minMaxX.second);

	minMaxY.first = min(sandSource.y, minMaxY.first);
	minMaxY.second = max(sandSource.y, minMaxY.second);

	int bottom = minMaxY.second + 2;

	vector<string> xCoords = vector<string>();
	for (auto x = minMaxX.first; x <= minMaxX.second; x++)
	{
		string sX = to_string(x);
		xCoords.push_back(sX);
	}
	auto minMaxXLength = getminmax(xCoords, [](string a) {
		return a.length();
		});

	for (auto& xc : xCoords) {
		while (xc.length() < minMaxXLength.second) {
			xc = " " + xc;
		}
	}

	vector<string> yCoords = vector<string>();
	for (auto y = minMaxY.first; y <= minMaxX.second; y++)
	{
		string sY = to_string(y);
		yCoords.push_back(sY);
	}
	auto minMaxYLength = getminmax(yCoords, [](string a) {
		return a.length();
		});
	for (auto& yc : yCoords) {
		while (yc.length() < minMaxYLength.second) {
			yc = " " + yc;
		}
	}

	vector<pos> inbetweens = getInbetweens(paths);
	vector<pos> sand = vector<pos>();

	printf("adding rocks...\r\n");
	vector<pos> rocks = vector<pos>();
	for (auto y = minMaxY.first; y <= minMaxY.second; y++) {
		for (auto x = minMaxX.first; x <= minMaxX.second; x++) {

			bool rock = false;
			for (auto p : paths) {
				if (!rock) {
					for (auto pnt : p) {
						if (pnt.y == bottom) {
							rock = true;
							break;
						}
						if (pnt.x == x && pnt.y == y) {
							rock = true;
							break;
						}
					}
					for (auto pnt : inbetweens) {
						if (pnt.x == x && pnt.y == y) {
							rock = true;
							break;
						}
					}
				}
			}
			if (rock) {
				pos prock = pos();
				prock.x = x;
				prock.y = y;
				rocks.push_back(prock);
			}
		}
	}
	
	sort(rocks.begin(), rocks.end());

	int i = 0;
	while (answer == 0) {
		i++;
		pos newSand = pos();
		newSand.x = sandSource.x;
		newSand.y = sandSource.y;
		bool newSandStart = true;

		while (!overlaps(newSand, rocks) &&
			!overlaps(newSand, sand) &&
			(newSandStart || newSand != sandSource)) {
			newSandStart = false;
			newSand.y++;
			if (overlaps(newSand, sand) ||
				overlaps(newSand, rocks) ||
				newSand.y == bottom) {
				newSand.x--;
				if (overlaps(newSand, sand) ||
					overlaps(newSand, rocks) ||
					newSand.y == bottom) {
					newSand.x += 2;
					if (overlaps(newSand, sand) ||
						overlaps(newSand, rocks) ||
						newSand.y == bottom) {
						newSand.y--;
						newSand.x--;
						break;
					}
				}
			}


		};

		if (newSand == sandSource) {
			answer = i;
			return;
		}
		sand.push_back(newSand);

		string buffer = "";
		if (i < 100 || answer != 0 || i % 100 == 0) {


			vector<string> xCoordsCopy = vector<string>();
			for (auto xcc : xCoords) {
				xCoordsCopy.push_back(xcc);
			}


			for (auto x = 0; x < minMaxXLength.second; x++)
			{
				for (int mmy = 0; mmy < minMaxXLength.second; mmy++) {
					buffer += " ";
				}

				for (auto& xc : xCoordsCopy) {
					if (!xc.empty()) {
						buffer += _Printf_format_string_("%s", xc.substr(0, 1).c_str());
						xc = xc.substr(1);
					}
					else {
						buffer += " ";
					}
				}
				buffer += "\r\n";
			}

			for (auto y = minMaxY.first; y <= minMaxY.second; y++) {
				auto yss = to_string(y).length();
				for (int mmy = yss; mmy < minMaxXLength.second - 1; mmy++) {
					buffer += " ";
				}

				buffer += to_string(y) + " ";// _Printf_format_string_("%i ", y);

				for (auto x = minMaxX.first; x <= minMaxX.second; x++) {

					pos p = pos();
					p.x = x;
					p.y = y;

					if (sandSource == p) {
						buffer += "+";
					}
					else if (overlaps(p, rocks)) {
						buffer += "#";
					}
					else if (overlaps(p, sand)) {
						buffer += "o";
					}
					else {
						buffer += ".";
					}



				}

				buffer += "\r\n";
			}
			
			system("cls");
			cout << buffer;
			

		}

	}

}
void Day14::ProcessInputA(ifstream& myfile)
{
	int answer = 0;
	string line;
	vector<pos> points = vector<pos>();
	vector<vector<pos>> paths = vector<vector<pos>>();
	while (getline(myfile, line)) {
		string val = "";
		pos p = pos();
		for (char c : line)
		{
			if (c == ',') {
				setX(val, p);
			}
			else if (c == ' ' && !val.empty()) {
				setY(val, p, points);
			}
			else if (c == '-' || c == '>') {

			}
			else {
				val.push_back(c);
			}
		}
		setY(val, p, points);
		paths.push_back(points);
		points = vector<pos>();
	}

	drawGrid(paths, answer);

	printf("Answer: %i", answer);
}



void Day14::ProcessInputB(ifstream& myfile)
{
	int answer = 0;
	string line;
	vector<pos> points = vector<pos>();
	vector<vector<pos>> paths = vector<vector<pos>>();
	printf("reading file..\r\n");
	while (getline(myfile, line)) {
		string val = "";
		pos p = pos();
		for (char c : line)
		{
			if (c == ',') {
				setX(val, p);
			}
			else if (c == ' ' && !val.empty()) {
				setY(val, p, points);
			}
			else if (c == '-' || c == '>') {

			}
			else {
				val.push_back(c);
			}
		}
		setY(val, p, points);
		paths.push_back(points);
		points = vector<pos>();
	}

	drawGridWithBottom(paths, answer);

	printf("Answer: %i", answer);
}
