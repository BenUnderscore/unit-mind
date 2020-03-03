

export function getClassSpawnCost(composition: Array<BodyPartConstant>) : number
{
    let sum = 0;

    for(let part of composition)
    {
        switch(part)
        {
        case MOVE:
            sum += 50;
            break;
        case WORK:
            sum += 100;
            break;
        case CARRY:
            sum += 50;
            break;
        case ATTACK:
            sum += 80;
            break;
        case RANGED_ATTACK:
            sum += 150;
            break;
        case HEAL:
            sum += 250;
            break;
        case CLAIM:
            sum += 600;
            break;
        case TOUGH:
            sum += 10;
            break;
        }
    }

    return sum;
}

export interface RegisteredCreepClass
{
    composition: BodyPartConstant[];
    defaultRole: string;
}

export function creepClasses() : Map<string, RegisteredCreepClass>
{
    //A registry of all the creep classes programmed into the AI
    //These are templates for spawning creeps
    let creepClassRegistry : Map<string, RegisteredCreepClass> = new Map<string, RegisteredCreepClass>();

    //The starter worker - bootstraps a colony with only 1 spawn
    //and nothing else
    creepClassRegistry.set("StarterWorker", {
        composition: [MOVE, MOVE, WORK, CARRY],
        defaultRole: "Logistics"
    });
    
    return creepClassRegistry;
}