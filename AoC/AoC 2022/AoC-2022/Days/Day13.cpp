#include "Day13.h"
#include <algorithm>

using namespace std;

Day13::Day13() : Day("Day 13")
{
}


lst::lst(lst* parent) {
	this->parent = parent;
	c = -1;
	subLst = 0;
}

string lst::toString()
{
	string result = "";
	if (c != -1) {
		result += to_string(c);
	}
	if (subLst != 0) {
		result += "[";
		string tmp = "";
		for (auto& l : *subLst) {
			string t = l.toString();
			if (t.length() != 0) {
				tmp += "," + l.toString();
			}
		}
		if (tmp.length() != 0) {
			result += tmp.substr(1);
		}
		result += "]";
	}
	return result;
}

void lst::add(lst item)
{
	if (subLst == 0) {
		subLst = new vector<lst>();
	}
	subLst->push_back(item);
	
}




bool Day13::Compare(lst left, lst right, bool& stop) {


	printf("Compare %s vs %s\r\n", left.toString().c_str(), right.toString().c_str());

	auto l = left.c;
	auto r = right.c;
	if (l == -1 && r == -1 && left.subLst == 0 && right.subLst == 0) {
		stop = false;
		return true;
	} 
	else if (l != -1 && r != -1) {
		if (r < l) {
			printf("r %i < l %i: false\r\n", r, l);
			stop = true;
			return false;
		}
		else if (l < r) {
			printf("l %i < r %i: true\r\n", l, r);
			stop = true;
			return true;
		}
		else {
			//printf("l %i == r %i: true\r\n", l, r);

		}
	}
	else if (left.subLst != 0 && right.subLst != 0) {
		bool substop = false;
		bool cmp = Compare(left.subLst, right.subLst, substop);
		stop = substop;
		if (substop) {
			return cmp;
		}
	}
	else if (right.subLst != 0 && (left.subLst == 0 && l == -1)) {
		printf("left ran out:true\r\n");
		stop = true;
		return true;
	}
	else if (left.subLst != 0 && (right.subLst == 0 && r == -1)) {
		printf("right ran out:false\r\n");
		stop = true;
		return false;
	}
	else if ((l == -1 || r == -1) && r != l) {
		lst* lstR = &right;
		lst* lstL = &left;
		if (l == -1 && r != -1) {
			lstR = new lst(lstR);
			lst* rt = new lst(lstR);
			rt->c = r;
			lstR->add(*rt);
		}
		else if (l != -1 && r == -1) {
			lstL = new lst(lstL);
			lst* lt = new lst(lstL);
			lt->c = l;
			lstL->add(*lt);
		}
		printf("different types\r\n");
		bool substop = false;

		if (lstL->subLst!=0 && lstL->subLst->empty() && lstR->subLst != 0 && lstR->subLst->empty() && lstL->c==-1 && lstR->c == -1) {
			stop = true;
		}
		bool c = CompareFirstItem(lstL->subLst, lstR->subLst, substop);
		stop = substop;

		if (substop) {

			return c;
		}
	}
	else {
		stop = true;
	}
	return true;

}

bool Day13::CompareFirstItem(vector<lst>* left, vector<lst>* right, bool& stop) {

	if (right == 0 || right->size() == 0) {
		printf("right ran out: false\r\n");
		stop = true;
		return false;
	}
	else if (left == 0 || left->size() == 0) {
		printf("left ran out: true\r\n");
		stop = true;
		return true;
	}
	else {
		bool substop = false;
		bool c = (Compare((left), (right), substop));
		stop = substop;
		if (substop) {

			return c;
		}
	}

	return true;
}

bool Day13::Compare(vector<lst>* left, vector<lst>* right, bool& stop) {

	auto size = left->size();
	if (right->size() > size)
	{
		size = right->size();
	}
	for (int i = 0; i < size; i++) {
		if (i >= right->size()) {
			printf("right ran out: false\r\n");
			stop = true;
			return false;
		}
		else if (i >= left->size()) {
			printf("left ran out: true\r\n");
			stop = true;
			return true;
		}
		else {
			bool substop = false;
			bool cmp = Compare((*left)[i], (*right)[i], substop);
			stop = substop;
			if (substop) {
				return cmp;
			}


		}
	}
	return true;
}
void Day13::ProcessInputA(ifstream& myfile)
{
	int answer = 0;


	lst* root = new lst(0);
	lst* currentList = root;

	string left;
	string right;


	while (getline(myfile, left) && getline(myfile, right))
	{


		ParseList(currentList, left);

		ParseList(currentList, right);

		string tmp;
		if (!getline(myfile, tmp)) {
			break;
		}
	}


	for (int i = 0; i < root->subLst->size(); i += 2) {
		auto lineNumber = ((i / 2) + 1);
		auto& left = (*root->subLst)[i];
		auto& right = (*root->subLst)[static_cast<std::vector<lst, std::allocator<lst>>::size_type>(i) + 1];

		printf("\r\nChecking Pair %i:\r\n", lineNumber);
		bool stop;
		if (Compare(left, right, stop)) {

			printf("Pair %i correct\r\n", lineNumber);
			answer += lineNumber;
		}
	}

	printf("Anser: %i", answer);
}


lst* Day13::ParseList(lst*& currentList, string line)
{
	lst* result = 0;
	int index = 0;
	string val = "";
	for (char c : line) {

		index++;
		if (c == '[') {

			currentList = new lst(currentList);
			if (result == 0) {
				result = currentList;
			}

		}
		else  if (c == ']') {

			lst* tmp2 = new lst(currentList);
			if (tmp2 && val.length() > 0) {
				tmp2->c = stoi(val);
				val = "";
			}
			currentList->add(*tmp2);

			currentList->parent->add(*currentList);

			currentList = currentList->parent;
		}
		else if (c == ',') {

			lst* tmp = new lst(currentList);
			if (tmp && val.length() > 0) {
				tmp->c = stoi(val);

				currentList->add(*tmp);
			}
			val = "";
		}
		else if (c != ',') {

			val.push_back(c);

		}

	}

	return result;

}



void Day13::ProcessInputB(ifstream& myfile)
{
	int answer = 0;


	lst* root = new lst(0);
	lst* currentList = root;

	string left;
	string right;

	lst* marker1 = ParseList(currentList, "[[2]]");
	lst* marker2 = ParseList(currentList, "[[6]]");

	while (getline(myfile, left) && getline(myfile, right))
	{


		ParseList(currentList, left);

		ParseList(currentList, right);

		string tmp;
		if (!getline(myfile, tmp)) {

			break;
		}
	}

	auto& subList = *root->subLst;



	sort(subList.begin(), subList.end(), [this](lst a, lst b) {
		try {
		bool stop;
		return Day13::Compare(a, b, stop);
	}
	catch (exception) {
		printf("error");
	}
		});

	for (auto& l : subList) {
		printf("%s\r\n", l.toString().c_str());
	}
	auto it = find(subList.begin(), subList.end(), *marker1);
	if (it != subList.end()) {
		answer =(1+ distance(subList.begin(), it));
	}
	it = find(subList.begin(), subList.end(), *marker2);
	if (it != subList.end()) {
		answer *= (1+distance(subList.begin(), it));
	}
	printf("Anser: %i", answer);
}
