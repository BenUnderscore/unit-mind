//EnergySystem.ts: Handles energy harvesting and logistics
//
//Energy flows from sources to sinks
//The list of possible sources:
//1. In-game energy sources
//2. Storages/containers
//
//The list of possible sinks:
//1. Spawning
//2. Room controllers
//...More may be necessary later

import { PERIOD_LENGTH, registerPeriodChangeCallback } from "./Time";
import _ from "lodash";
import { gcCreepList } from "./Util";

//SOURCE LOGISTICS HELPER FUNCTIONS
function getEnergyPerRegen(source: Source) : number
{
    let room: Room = source.room;
    if(room.controller &&
        (room.controller.reservation != null
            || room.controller.owner != null))
    {
        return 3000;
    }

    return 1500;
}

function getEnergyPerTick(source: Source) : number
{
    return getEnergyPerRegen(source) / 300;
}

function getEnergyPerPeriod(source: Source) : number
{
    return getEnergyPerRegen(source) * 300 / PERIOD_LENGTH;
}

//Update harvest statistics every period
registerPeriodChangeCallback(() => {
    _.forEach(Memory.energySystem.ownedSources, (meta: SourceMeta) => {
        meta.harvestedPrevPeriod = meta.harvestedCurrentPeriod;
        meta.harvestedCurrentPeriod = 0;
    });
});

export function energyPreTick()
{
    gcCreepList(Memory.energySystem.creeps);
    assignCreeps();
}

export function energyTick()
{
    runCreeps();
}

export function energyPostTick()
{
    deassignCreeps();
}

function assignCreeps()
{
}

function runCreeps()
{   
}

function deassignCreeps()
{
}