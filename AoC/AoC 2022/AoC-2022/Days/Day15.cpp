#include "Day15.h"
#include <iostream>
#include <algorithm>
#include <chrono>
#include <thread>
#include <ctime>   
#include <ranges>
#include <execution>
#include <ppl.h>
#include <concurrent_vector.h>

using namespace std;
using numbertype = long long int;


Day15::Day15() : Day("Day 15")
{
}

class pos {
public:
	numbertype x = 0;
	numbertype y = 0;

	numbertype manhattanDist(pos& p) {

		numbertype result = 0;
		numbertype x_dif, y_dif;

		x_dif = p.x - x;
		y_dif = p.y - y;
		if (x_dif < 0)
			x_dif = -x_dif;
		if (y_dif < 0)
			y_dif = -y_dif;
		result = x_dif + y_dif;
		return result;
	}


	auto operator<(pos& p) const {
		return  y == p.y ? x < p.x : y < p.y;
	}
	
	const auto operator<(const pos& p) const {
		return  y == p.y ? x < p.x : y < p.y;
	}

	auto operator>(pos& p) const {
		return  y == p.y ? x > p.x : y > p.y;
	}

	auto operator<=(pos& p) const {
		return  y <= p.y && x <= p.x;
	}

	auto operator>=(pos& p) const {
		return  y >= p.y && x >= p.x;
	}

	auto operator==(const pos& p) const {
		return  y == p.y && x == p.x;
	}

};


class sensor : public pos {

public:
	pos beacon;


	numbertype leftX = 0;
	numbertype leftY = 0;
	numbertype rightX = 0;
	numbertype rightY = 0;
	numbertype manhattanDist = 0;
	numbertype coverageSideLength = 0;
	numbertype leftXPlusLeftY = 0;
	numbertype leftYMinLeftX = 0;
	numbertype rightXMinRightY = 0;
	numbertype rightXPlusRightY = 0;
	numbertype topY = 0;
	numbertype bottomY = 0;

	void calc() {
		manhattanDist = pos::manhattanDist(beacon);
		coverageSideLength = (numbertype)floor(sqrt(pow(manhattanDist,2) + pow(manhattanDist,2)));
		leftX = x - manhattanDist;
		leftY = y;
		rightX = x + manhattanDist;
		rightY = y;
		leftXPlusLeftY = leftX + leftY;
		leftYMinLeftX = leftY - leftX;
		rightXMinRightY = rightX - rightY;
		rightXPlusRightY = rightX + rightY;
		bottomY = y - manhattanDist;
		topY = y + manhattanDist;
	}

	vector<pos> noBeaconPoints() {
		vector<pos> result;

		auto md = manhattanDist;

		for (auto mdY = (y - md); mdY < (y + md); mdY++) {


			if (mdY != 10 && mdY != 2'000'000) {
				continue;
			}
			for (auto mdX = (x - md); mdX < (x + md); mdX++) {

				pos* p = new pos();
				p->x = mdX;
				p->y = mdY;

				if (pos::manhattanDist(*p) <= md && *p != beacon) {
					result.push_back(*p);
				}
				delete p;


			}


		}

		return result;
	}



	bool overlaps(numbertype& xx, long long yy) {

		// C/\D
		// A\/B
		// 
		// x: 6
		// y: 0
		// leftX: -1
		// leftY: 7
		// -6+6=0
		// 6+-1-7=-2
		// 
		// line A:y = -x + (leftX+leftY); 
		// line B:y = x - (rightX-rightY);
		// line C:y = x + (leftY-leftX);
		// line D:y = -x + (rightX+rightY) -x = dY - (rightX+rightY)
		bool result = false;

		if (xx >= leftX && xx <= rightX && yy <= topY && yy >= bottomY) {

			auto diffX = abs(x - xx);
			auto diffY = abs(y - yy);

			if (diffX <= manhattanDist && diffY <= manhattanDist) {
				if (xx <= x) {
					if (yy <= y) {
						auto aY = (xx * -1) + (leftXPlusLeftY);
						result = yy >= aY;
						//if (y == aY) {
						if (result) {
							auto newX = (xx + (2 * diffX));
							xx = newX;
						}
					}
					else {
						auto cY = (xx)+(leftYMinLeftX);
						result = yy <= cY;
						//if (y == cY) {

					}

				}
				else if (xx > x) {

					if (yy <= y) {
						result = (yy >= (xx)-(rightXMinRightY));
						if (result) {
							xx += diffY;
						}
					}
					else {
						result = (yy <= (xx * -1) + (rightXPlusRightY));

					}




				}
			}
		}


		return result;

	};


