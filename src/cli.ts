import { initColony, findColonyByName } from "./colony";
import { creepClasses } from "./creepClasses";

//Pads the given string with spaces so the returned string has the given length
function padString(str: string, length: number) : string
{   
    while(str.length < length)
    {
        str += ' ';
    }

    return str;
}

export function createColony(room: string, name: string = room)
{
    console.log("Creating colony...");
    return initColony(room, name);
}

export function switchColony(targetColony: string) : string
{
    //Check if the colony exists
    let colony = findColonyByName(targetColony);

    if(!colony)
    {
        return "Failed to find specified colony " + targetColony + "!";
    }

    Memory.cliContext.currentColony = targetColony;
    return "Current colony is: " + targetColony;
}

export function colonyStatus() : string
{
    let targetColony = Memory.cliContext.currentColony;

    if(!targetColony)
    {
        return "No current colony!";
    }

    let colony = findColonyByName(targetColony);
    if(!colony)
    {
        return "Colony " + targetColony + " does not exist!";
    }


    //Output general information
    let output = "";
    output += "General information: \n";
    output += ("Colony name: " + colony.name + "\n");
    output += ("Colony population: " + colony.creepRegistry.length.toString() + "\n");

    //Output the current class breakdown
    output += "\nClass breakdown: \n";

    //if(colony.creepRegistry.length === 0)
    //{
    //    output += "No creeps.\n";
    //}
    //else
    {
        let columnWidth = 16;
    for(let creepClass in creepClasses())
    {
        if(creepClass.length > columnWidth)
        {
            columnWidth = creepClass.length;
        }
    }

        //Print the header
        let headerStart = output.length;
        output += padString("Class Name", columnWidth) + " ";
        output += padString("Desired", 8) + " ";
        output += padString("Actual", 8) + "\n";

        let headerLength = output.length - headerStart;
        for(let i = 0; i < headerLength - 2; i++)
        {
            output += '=';
        }
        output += '\n';

        //Print the class data
        for(let creepClass in colony.classInfo)
        {
            output += padString(creepClass, columnWidth) + " ";
            output += padString(colony.classInfo[creepClass].desiredAmount.toString(), 8) + " ";
            output += padString(colony.classInfo[creepClass].currentAmount.toString(), 8) + "\n";
        }
    }
    
    return output;
}

export function desiredClassCount(creepClass: string, amount: number)
{
    let targetColony = Memory.cliContext.currentColony;

    if(!targetColony)
    {
        return "No current colony!";
    }

    let colony = findColonyByName(targetColony);
    if(!colony)
    {
        return "Colony " + targetColony + " does not exist!";
    }

    if(!colony.classInfo[creepClass])
    {
        return "Creep class \"" + creepClass + "\" does not exist!";
    }

    colony.classInfo[creepClass].desiredAmount = amount > 0 ? amount : 0;
    return "Successfully updated.";
}