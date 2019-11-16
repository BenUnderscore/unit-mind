

export const initMemory = function()
{
    Memory.colonyRegistry = new Array<string>();
    Memory.rooms = {};
    Memory.creeps = {};
    Memory.lastCreepIndex = 0;
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
}