	bool overlaps(pos p) {
		auto x = p.x;
		return overlaps(x, p.y);
	}


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
					sen->calc();
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
	numbertype answer = 0LL;
	string line;
	vector<sensor> sensors;
	while (getline(myfile, line))
	{
		parseBeacons(line, sensors);


	}


	vector<pos> noBeaconPoints = vector<pos>();
	numbertype i = 1;
	numbertype yA = 10;
	numbertype yB = 2'000'000;

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


void addPosNextToBorder(sensor& s, pos* pMin, pos* pMax, priority_queue<pos>& poi)
{
	
	for (auto counter = 0LL; counter <= s.coverageSideLength-1; counter++) {

		// A/\B
		// C\/D

		auto* pA = new pos();
		pA->x = s.x - counter;
		pA->y = s.topY - counter + 1;
		if (*pA >= *pMin && *pA <= *pMax) {
			poi.push(*pA);
		}

		auto* pB = new pos();
		pB->x = s.x + counter;
		pB->y = s.topY - counter +1;
		if (*pA != *pB && (*pB >= *pMin && *pB <= *pMax)) {
			poi.push(*pB);
		}

		auto* pC = new pos();
		pC->x = s.x - counter;
		pC->y = s.bottomY + counter -1;
		if ((*pC != *pA && *pC != *pB) && (*pC >= *pMin && *pC <= *pMax)) {
			poi.push(*pC);
		}

		auto* pD = new pos();
		pD->x = s.x + counter;
		pD->y = s.bottomY + counter-1;
		if ((*pD != *pA && *pD != *pB && *pD != *pC) && (*pD >= *pMin && *pD <= *pMax)) {
			poi.push(*pD);
		}

		delete pA;
		delete pB;
		delete pC;
		delete pD;
	};
}

void Day15::ProcessInputB(ifstream& myfile)
{

	numbertype answer = 0LL;

	string line;
	vector<sensor> sensors;
	while (getline(myfile, line))
	{
		parseBeacons(line, sensors);
	}

	numbertype i = 0;
	numbertype maxA = 20;
	numbertype maxB = 4'000'000;
	numbertype maxXY;
	if (sensors.size() == 14)
	{
		maxXY = maxA;
	}
	else {
		maxXY = maxB;
	}

	priority_queue<pos> poi;

	auto* pMax = new pos{maxXY, maxXY};
	auto* pMin = new pos{ 0LL,0LL };
	
	if (sensors.size() == 14) {
		priority_queue<pos> poiTest;

		addPosNextToBorder(sensors[6], pMin, pMax, poiTest);
	}
	
	int sCount = 0;
	for (sensor& s : sensors) {

		printf("adding poi's for %i\r\n", ++sCount);
		addPosNextToBorder(s, pMin, pMax, poi);
	};

	
	auto size = poi.size();
	printf("processing poi's...\r\nitem count: %lli\r\n", size);

	while (!poi.empty() && answer == 0) {
		
		pos p = poi.top();
		poi.pop();
		while (!poi.empty()) {
			pos p2 = poi.top();
			if (p2 == p) {
				poi.pop();
			}
			else {
				break;
			}
		}
		
		if (((size - poi.size()) % 10000) == 0) {
			printf("items left: %lli\r\n", poi.size());
		}

		
		if (any_of(begin(sensors), end(sensors), [&p](sensor& s) { return s.overlaps(p); })) {
			continue;
		}
		answer = (p.x * 4'000'000) + p.y;
		

	}
	printf("Answer:%lli\n", answer);
	

}

