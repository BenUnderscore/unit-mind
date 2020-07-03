//Time.ts: Manages time
//Logistics involves calculating the throughput of connections.
//Throughput has to be measured with a specific unit of time.
//A tick is not a suitable unit, as one delivery takes many many ticks.
//The unit of time defined for these calculations is called a "period".
export const PERIOD_LENGTH: number = 128;

//This way, if a creep delivers 10 energy over 128 ticks, it will have a throughput of 10.
//This is incredibly useful, as it means we can work with "streams" of energy.
//This way we can figure out the amount of energy that a source produces for example,
//and direct those resources to what's most important.
// More on this in EnergySystem.ts

export function timeTick()
{
    Memory.time.ticksElapsed++;

    if(isPeriodNew())
    {
        periodChange();
    }
}

let periodChangeCallbacks: (() => void)[] = [];

export function registerPeriodChangeCallback(f: () => void)
{
    periodChangeCallbacks.push(f);
}

export function isPeriodNew() : boolean
{
    return Memory.time.ticksElapsed % PERIOD_LENGTH === 0;
}

function periodChange()
{
    Memory.time.currentPeriod++;
    periodChangeCallbacks.forEach((f) => f());
}