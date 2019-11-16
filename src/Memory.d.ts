
import { Colony } from "./Colony";

interface Memory
{
    rooms: Record<string, RoomMemory>
    creeps: Record<string, CreepMemory>
}

//Room memory
interface RoomMemory
{
    version: number, //Version is always 1
    colony?: Colony, //The colony in this room, if any
}