#include "Day12.h"
//Purpose: Implementation of Dijkstra's algorithm which finds the shortest
//path from a start node to every other node in a weighted graph. 
//Time complexity: O(n^2)
#include <iostream>
#include <limits>
#include <algorithm>
#include <format>
#include <execution>
using namespace std;

#define MAXV 100000

class EdgeNode {
public:
	int key;
	int weight;
	EdgeNode* next;
	EdgeNode(int, int);
};

EdgeNode::EdgeNode(int key, int weight) {
	this->key = key;
	this->weight = weight;
	this->next = NULL;
}

class Graph {
	bool directed;
public:
	EdgeNode* edges[MAXV + 1];
	Graph(bool);
	~Graph();
	void insert_edge(int, int, int, bool);
	void print();
};

Graph::Graph(bool directed) {
	this->directed = directed;
	for (int i = 1; i < (MAXV + 1); i++) {
		this->edges[i] = NULL;
	}
}

Graph::~Graph() {


}

void Graph::insert_edge(int x, int y, int weight, bool directed) {
	if (x > 0 && x < (MAXV + 1) && y > 0 && y < (MAXV + 1)) {
		EdgeNode* edge = new EdgeNode(y, weight);
		edge->next = this->edges[x];
		this->edges[x] = edge;
		if (!directed) {
			insert_edge(y, x, weight, true);
		}
	}
}

void Graph::print() {
	for (int v = 1; v < (MAXV + 1); v++) {
		if (this->edges[v] != NULL) {
			cout << "Vertex " << v << " has neighbors: " << endl;
			EdgeNode* curr = this->edges[v];
			while (curr != NULL) {
				cout << curr->key << endl;
				curr = curr->next;
			}
		}
	}
}

void init_vars(bool discovered[], int distance[], int parent[]) {
	for (int i = 1; i < (MAXV + 1); i++) {
		discovered[i] = false;
		distance[i] = std::numeric_limits<int>::max();
		parent[i] = -1;
	}
}

void dijkstra_shortest_path(Graph* g, int parent[], int distance[], int start) {

	bool discovered[MAXV + 1];
	EdgeNode* curr;
	int v_curr;
	int v_neighbor;
	int weight;
	int smallest_dist;

	init_vars(discovered, distance, parent);

	distance[start] = 0;
	v_curr = start;

	while (discovered[v_curr] == false) {

		discovered[v_curr] = true;
		curr = g->edges[v_curr];

		while (curr != NULL) {

			v_neighbor = curr->key;
			weight = curr->weight;

			if ((distance[v_curr] + weight) < distance[v_neighbor]) {
				distance[v_neighbor] = distance[v_curr] + weight;
				parent[v_neighbor] = v_curr;
			}
			curr = curr->next;
		}

		//set the next current vertex to the vertex with the smallest distance
		smallest_dist = std::numeric_limits<int>::max();
		for (int i = 1; i < (MAXV + 1); i++) {
			if (!discovered[i] && (distance[i] < smallest_dist)) {
				v_curr = i;
				smallest_dist = distance[i];
			}
		}
	}
}

int get_shortest_path(int v, int parent[]) {
	int result = 0;
	if (v > 0 && v < (MAXV + 1) && parent[v] != -1) {
		//cout << parent[v] << " ";
		result += get_shortest_path(parent[v], parent) + 1;
	}
	return result;
}

void print_distances(int start, int distance[]) {
	for (int i = 1; i < (MAXV + 1); i++) {
		if (distance[i] != std::numeric_limits<int>::max()) {
			cout << "Shortest distance from " << start << " to " << i << " is: " << distance[i] << endl;
		}
	}
}

Day12::Day12() : Day("Day 12")
{
}

