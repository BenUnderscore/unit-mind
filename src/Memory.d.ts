

interface Memory
{
    //A list of all the rooms containing colonies
    colonyRegistry: Array<string>;
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

}