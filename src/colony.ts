
import _ from "lodash";
import { creepClasses, RegisteredCreepClass } from "./creepClasses"

export function initColony(roomName: string, colonyName: string = roomName)
{
    if(!Memory.rooms[roomName])
        Memory.rooms[roomName] = { version: 0 };

    if(!Memory.rooms[roomName].colony)
    {
        let colony = {
            room: roomName,
            creepRegistry: [],
            classInfo: {},
            spawns: [],
            colonyName: colonyName
        };
        ensureFields(colony);
        Memory.rooms[roomName].colony = colony;

        if(!_.find(Memory.colonyRegistry, (x) => x == roomName))
        {
            Memory.colonyRegistry.push(roomName);
        }
    }
}

export function runColonies()
{
    for(let roomName in Memory.colonyRegistry)
    {
        let colony = Memory.rooms[roomName].colony;
        if(typeof colony !== "undefined")
            runColony(colony);
    }
}

export function getColonyRoom(colony: Colony) : Room
{
    return Game.rooms[colony.room];
}

export function getColonyName(colony: Colony) : string
{
    if(colony.name)
    {
        return colony.name;
    }
    return colony.room.toString();
}

function runColony(colony: Colony)
{
    ensureFields(colony);
    countColonyPopulation(colony);
    handleColonySpawning(colony);
}

//Ensures that all the fields of the colony exist
function ensureFields(colony: Colony)
{
    if(!colony.creepRegistry)
    {
        colony.creepRegistry = new Array<string>();
    }

    if(!colony.classInfo)
    {
        colony.classInfo = {};
    }

    for(let creepClass in creepClasses())
    {
        colony.classInfo[creepClass] = { currentAmount: 0, desiredAmount: 0 };
    }

    if(!colony.spawns)
    {
        colony.spawns = _.map(
            Game.rooms[colony.room].find(FIND_MY_SPAWNS),
            (v) => v.id
        );
    }
}

function handleColonySpawning(colony: Colony)
{
    for(let className in colony.classInfo)
    {
        let info = colony.classInfo[className];

        if(info.currentAmount < info.desiredAmount)
        {
            spawnCreep(colony, className);
        }
    }
}

//Returns false if the creep can not be spawned
function spawnCreep(colony: Colony, className: string) : boolean
{
    let creepClass = creepClasses().get(className) as RegisteredCreepClass;

    let memory: CreepMemory = { class: className, colonyRoom: colony.room, assignedTask: null, taskMemory: {} };

    //Find an appropriate spawn
    for(let spawnID of colony.spawns)
    {
        let spawn = Game.getObjectById(spawnID) as StructureSpawn;
        
        if(spawn.canCreateCreep(creepClass.composition))
        {
            let result = spawn.createCreep(creepClass.composition, undefined, memory);
            if(typeof(result) === "string")
            {
                colony.creepRegistry.push(result);
                console.log(result + " born in colony " + getColonyName(colony));
            }
            else
            {
                console.log("Failed to spawn creep! createCreep error code: " + result.toString());
            }
        }
    }

    return false;
}

//Updates the creep registry and class info
function countColonyPopulation(colony: Colony)
{
    //Unregister any dead creeps
    _.filter(
        colony.creepRegistry,
        (name: string) => Game.creeps[name] !== undefined
    );

    //Count all the classes
    for(let className in colony.classInfo)
    {
        colony.classInfo[className].currentAmount = 0;
    }

    for(let creepName of colony.creepRegistry)
    {
        colony.classInfo[Memory.creeps[creepName].class].currentAmount++;
    }
}