
import { runColonies, initColony } from "./colony";
import _ from "lodash"

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

    //Initialize the first colony
    if(_.size(Memory.colonyRegistry) == 0 && _.size(Game.spawns) == 1)
    {
        let spawn = _.first(_.values(Game.spawns));
        if(spawn)
            initColony(spawn.room.name);
    }

    //Run colonies
    runColonies();
}