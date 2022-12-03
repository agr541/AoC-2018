
#include "Day.h"

class Day2 :
    public Day
{
    // Inherited via Day
    virtual void ProcessInputA(ifstream& myfile) override;
    virtual void ProcessInputB(ifstream& myfile) override;

public:
    Day2();

private:
    int GetMyChoiceScore(char choice);
    int GetOutcomeScore(char opponent, char you);
    char GetOutcomeChoice(char opponent, char outcome);

   


    

};

