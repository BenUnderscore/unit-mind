//Due to the limitations of Screeps' memory persistence, we need a way to serialize callbacks
//By using a callback registry with string keys, strings can be passed instead of function objects
//so that it can be written to memory.

let callbacks: Map<CallbackID, Function> = new Map<CallbackID, Function>();

export function registerCallback(func: Function, id: CallbackID)
{
    callbacks.set(id, func);
}

export function call(id: CallbackID, ...params: any[])
{
    let func = callbacks.get(id);
    if(func)
        func(params);
    else
        console.error("No callback named \"" + id + "\" found!");
}

//Potentially useful for debugging
export function listCallbacks()
{
    callbacks.forEach((f, id) => console.log(id));
}