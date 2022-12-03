// AoC-2022.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <stdlib.h>
#include <iostream>
#include <conio.h>
#include <stdio.h>
#include <string.h>
#include "AoC-2022.h"

#include "Days/Day1.h"
#include "Days/Day2.h"
#include "Days/Day3.h"
using namespace std;

Day* days[] = { new Day1(), new Day2(), new Day3() };
Day* selectedDay = NULL;

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

	int i = 1;
	for (Day* day : days) {
		printf("%i. %s\n", i++, day->GetName().c_str());
	}

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
		int dayIndex = (input[0] - 49);
		switch (input[0]) {
		case 'a': case 'A':
			if (selectedDay != NULL) {
				selectedDay->RunA();
			}
			break;
		case 'b': case 'B':
			if (selectedDay != NULL) {
				selectedDay->RunB();
			}
			break;
		case 'x': case 'X':
			if (selectedDay != NULL) {
				selectedDay->SwitchInput();
			}
			renderMenu();
			break;
		case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': 
			printf("Selected day %c\n", input[0]);
			selectedDay = days[dayIndex];
			renderMenu();
			break;
		case 'C': case 'c':
			selectedDay = NULL;
			system("cls");
			renderMenu();
			break;
		case 'Q': case 'q':
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
