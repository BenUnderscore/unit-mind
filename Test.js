//NAME GENERATOR
//Generates japanese-style names, because it's relatively simple
let nameMora = ["a", "i", "u", "e", "o",
    "ka", "ki", "ku", "ke", "ko",
    "ga", "gi", "gu", "ge", "go",
    "sa", "shi", "su", "se", "so",
    "sha", "sho", "shu",
    "za", "ji", "zu", "ze", "zo",
    "ja", "ju", "jo",
    "ta", "chi", "tsu", "te", "to",
    "da", /*,"ji, "zu",*/ "de", "do",
    "na", "ni", "nu", "ne", "no",
    "ha", "hi", "fu", "he", "ho",
    "ba", "bi", "bu", "be", "bo",
    "pa", "pi", "pu", "pe", "po",
    "ma", "mi", "mu", "me", "mo",
    "ra", "ri", "ru", "re", "ro",
    "ya", "yu", "yo", "n", " "]; //Space is double consonant (small tsu)
//Potentially more efficient algorithm - incomplete
/*
function generateRandomName() : string
{
    let random = getUnique();
    let syllableCount = Math.max(Math.ceil(Math.pow(random, 1/(nameSyllables.length))), 2);

    //Get the syllables from the "random" number
    let remainingRandom = random;
    let syllableIndices = [];
    for(let i = 1; i <= syllableCount; i++)
    {
        let x = remainingRandom % nameSyllables.length;
        syllableIndices.push(x);
        remainingRandom /= nameSyllables.length;
    }

    //Swap the order of the first two syllables if necessary
    if(nameSyllables[syllableIndices[0]] == "n" || nameSyllables[syllableIndices[0]] == " ")
    {
        let buf = syllableIndices[0];
        syllableIndices[0] = syllableIndices[1];
        syllableIndices[1] = buf;
    }

    for(let i = 0; i < syllableIndices.length; i++)
    {
        
    }
}*/
function generateRandomName() {
    let moraCount = Math.floor(Math.random() * 3) + 2;
    //Generate random syllables without rules
    let mora = [];
    for (let i = 0; i < moraCount; i++) {
        mora.push(nameMora[Math.floor(Math.random() * (nameMora.length))]);
    }
    //Enforce rules
    // Rule 1 - "n" or " " may not be the first mora
    // Rule 2 - "n" and/or " " may not repeat contiguously
    // Rule 3 - " " may not be the last mora
    // Rule 4 - " " must precede a mora with two or more characters
    //If any rules are broken, regenerate the mora:
    function enforceRule(index, rule) {
        while (!rule(index)) {
            mora[index] = nameMora[Math.floor(Math.random() * (nameMora.length))];
        }
    }
    //Complicated rules engine, DO NOT TOUCH
    for (let i = 0; i < mora.length; i++) {
        //Rule 1
        if (i === 0) {
            enforceRule(0, (index) => mora[index] !== "n" && mora[index] !== " ");
        }
        //Rule 2
        enforceRule(i, (index) => {
            if (mora[index] !== "n" && mora[index] !== " ")
                return true;
            if (index + 1 >= mora.length)
                return true;
            else
                return mora[index + 1] !== "n" && mora[index + 1] !== " ";
        });
        //Rule 3 & 4
        let n = 0;
        enforceRule(i, (index) => {
            n++;
            if (mora[index] !== " ")
                return true;
            if (index + 1 >= mora.length) //Rule 3 
                return false;
            else
                return mora[index + 1].length >= 2; //Rule 4
        });
        if (n > 1) //Retry mora if rule 3 or 4 failed, as it may be an "n" which needs rules checking
         {
            i--;
        }
    }
    //Combine mora
    let finalString = "";
    for (let i = 0; i < mora.length; i++) {
        if (mora[i] == " ") {
            finalString += mora[i + 1].substr(0, 1);
        }
        else {
            finalString += mora[i];
        }
    }
    //Final processing
    finalString.replace("oo", "ou");
    finalString.replace("ee", "ei");
    finalString = finalString.substr(0, 1).toUpperCase() + finalString.substr(1);
    return finalString;
}
exports.generateRandomName = generateRandomName
//# sourceMappingURL=SpawnSystem.js.map