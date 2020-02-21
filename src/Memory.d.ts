type ObjectID = string;

interface Memory
{
    //A list of all the rooms containing colonies
    colonyRegistry: string[];
    //Each creep is given its own number,
    //and this is the last issued one
    lastCreepIndex: number;
}

interface RoomMemory
{
    //The version number of the memory in this room, set to 1
    version: number;
    colony?: Colony;
}

interface Colony
{
    room: string;
    creepRegistry: ObjectID[];
    classInfo: Record<string, ClassInfo>;
    spawns: ObjectID[]; //All the owned spawns in this room
    name?: string;
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
    assignedTask: string | null;
    taskMemory: object; //Can be anything
}