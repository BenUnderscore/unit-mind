import { spawnTick, spawnPreTick, spawnPostTick } from "./SpawnSystem"
import { timeTick } from "./Time";

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
    
    //EnergySystem.ts
    if(!Memory.energySystem)
        Memory.energySystem = {
            ownedSources: [],
            creeps: {},
        };
}

export const loop = function()
{
    //Pretick
    initMemory();
    spawnPreTick();

    //Tick
    spawnTick();
    timeTick();

    //Post-tick
    spawnPostTick();
}