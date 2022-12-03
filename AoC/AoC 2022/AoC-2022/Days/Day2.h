#pragma once
#include "Day.h"

class Day2 :
    public Day
{
    // Inherited via Day
    virtual string GetName() override;
    virtual string GetInput() override;
    virtual void SwitchInput() override;
    virtual void ProcessInputA(ifstream& myfile) override;
    virtual void ProcessInputB(ifstream& myfile) override;

public:
    Day2();

private:
    string initialInput = "Resources\\Day2\\input.txt";
    string secondaryInput = "Resources\\Day2\\example.txt";
    string input = initialInput;
    int GetMyChoiceScore(char choice);
    int GetOutcomeScore(char opponent, char you);
    char GetOutcomeChoice(char opponent, char outcome);

   


    

};

