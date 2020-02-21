import { getColonyName } from "./colony";



export function switchColony(targetColony: string) : string
{
    //Check if the colony exists
    let colonyExists = false;
    for(let colony of Memory.colonyRegistry)
    {
        if(Memory.rooms[colony] && Memory.rooms[colony].colony && getColonyName(Memory.rooms[colony].colony as Colony) == targetColony)
        {
            colonyExists = true;
        }
    }

    if(!colonyExists)
    {
        return "Failed to find specified colony " + targetColony + "!";
    }

    Memory.cliContext.currentColony = targetColony;
    return "Current colony is: " + targetColony;
}