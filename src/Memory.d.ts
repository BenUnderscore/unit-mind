/* OSBOLETE
interface CliContext
{
    currentColony: string | null;
}

interface Memory
{
    //A list of all the rooms containing colonies
    colonyRegistry: string[];
    //A struct containing all the data necessary for the CLI
    cliContext: CliContext;

    lastCreepNumber: number;
}

interface RoomMemory
{
    colony?: Colony;
}

interface Colony
{
    //Fixed stuff
    room: string;
    creepRegistry: string[]; //Names, not IDs
    classInfo: Record<string, ClassInfo>;

    spawns: string[];
    sources: string[];
    extensions: string[];
    walls: string[];

    roomObjectMetas: Record<string, any>;

    //State
    logistics?: any;
}

//Contains information about how many creeps
//of a given class there are and how many there should be
interface ClassInfo
{
    currentAmount: number;
    desiredAmount: number;
}

interface CreepMemory
{
    class: string;
    colonyRoom: string;
    role: string;
    roleMemory: any; //Can be anything
}*/

//General stuff

interface Memory
{
    //Unique.ts
    lastUnique: number;

    //SpawnSystem.ts
    spawnOrders: Record<number, SpawnOrder>;
    lastGeneratedCreepName?: string;
}

interface CreepMemory
{
    role: string;
}

//DECLARATIONS FOR OTHER FILES

//Callbacks.ts
type CallbackID = string;

//SpawnSystem.ts
interface SpawnOrder
{
    //USER FIELDS
    system: string; //The system from which the order came from
    class: string; //The creep class to spawn
    count: number; //The amount of creeps to spawn of this class
    room: string; //The room where the creeps will be needed
    //Prioritization is done within the system

    //CALLBACK
    meta?: any; //Any necessary metadata for the callback
    onSpawn?: CallbackID; //(creep: Creep, order: SpawnOrder)

    //SYSTEM FIELDS
    spawned?: number;
}