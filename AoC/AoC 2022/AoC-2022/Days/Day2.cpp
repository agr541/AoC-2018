#include "Day2.h"
#include <stdio.h>
#include <string>
#include <fstream>

using namespace std;

Day2::Day2() {
	initialInput = "Resources\\Day2\\input.txt";
	secondaryInput = "Resources\\Day2\\example.txt";
	input = initialInput;
}

string Day2::GetName()
{
	return "Day 2";
}
string Day2::GetInput()
{
	return input;
}
void Day2::SwitchInput() {
	if (input == initialInput) {
		input = secondaryInput;
	}
	else {
		input = initialInput;
	}
}

/// <summary>
/// example:
/// A Y
/// B X
/// C Z
/// 
/// This strategy guide predicts and recommends the following:
/// 
/// In the first round, your opponent will choose Rock(A), and you should choose Paper(Y).This ends in a win for you with a score of 8 (2 because you chose Paper + 6 because you won).
/// In the second round, your opponent will choose Paper(B), and you should choose Rock(X).This ends in a loss for you with a score of 1 (1 + 0).
/// The third round is a draw with both players choosing Scissors, giving you a score of 3 + 3 = 6.
/// In this example, if you were to follow the strategy guide, you would get a total score of 15 (8 + 1 + 6).
/// 
/// Score: name (opponent/me)
/// 1 for Rock(A/X), 2 for Paper(B/Y), and 3 for Scissors(C/Z)
/// 

/// </summary>
/// <param name="myfile"></param>
void Day2::ProcessInputA(ifstream& myfile)
{
	int answer = 0;
	string line;
	while (getline(myfile, line))
	{

		char oponentChoice = line[0];
		char myChoice = line[2];

		answer += GetMyChoiceScore(myChoice);
		answer += GetOutcomeScore(oponentChoice, myChoice);


	}

	printf("Answer:%d\n", answer);
}

void Day2::ProcessInputB(ifstream& myfile)
{
	int answer = 0;
	string line;
	while (getline(myfile, line))
	{

		char oponentChoice = line[0];
		char outcome = line[2];

		char myChoice = GetOutcomeChoice(oponentChoice, outcome);
		answer += GetMyChoiceScore(myChoice);
		answer += GetOutcomeScore(oponentChoice, myChoice);

	}

	printf("Answer:%d\n", answer);
}

/// <summary>
/// Score: name (opponent/me)
/// 1 for Rock(A/X), 2 for Paper(B/Y), and 3 for Scissors(C/Z)
/// </summary>
/// <param name="choice"></param>
/// <returns></returns>
int Day2::GetMyChoiceScore(char choice)
{
	int result = 0;
	switch (choice)
	{
	case 'X': // rock
		result = 1;
		break;
	case 'Y': // paper
		result = 2;
		break;
	case 'Z': //scissors
		result = 3;
		break;
	default:
		break;
	}

	return result;
}

/// <summary>
/// 0 if you lost, 3 if the round was a draw, and 6 if you won).
/// </summary>
/// <param name="opponent"></param>
/// <param name="you"></param>
/// <returns></returns>
int Day2::GetOutcomeScore(char opponent, char you)
{
	int result = 0;
	bool opponentHasRock = opponent == 'A';
	bool opponentHasPaper = opponent == 'B';
	bool opponentHasScissors = opponent == 'C';

	bool youHaveRock = you == 'X';
	bool youHavePaper = you == 'Y';
	bool youHaveScissors = you == 'Z';

	if ((opponentHasRock && youHavePaper)
		|| (opponentHasPaper && youHaveScissors)
		|| (opponentHasScissors && youHaveRock)) {
		result = 6;
	}
	else if ((opponentHasRock && youHaveRock) ||
		(opponentHasPaper && youHavePaper) ||
		(opponentHasScissors && youHaveScissors)) {
		result = 3;
	}
	return result;
}

char Day2::GetOutcomeChoice(char opponent, char outcome)
{
	char result = 0;


	bool opponentHasRock = opponent == 'A';
	bool opponentHasPaper = opponent == 'B';
	bool opponentHasScissors = opponent == 'C';

	bool youLose = outcome == 'X';
	bool youDraw = outcome == 'Y';
	bool youWin = outcome == 'Z';

	char rock = 'X';
	char paper = 'Y';
	char scissors = 'Z';

	if ((opponentHasScissors && youWin)
		|| (opponentHasRock && youDraw)
		|| (opponentHasPaper && youLose)) {
		result = rock;
	}
	else if ((opponentHasRock && youWin)
		|| (opponentHasPaper && youDraw)
		|| (opponentHasScissors && youLose)) {
		result = paper;
	}
	else if ((opponentHasPaper && youWin)
		|| (opponentHasScissors && youDraw)
		|| (opponentHasRock && youLose)) {
		result = scissors;
	}

	return result;
}


