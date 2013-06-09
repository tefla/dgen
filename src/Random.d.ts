declare class Random {
    constructor(seed?:number);
    random():number;
    normal(mu:number, sigma:number):number;
    pareto(alpha:number):number;
}
