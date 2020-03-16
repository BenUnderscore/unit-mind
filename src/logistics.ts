import _ from "lodash";

export interface LogisticsNode
{
    resourceType: string; //One of the resource constants
    supply: number; //How many units are available
    demand: number; //How many units  are demanded

    //Lower priority = other nodes are supplied/demanded first
    //You might draw from storage before the sources, etc.
    supplyPriority: number;
    demandPriority: number;

    customData: any;
}

//A logistics operation defines a delivery of resources
//The point is to 
export interface LogisticsOperation
{
    amount: number; //The amount of a given resource
    //When source and destination exist
    //They reserve the appropriate amount of resources
    src?: string; //Source node key
    dest?: string; //Destination node key
}

export class LogisticsSystem
{
    nodes: Record<string, LogisticsNode>;
    operations: Record<number, LogisticsOperation>;
    nextKey: number;

    constructor(mem?: any)
    {
        if(mem)
        {
            this.nodes = mem.nodes;
            this.operations = mem.operations;
            this.nextKey = mem.nextKey;
        }
        else
        {
            this.nodes = {};
            this.operations = {};
            this.nextKey = Number.MIN_SAFE_INTEGER;
        }
    }

    //Returns the demand of the given node - what is going to be delivered
    getDeliveredDemand(node: string) : number
    {
        let demand = this.nodes[node].demand;
        _.forOwn(this.operations, (op) => {
            if(op.dest == node)
            {
                demand -= op.amount;
            }
        });

        return demand;
    }

    //Returns the supply of the given node - what is going to be taken
    getUnreservedSupply(node: string) : number
    {
        let supply = this.nodes[node].supply;
        _.forOwn(this.operations, (op) => {
            if(op.src == node)
            {
                supply -= op.amount;
            }
        });

        return supply;
    }

    //Returns the net demand for the given resource
    getNetDemand(resource: string) : number
    {
        let sum = 0;
        _.forOwn(this.nodes, (node, key) => {
            if(node.resourceType == resource)
            {
                sum += this.getDeliveredDemand(key);
            }
        });

        return sum;
    }

    //Returns the key to the highest priority source with the highest supply
    //Returns null if there are no sources with positive supply
    //Threshold value is the minimum amount, so tiny supply is ignored
    getHighestSource(resource: string, threshold: number = 1) : string | null
    {
        //Get the highest priority
        let priority: number | null = null;
        _.forOwn(this.nodes, (node, key) => {
            if(this.getUnreservedSupply(key) < threshold)
                return;

            if(!priority)
                priority = node.supplyPriority;
            else
                priority = node.supplyPriority > priority ? node.supplyPriority : priority;
        });

        if(!priority)
            return null;
        
        let supplies: [string, number][] = _.map(
            _.filter(_.keys(this.nodes), (key) => this.nodes[key].supplyPriority == priority),
            (key) => [key, this.getUnreservedSupply(key)]
        );
        
        let highestSupply = 0;
        let highestSupplyNode: string | null = null;
        for(let tuple of supplies)
        {
            if(tuple[1] > highestSupply)
            {
                highestSupply = tuple[1];
                highestSupplyNode = tuple[0];
            }
        }

        if(highestSupply > 0)
        {
            return highestSupplyNode;
        }

        return null;
    }

    //Same with getHighestSource, but with demand instead
    getHighestDestination(resource: string, threshold: number = 1) : string | null
    {
        //Get the highest priority
        let priority: number | null = null;
        _.forOwn(this.nodes, (node, key) => {
            if(this.getDeliveredDemand(key) < threshold)
                return;

            if(!priority)
                priority = node.demandPriority;
            else
                priority = node.demandPriority > priority ? node.demandPriority : priority;
        });

        if(!priority)
            return null;
        
        let demands: [string, number][] = _.map(
            _.filter(_.keys(this.nodes), (key) => this.nodes[key].demandPriority == priority),
            (key) => [key, this.getDeliveredDemand(key)]
        );
        
        let highestDemand = 0;
        let highestDemandNode: string | null = null;
        for(let tuple of demands)
        {
            if(tuple[1] > highestDemand)
            {
                highestDemand = tuple[1];
                highestDemandNode = tuple[0];
            }
        }

        if(highestDemand > 0)
        {
            return highestDemandNode;
        }

        return null;
    }

    //Returns a key to the logistics operation - this will never get reused
    addOperation(op: LogisticsOperation) : number | null
    {
        //Verify operation resource types
        if(op.src && op.dest)
        {
            if(this.nodes[op.src].resourceType !== this.nodes[op.dest].resourceType)
            {
                return null;
            }
        }

        let key = this.nextKey;
        this.operations[key] = op;
        this.nextKey++;

        return key;
    }

    finishOperation(key: number)
    {
        delete this.operations[key];
    }
}

/*
//Basically a unit test
export function testLogistics() : string
{
    console.log("Testing LogisticsSystem...");
    let ls = new LogisticsSystem();

    ls.nodes["Storage"] = {
        resourceType: RESOURCE_ENERGY,
        supply: 10,
        demand: 90,
        supplyPriority: 100,
        demandPriority: -100,
        customData: undefined
    };

    ls.nodes["Spawn"] = {
        resourceType: RESOURCE_ENERGY,
        supply: 0,
        demand: 300,
        supplyPriority: 0,
        demandPriority: 100,
        customData: undefined
    };

    ls.nodes["Source"] = {
        resourceType: RESOURCE_ENERGY,
        supply: 4000,
        demand: 0,
        supplyPriority: 50,
        demandPriority: 0,
        customData: undefined
    };

    ls.addOperation({
        amount: 150,
        src: ls.getHighestSource(RESOURCE_ENERGY, 150) as string,
        dest: ls.getHighestDestination(RESOURCE_ENERGY, 150) as string
    });

    console.log("Total energy demand: " + ls.getNetDemand(RESOURCE_ENERGY));
    console.log("Highest source: " + ls.getHighestSource(RESOURCE_ENERGY));
    console.log("Highest destination: " + ls.getHighestDestination(RESOURCE_ENERGY));
    console.log("Energy left in source: " + ls.getUnreservedSupply("Source"));

    return JSON.stringify(ls, null, 4);
}*/