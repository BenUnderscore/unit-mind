
import _ from "lodash";
import { creepClasses, RegisteredCreepClass } from "./creepClasses"

export function initColony(roomName: string, colonyName: string = roomName)
{
    if(!Memory.rooms[roomName])
        Memory.rooms[roomName] = { version: 0 };

    if(!Memory.rooms[roomName].colony)
    {
        let colony: Colony = {
            room: roomName,
            creepRegistry: [],
            classInfo: {},
            spawns: [],
            name: colonyName
        };
        ensureFields(colony);
        Memory.rooms[roomName].colony = colony;

        if(!_.find(Memory.colonyRegistry, (x) => x == roomName))
        {
            Memory.colonyRegistry.push(roomName);
        }

        let spawns = Game.rooms[roomName].find(FIND_MY_SPAWNS);
        for(let spawn of spawns)
        {
            colony.spawns.push(spawn.id);
        }
    }
}

export function runColonies()
{
    for(let roomName of Memory.colonyRegistry)
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
    return colony.room;
}

export function findColonyByName(name: string) : Colony | undefined
{
    for(let colony of Memory.colonyRegistry)
    {
        if(Memory.rooms[colony] && Memory.rooms[colony].colony && getColonyName(Memory.rooms[colony].colony as Colony) == name)
        {
            return Memory.rooms[colony].colony;
        }
    }

    return undefined;
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

    let classes = creepClasses();

    classes.forEach((value: RegisteredCreepClass, creepClass: string) => {
        if(!colony.classInfo[creepClass])
            colony.classInfo[creepClass] = { currentAmount: 0, desiredAmount: 0 };
    });

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

        let dryRunResult = spawn.spawnCreep(creepClass.composition, className + " " + Memory.lastCreepNumber, {
            memory: memory,
            dryRun: true
        });

        if(dryRunResult !== 0)
        {
            console.log("Failed to spawn creep! spawnCreep error code (dry run): " + dryRunResult.toString());
            return false;
        }

        let result = spawn.spawnCreep(creepClass.composition, className + " " + Memory.lastCreepNumber, { memory: memory });
        
        if(result === 0)
        {
            colony.creepRegistry.push(className + " " + Memory.lastCreepNumber);
            Memory.lastCreepNumber += 1;
            colony.classInfo[className].currentAmount += 1;
            console.log(className + " " + Memory.lastCreepNumber + " born in colony " + getColonyName(colony));
            return true;
        }
        else
        {
            console.log("Failed to spawn creep! spawnCreep error code: " + result.toString());
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