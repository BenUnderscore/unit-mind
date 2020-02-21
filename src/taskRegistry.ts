


//Stores all of the task functions in a registry so their IDs can be serialized
export type TaskID = string;
let taskRegistryMap: Map<TaskID, (creep: Creep) => boolean> = new Map<string, (creep: Creep) => boolean>();

export function taskRegistry() : Map<TaskID, (creep: Creep) => boolean>
{
    return taskRegistryMap;
}