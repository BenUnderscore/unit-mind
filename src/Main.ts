import { spawnTick } from "./SpawnSystem"

function initMemory()
{
    //Unique.ts
    Memory.lastUnique = 0;

    //SpawnSystem.ts
    Memory.spawnOrders = {};
}

export const loop = function()
{
    initMemory();
    spawnTick();
}