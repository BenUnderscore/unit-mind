//Util.ts: Contains useful functions that don't get their own file

import _ from "lodash";

//Removes non-existent creeps from the given list of creep names
export function gcCreepList(creepList: string[])
{
    creepList = _.filter(creepList, (name) => Game.creeps[name] ? true : false);
}