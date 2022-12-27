#include "Day15.h"
#include <algorithm>
#include <chrono>
#include <ctime>   

Day15::Day15() : Day("Day 15")
{
}

class pos {
public:
	long long int x = 0;
	long long int y = 0;

	long long int manhattanDist(pos& p) {

		long long int result = 0;
		long long int x_dif, y_dif;

		x_dif = p.x - x;
		y_dif = p.y - y;
		if (x_dif < 0)
			x_dif = -x_dif;
		if (y_dif < 0)
			y_dif = -y_dif;
		result = x_dif + y_dif;
		return result;
	}



	auto operator<=>(const pos&) const = default;

	auto operator<(const pos& p) {
		return  y == p.y ? x < p.x : y < p.y;
	}

};


class sensor : public pos {
public:
	pos beacon;



	vector<pos> noBeaconPoints() {
		vector<pos> result;

		auto md = manhattanDist(beacon);
		

		for (auto mdY = (y - md); mdY < (y + md); mdY++) {
			

			if (mdY != 10 && mdY != 2'000'000) {
				continue;
			}
			for (auto mdX = (x - md); mdX < (x + md); mdX++) {

				pos* p = new pos();
				p->x = mdX;
				p->y = mdY;

				if (manhattanDist(*p) <= md && *p != beacon) {
					result.push_back(*p);
				}
				delete p;

				
			}


		}

		return result;
	}
	vector<pos> noBeaconPointsB(long long int min, long long int max) {
		vector<pos> result;

		auto md = manhattanDist(beacon);
		auto minY = std::max(std::min((y - md), max),min);
		auto maxY = std::max(std::min((y + md), max), min);
		auto minX = std::max(std::min((x - md), max), min);
		auto maxX = std::max(std::min((x + md), max), min);
		auto b = result.begin();
		auto e = result.end();
		auto start = std::chrono::system_clock::now();
		pos* p = new pos();
		for (auto mdY = minY; mdY <= maxY; mdY++) {
			if (mdY == (minY + 100)) {
				auto end = std::chrono::system_clock::now();
				std::chrono::duration<double> elapsed_seconds = end - start;
				printf("100 rows in %f seconds\r\n", elapsed_seconds.count());
			}
			for (auto mdX = minX; mdX <= maxX; mdX++) {
				p->x = mdX;
				p->y = mdY;
				if (find(b, e, *p) == e) {
					if (manhattanDist(*p) <= md) {
						result.push_back(*p);
					}
				}
				
			}
		}

		delete p;
		return result;
	}


	auto operator<=>(const sensor&) const = default;

};

void parseBeacons(std::string& line, std::vector<sensor>& sensors)
{
	bool xSet = false;
	bool ySet = false;
	bool bXSet = false;
	bool bYSet = false;

	bool setX = false;
	bool setY = false;
	bool setBX = false;
	bool setBY = false;


	auto* sen = new sensor();
	auto* beacon = new pos();


	string val = "";
	int length = (int)line.length();
	for (auto i = 0; i < length; i++) {
		char c = line[i];
		if (c == '=') {
			val = "";
			if (!xSet) {
				setX = true;
			}
			else if (!ySet) {
				setY = true;
			}
			else if (!bXSet) {
				setBX = true;
			}
			else if (!bYSet) {
				setBY = true;
			}
		}

		if (setX || setY || setBX || setBY) {
			if (c != '=') {
				val += c;
			}
			if (c == ',' || c == ':' || i == (length - 1)) {
				if (setX) {
					sen->x = stoi(val);;
					setX = false;
					xSet = true;
				}
				else if (setY) {
					sen->y = stoi(val);;
					setY = false;
					ySet = true;
				}
				else if (setBX) {
					beacon->x = stoi(val);;
					setBX = false;
					bXSet = true;
				}
				else if (setBY) {
					beacon->y = stoi(val);
					setBY = false;
					bYSet = true;
					sen->beacon = *beacon;
					sensors.push_back(*sen);
					delete sen;
					delete beacon;


				}
			}

		}

	}
}

void Day15::ProcessInputA(ifstream& myfile)
{
	long long int answer = 0LL;
	string line;
	vector<sensor> sensors;
	while (getline(myfile, line))
	{
		parseBeacons(line, sensors);


	}


	vector<pos> noBeaconPoints = vector<pos>();
	long long int i = 1;
	long long int yA = 10;
	long long int yB = 2'000'000;

	for (auto& s : sensors) {
		i++;
		printf("finding no beacon points for: sensor %lli/%lli\r\n", i, sensors.size());
		noBeaconPoints.append_range(s.noBeaconPoints());
	}
	sort(noBeaconPoints.begin(), noBeaconPoints.end());

	auto u = unique(noBeaconPoints.begin(), noBeaconPoints.end());
	noBeaconPoints.erase(u, noBeaconPoints.end());

	answer = count_if(noBeaconPoints.begin(), noBeaconPoints.end(), [&yA](pos& p) { return p.y == yA; });
	printf("Answer y=10:%lli\n", answer);
	answer = count_if(noBeaconPoints.begin(), noBeaconPoints.end(), [&yB](pos& p) { return p.y == yB; });
	printf("Answer y=2000000:%lli\n", answer);
}

void Day15::ProcessInputB(ifstream& myfile)
{
	long long int answer = 0LL;
	string line;
	vector<sensor> sensors;
	while (getline(myfile, line))
	{
		parseBeacons(line, sensors);
	}

	vector<pos> noBeaconPoints = vector<pos>();
	long long int i = 0;
	long long int maxA = 20;
	long long int maxB = 4'000'000;

	for (auto& s : sensors) {
		i++;
		printf("finding no beacon points for: sensor %zi/%zi\r\n", i, sensors.size());
		if (sensors.size() == 14)
		{
			noBeaconPoints.append_range(s.noBeaconPointsB(0LL, maxA));
		}
		else {
			noBeaconPoints.append_range(s.noBeaconPointsB(0LL, maxB));
		}
	}
	sort(noBeaconPoints.begin(), noBeaconPoints.end());

	auto u = unique(noBeaconPoints.begin(), noBeaconPoints.end());
	noBeaconPoints.erase(u, noBeaconPoints.end());

	auto lastNbp = pos();
	
	for (auto& nbp : noBeaconPoints) {
		if (nbp.y != lastNbp.y) {
			lastNbp.y = nbp.y;
			lastNbp.x = 0;
		}
		if (nbp.x - lastNbp.x > 1) {
			answer = ((nbp.x - 1) * maxB) + nbp.y;
		}
		lastNbp = nbp;
	}

	printf("Answer:%lli\n", answer);

}