void Day12::ProcessInputA(ifstream& myfile)
{
	auto S = 'a';
	auto E = 'z';

	int indexS = 0;
	int indexE = 0;
	int answer = 0;
	int index = 0;
	string line;
	vector<vector<int>> map = vector<vector<int>>();
	while (getline(myfile, line)) {
		vector<int> lineVect = vector<int>();
		for (auto c : line) {
			if (c == 'S') {
				c = S;
				indexS = index;
			}
			else if (c == 'E') {
				c = E;
				indexE = index;
			}

			lineVect.push_back((int)c - 97);

			index++;
		}
		printf("%s\r\n", line.c_str());

		map.push_back(lineVect);
	}

	printf("\r\n");
	/* Let us create the example graph discussed above */

	// Function call
	auto width = (int)map[0].size();
	auto height = (int)map.size();
	auto minW = 0;
	auto egdes = vector<tuple<int, int, int>>();

	for (auto y = 0; y < height; y++) {
		for (auto x = 0; x < width; x++) {
			index = y * width + x;
			auto from = index;
			auto fromX = x;
			auto fromY = y;
			auto toX = x;
			auto toY = y;


			auto fromVal = map[y][x];
			auto toVal = map[y][x];

			auto w = toVal - fromVal;


			fromVal = map[fromY][fromX];
			if (x < width - 1) {
				toX = x + 1;
				toVal = map[toY][toX];


				w = toVal - fromVal;

				if (w <= 1) {
					if (w < minW) {
						minW = w;
					}
					auto to = index + 1;
					auto ftx = make_tuple(from, to, w);
					egdes.push_back(ftx);
				}
			}
			if (x > 0) {
				toX = x - 1;
				toVal = map[toY][toX];
				w = toVal - fromVal;
				if (w <= 1) {
					if (w < minW) {
						minW = w;
					}
					auto to = index - 1;
					auto ftx = make_tuple(from, to, w);
					egdes.push_back(ftx);
				}
			}

			if (y < height - 1) {
				toX = x;
				toY = y + 1;
				toVal = map[toY][toX];
				w = toVal - fromVal;
				if (w <= 1) {
					if (w < minW) {
						minW = w;
					}
					auto to = index + width;
					auto fty = make_tuple(from, to, w);
					egdes.push_back(fty);
				}
			}
			if (y > 0) {
				toX = x;
				toY = y - 1;
				toVal = map[toY][toX];
				w = toVal - fromVal;
				if (w <= 1) {
					if (w < minW) {
						minW = w;
					}
					auto to = index - width;
					auto fty = make_tuple(from, to, w);
					egdes.push_back(fty);
				}
			}


		}
	}

	auto size = width * height;
	Graph* g = new Graph(true);
	std::sort(egdes.begin(), egdes.end());
	char afterPrintBuffer[100];
	string afterPrint = "";

	for (auto egde : egdes) {
		auto from = egde._Myfirst._Val;
		auto to = egde._Get_rest()._Myfirst._Val;
		auto w = egde._Get_rest()._Get_rest()._Myfirst._Val;
		auto fromX = from - (from / width) * width;
		auto fromY = (from / width);
		auto fromChar = (char)(map[fromY][fromX] + 97);

		auto toX = to - (to / (width)) * width;
		auto toY = (to / width);
		auto toChar = (char)(map[toY][toX] + 97);

		auto ew = w - minW + 1;
		string s = "";
		if (from == indexE) {
			s = "END->";
		}
		if (from == indexS) {
			s = "START->";
		}
		printf("%sfrom %i [%i,%i](%c) to %i[%i,%i](%c): %i\r\n", s.c_str(), from, fromX, fromY, fromChar, to, toX, toY, toChar, ew);

		if (from == indexS || from == indexE) {
			auto len = sprintf_s(afterPrintBuffer, "%sfrom %i [%i,%i](%c) to %i[%i,%i](%c): %i\r\n", s.c_str(), from, fromX, fromY, fromChar, to, toX, toY, toChar, ew);
			afterPrint += string::basic_string(afterPrintBuffer);
		}
		g->insert_edge(from + 1, to + 1, ew, true);
		if (w == 0) {
			g->insert_edge(to + 1, from + 1, ew, true);
		}

	}
	printf("%s", afterPrint.c_str());
	int parent[MAXV + 1];
	int distance[MAXV + 1];


	int start = indexS + 1;
	int end = indexE + 1;
	dijkstra_shortest_path(g, parent, distance, start);
	//print shortest path from vertex 1 to 5

	answer = get_shortest_path(end, parent);
	print_distances(start, distance);


	printf("Answer: %i", answer);
	delete g;
}


