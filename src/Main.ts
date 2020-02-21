
import { runColonies } from "./colony";

export const initMemory = function()
{
    Memory.colonyRegistry = new Array<string>();
    Memory.rooms = {};
    Memory.creeps = {};
    Memory.cliContext = { currentColony: null };
}

export const loop = function()
{
    //Clean creep memory
    for(let creepName in Memory.creeps)
    {
        if(!Game.creeps[creepName])
        {
            delete Memory.creeps[creepName];
        }
    }

    //Run colonies
    runColonies();

    //Run creep logic
    //runCreeps();
}