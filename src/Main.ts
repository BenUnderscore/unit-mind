
import { runColonies } from "./colony";

export const initMemory = function()
{
    Memory.colonyRegistry = new Array<string>();
    Memory.rooms = {};
    Memory.creeps = {};
    Memory.lastCreepNumber = 0;
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

    if(!Memory.colonyRegistry)
    {
        initMemory();
    }

    //Run colonies
    runColonies();

    //Run creep logic
    //runCreeps();
}