void Day12::ProcessInputB(ifstream& myfile)
{
	auto S = 'a';
	auto E = 'z';

	int indexS = 0;
	int indexE = 0;
	int answer = 0;
	int index = 0;
	string line;
	vector<vector<int>> map = vector<vector<int>>();
	auto startpoints = vector<int>();

	while (getline(myfile, line)) {
		vector<int> lineVect = vector<int>();
		for (auto c : line) {
			if (c == 'S' || c == 'a') {
				startpoints.push_back(index);
			}
			if (c == 'S') {
				c = S;
				indexS = index;
			}
			else if (c == 'E') {
				c = E;
				indexE = index;
			}

			lineVect.push_back((int)c - 97);

			index++;
		}
		//printf("%s\r\n", line.c_str());

		map.push_back(lineVect);
	}

	//printf("\r\n");
	/* Let us create the example graph discussed above */

	// Function call
	auto width = (int)map[0].size();
	auto height = (int)map.size();
	auto minW = 0;
	auto egdes = vector<tuple<int, int, int>>();


	for (auto y = 0; y < height; y++) {
		for (auto x = 0; x < width; x++) {
			index = y * width + x;
			auto from = index;
			auto fromX = x;
			auto fromY = y;
			auto toX = x;
			auto toY = y;


			auto fromVal = map[y][x];
			auto toVal = map[y][x];

			auto w = toVal - fromVal;


			fromVal = map[fromY][fromX];
			if (x < width - 1) {
				toX = x + 1;
				toVal = map[toY][toX];


				w = toVal - fromVal;

				if (w <= 1) {
					if (w < minW) {
						minW = w;
					}
					auto to = index + 1;
					auto ftx = make_tuple(from, to, w);
					egdes.push_back(ftx);
				}
			}
			if (x > 0) {
				toX = x - 1;
				toVal = map[toY][toX];
				w = toVal - fromVal;
				if (w <= 1) {
					if (w < minW) {
						minW = w;
					}
					auto to = index - 1;
					auto ftx = make_tuple(from, to, w);
					egdes.push_back(ftx);
				}
			}

			if (y < height - 1) {
				toX = x;
				toY = y + 1;
				toVal = map[toY][toX];
				w = toVal - fromVal;
				if (w <= 1) {
					if (w < minW) {
						minW = w;
					}
					auto to = index + width;
					auto fty = make_tuple(from, to, w);
					egdes.push_back(fty);
				}
			}
			if (y > 0) {
				toX = x;
				toY = y - 1;
				toVal = map[toY][toX];
				w = toVal - fromVal;
				if (w <= 1) {
					if (w < minW) {
						minW = w;
					}
					auto to = index - width;
					auto fty = make_tuple(from, to, w);
					egdes.push_back(fty);
				}
			}


		}
	}




	auto size = width * height;


	std::sort(egdes.begin(), egdes.end());


	//printf("%s", afterPrint.c_str());

	int count = (int)startpoints.size();
	index = 0;

	for_each(
		std::execution::par_unseq,
		startpoints.begin(),
		startpoints.end(),
		[&index, &count, &egdes,&minW, &indexE, &answer](auto&& startpoint)
		{
			//do stuff with item


			index++;
	Graph* g = new Graph(true);
	for (auto egde : egdes) {
		auto from = egde._Myfirst._Val;
		auto to = egde._Get_rest()._Myfirst._Val;
		auto w = egde._Get_rest()._Get_rest()._Myfirst._Val;

		auto ew = w - minW + 1;
		g->insert_edge(from + 1, to + 1, ew, true);
		if (w == 0) {
			g->insert_edge(to + 1, from + 1, ew, true);
		}

	}
	int parent[MAXV + 1];
	int distance[MAXV + 1];
	int start = startpoint + 1;
	int end = indexE + 1;
	dijkstra_shortest_path(g, parent, distance, start);
	//print shortest path from vertex 1 to 5


	auto tmp = get_shortest_path(end, parent);
	if (tmp != 0 && (tmp < answer || answer == 0)) {
		answer = tmp;
	}


	printf("%i / %i: %i\r\n", index, count, answer);



	delete g;
		});
	printf("Answer: %i", answer);
}

