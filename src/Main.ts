import { spawnTick } from "./SpawnSystem"

function initMemory()
{
    //Unique.ts
    if(!Memory.lastUnique)
        Memory.lastUnique = 0;

    //SpawnSystem.ts
    if(!Memory.spawnSystem)
        Memory.spawnSystem = {
            spawnOrders: {},
            spawningCreeps: []
        };
}

export const loop = function()
{
    //Pretick
    initMemory();

    //Tick
    spawnTick();

    //Post-tick
}