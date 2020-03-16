
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
    //The version number of the memory in this room, set to 1
    version: number;
    colony?: Colony;
}

interface Colony
{
    //Fixed stuff
    room: string;
    creepRegistry: string[]; //Names, not IDs
    classInfo: Record<string, ClassInfo>;
    spawns: string[]; //All the owned spawns in this room

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
}