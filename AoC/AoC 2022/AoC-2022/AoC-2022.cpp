// AoC-2022.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <stdlib.h>
#include <iostream>
#include <conio.h>
#include <stdio.h>
#include <string.h>
#include "AoC-2022.h"
#include "DayOne.h"
using namespace std;

DayOne* selectedDay = NULL;

void renderMenu() {
	printf("\nAvailable choices\n");
	if (selectedDay != NULL) {
		string name = selectedDay->GetName();
		string input = selectedDay->GetInput();

		printf("Selected Day: %s\n", name.c_str());
		printf("Selected input: %s\n", input.c_str());

		printf("A. RunA\n");
		printf("B. RunB\n");

		printf("X. switch input\n");
	}

	printf("1. Day 1\n");

	printf("C. Clear\n");
	printf("Q. Quit\n");
}

void handleInput() {
	bool done = false;
	while (!done) {

		printf("Enter choice:");
		char input[1];

		std::cin.read(input, 1);
		std::cin.ignore();

		switch (input[0]) {
		case 'a':
		case 'A':
			if (selectedDay != NULL) {
				selectedDay->RunA();
			}
			break;
		case 'b':
		case 'B':
			if (selectedDay != NULL) {
				selectedDay->RunB();
			}
			break;
		case 'x':
		case 'X':
			if (selectedDay != NULL) {
				selectedDay->SwitchInput();
			}
			renderMenu();
			break;
		case '1':
			printf("Selected day %c\n", input[0]);
			selectedDay = new DayOne();
			renderMenu();
			break;
		case 'C':
		case 'c':
			selectedDay = NULL;
			system("cls");
			renderMenu();
			break;
		case 'Q':
		case 'q':
			done = true;
			break;
		default:
			printf("Invalid choice received: %c\n", input[0]);
			renderMenu();
			break;
		}
	}
}

int main()
{
	renderMenu();
	handleInput();
}


// Run program: Ctrl + F5 or Debug > Start Without Debugging menu
// Debug program: F5 or Debug > Start Debugging menu

// Tips for Getting Started: 
//   1. Use the Solution Explorer window to add/manage files
//   2. Use the Team Explorer window to connect to source control
//   3. Use the Output window to see build output and other messages
//   4. Use the Error List window to view errors
//   5. Go to Project > Add New Item to create new code files, or Project > Add Existing Item to add existing code files to the project
//   6. In the future, to open this project again, go to File > Open > Project and select the .sln file
