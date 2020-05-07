//General stuff

interface Memory
{
    //Unique.ts
    lastUnique: number;

    //Time.ts
    time: Time;

    //SpawnSystem.ts
    spawnSystem: SpawnSystem;
}

interface CreepMemory
{
    class: string;
    orderNum?: number;
    spawn?: Id<StructureSpawn>;
}

interface RoomMemory
{
    activityStatus?: RoomActivityStatus;
}

//DECLARATIONS FOR OTHER FILES

//Callbacks.ts
type CallbackID = string;

//Time.ts
interface Time
{
    //How many ticks have elapsed since the beginning
    ticksElapsed: number;
    //The number of the current period
    currentPeriod: number;
}

//SpawnSystem.ts
interface SpawnSystem
{
    spawnOrders: Record<number, SpawnOrder>;
    lastGeneratedCreepName?: string;
    spawningCreeps: string[]; //Creep names
}

interface SpawnOrder
{
    //USER FIELDS
    system: string; //The system from which the order came from
    class: string; //The creep class to spawn
    count: number; //The amount of creeps to spawn of this class
    room: string; //The room where the creeps will be needed
    //Prioritization is done within the system

    //CALLBACK
    meta?: any; //Any necessary metadata for callbacks
    //onSpawn gets called once the creep has finished spawning and is in the world
    //Use it to initialize its memory and hand it off to the system responsible for it
    onSpawn?: CallbackID; //(creep: Creep, order: SpawnOrder)
    //onFinish gets called once the last creep has been spawned
    //Boolean is set to true if the order has instead been cancelled
    onFinish?: CallbackID; //(order: SpawnOrder, cancelled: boolean)

    //SYSTEM FIELDS
    spawned?: number;
    orderNum?: number;
}

//Rooms.ts
type RoomActivityStatus =
      "Dormant" //A room that is untouched by the player
    | "Claimed" //A room that has been claimed by the player
    | "Active"; //A room that is fully active (part of the economy)