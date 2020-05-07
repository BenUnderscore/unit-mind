//Rooms.ts: All sorts of utilities related to rooms

import _ from "lodash";

export function roomsPreTick()
{
    if(!Memory.rooms)
        Memory.rooms = {};
    
    activeRoomsPreTick();
}

//ACTIVE ROOMS API
//This API allows for management of activity in different rooms.
//This is stored in RoomMemory, and is useful for knowing what rooms are active.
function activeRoomsPreTick()
{
    _.forEach(Game.rooms, (room: Room) =>
    {
        if(!Memory.rooms[room.name])
        {
            Memory.rooms[room.name] = {};
        }

        if(!room.memory.activityStatus)
        {
            room.memory.activityStatus = "Dormant";
            
        }
    });
}

export function getAllRoomsWithActivityStatus(status: RoomActivityStatus) : Room[]
{
    return _.filter(Game.rooms, (room: Room) => room.memory.activityStatus === status);
}

export function changeRoomActivityStatus(room: Room, status: RoomActivityStatus)
{
    room.memory.activityStatus = status;
    roomActivityStatusChanged(room);
}

let activityStatusChangeCallbacks: ((room: Room) => void)[];

export function registerRoomActivityStatusChangeCallback(f: (room: Room) => void)
{
    activityStatusChangeCallbacks.push(f);
}

function roomActivityStatusChanged(room: Room)
{
    _.forEach(activityStatusChangeCallbacks, (f: (room: Room) => void) => f(room));
}

//ROOM POSITION API
//This API allows for calculation of distances between rooms.
//It is currently unused.

export function getRoomPositionFromName(roomName: string) : { x: number, y: number }
{
    if(roomName === "sim")
    {
        return { x: 0, y: 0 };
    }

    //Room names have an encoding of [E/W]xx[N/S]xx, with an example of E4S22
    //The first character is always E or W:
    let east = roomName.charAt(0) === "E";

    //Parse the number after it
    let parsedX = "";
    for(let i = 1; i < roomName.length; i++)
    {
        let char = roomName.charCodeAt(i);
        if(char >= "0".charCodeAt(0) && char <= "9".charCodeAt(0))
        {
            parsedX += String.fromCharCode(char);
        }
        else
        {
            break;
        }
    }

    //Parse N/S
    let secondHalf = roomName.substr(parsedX.length + 1);
    let north = secondHalf.charAt(0) === "N";

    //Parse the number after N/S
    let parsedY = "";
    for(let i = 1; i < secondHalf.length; i++)
    {
        let char = secondHalf.charCodeAt(i);
        if(char >= "0".charCodeAt(0) && char <= "9".charCodeAt(0))
        {
            parsedY += String.fromCharCode(char);
        }
        else
        {
            break;
        }
    }

    //Return the parsed data
    let x = east ? parseInt(parsedX) + 1 : -parseInt(parsedX);
    let y = north ? parseInt(parsedY) + 1 : -parseInt(parsedY);
    return { x: x, y: y };
}

//Returns the manhattan distance between the two rooms
export function roomDistance(
    room1: Room | { x: number, y: number } | string,
    room2: Room | { x: number, y: number } | string) : number
{
    if(typeof room1 === "string" && typeof room2 === "string")
    {
        let r1 = getRoomPositionFromName(room1);
        let r2 = getRoomPositionFromName(room2);

        return Math.abs(r1.x - r2.x) + Math.abs(r1.y - r2.y);
    }
    else if(
        (room1 as { x: number, y: number }).x && (room1 as { x: number, y: number }).y &&
        (room2 as { x: number, y: number }).x && (room2 as { x: number, y: number }).y)
    {
        let r1 = room1 as { x: number, y: number };
        let r2 = room2 as { x: number, y: number };
        return Math.abs(r1.x - r2.x) + Math.abs(r1.y - r2.y);
    }
    else
    {
        let r1 = getRoomPositionFromName((room1 as Room).name);
        let r2 = getRoomPositionFromName((room2 as Room).name);
        return Math.abs(r1.x - r2.x) + Math.abs(r1.y - r2.y);
    }
}