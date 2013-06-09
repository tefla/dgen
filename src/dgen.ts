///<reference path="Random.d.ts" />

export var version = '0.2.0';


export module rngs {
    var defaultRandom = new Random();

    export class RNG {
        _rnd:Random;

        constructor(seed:number) {
            this._rnd = seed !== undefined ? new Random(seed) : defaultRandom;
        }

        next():number {
            throw new Error('Not Implemented');
        }
    }

    export class Preset extends RNG {
        _index:number;
        _values:number[];

        constructor(values:number[]) {
            super(undefined);
            this._index = 0;
            this._values = values;
        }
        next():number {
            var next = this._values[this._index % this._values.length];
            this._index++;
            return next;
        }
    }

    export class Uniform extends RNG {
        constructor(seed:number=undefined) {
            super(seed);
        }
        next():number {
            return this._rnd.random();
        }
    }
    export class Normal extends RNG {
        _mu:number;
        _sigma:number;

        constructor(mu:number, sigma:number) {
            super(undefined);
            this._mu = mu;
            this._sigma = sigma;
        }
        next():number {
            return this._rnd.normal(this._mu, this._sigma);
        }
    }
    export class Pareto extends RNG {
        _alpha:number;

        constructor(alpha:number) {
            super(undefined);
            this._alpha = alpha;
        }
        next():number {
            return this._rnd.pareto(this._alpha);
        }
    }
}


export module seqs {
    var defaultRNG = new rngs.Uniform();

    export class Sequence {
        _map:(n:any)=>any;

        constructor() {
            this._map = (n)=>n;
        }
        _next():number {
            throw new Error('Not Implemented');
        }
        next():number {
            return this._map(this._next());
        }
        array(len:number,
              norm:norms.Normalizer = new norms.Identity())
        {
            var data = new Array(len);
            for(var i = 0; i < len; i++) {
                data[i] = this.next();
            }
            return norm.normalize(data);
        }

        setMap(mapFunction:(n:number)=>number):Sequence {
            this._map = mapFunction;
            return this;
        }
        getMap():(n:number)=>number {
            return this._map;
        }
    }

    export class Constant extends Sequence {
        _constant: number;

        constructor(value:number = 0) {
            super();
            this._constant = value;
        }
        _next() {
            return this._constant;
        }

        setConstant(constant):Constant {
            this._constant = constant;
            return this;
        }
        getConstant():number {
            return this._constant;
        }
    }

    export class Cycle extends Sequence {
        _index: number;
        _pattern: number[];

        constructor(pattern:number[] = [0, 1]) {
            super();
            this._index = 0;
            this._pattern = pattern;
        }
        _next() {
            var index = this._index % this._pattern.length;
            var result = this._pattern[index];
            this._index++;
            return result;
        }

        setPattern(pattern:number[]):Cycle {
            this._pattern = pattern;
            return this;
        }
        getPattern():number[] {
            return this._pattern;
        }
    }

    export class Arithmetic extends Sequence {
        _start: number;
        _step: number;
        _cur: number;

        constructor(start:number = 0, step:number = 1) {
            super();
            this._start = start;
            this._step = step;
            this._cur = start;
        }
        _next() {
            var result = this._cur;
            this._cur += this._step;
            return result;
        }

        setStart(start:number):Arithmetic {
            this._start = start;
            this._cur = start;
            return this;
        }
        getStart():number {
            return this._start;
        }
        setStep(step:number):Arithmetic {
            this._step = step;
            return this;
        }
        getStep():number {
            return this._step;
        }
    }

    export class Geometric extends Sequence {
        _start: number;
        _ratio: number;
        _cur: number;

        constructor(start:number = 1, ratio:number = 2) {
            super();
            this._start = start;
            this._ratio = ratio;
            this._cur = start;
        }
        _next() {
            var result = this._cur;
            this._cur *= this._ratio;
            return result;
        }

        setStart(start:number):Geometric {
            this._start = start;
            this._cur = start;
            return this;
        }
        getStart():number {
            return this._start;
        }
        setRatio(ratio:number):Geometric {
            this._ratio = ratio;
            return this;
        }
        getRatio():number {
            return this._ratio;
        }
    }

    export class Random extends Sequence {
        _rng:rngs.RNG;
        _min:number;
        _max:number;

        constructor(rng:rngs.RNG = defaultRNG,
                    min:number = -Infinity,
                    max:number = +Infinity)
        {
            super();

            this._rng = rng;
            this._min = min;
            this._max = max;
        }
        _next() {
            var result = this._rng.next();
            if(result < this._min) {
                result = this._min;
            }
            if(result > this._max) {
                result = this._max;
            }
            return result;
        }

        setRng(rng:rngs.RNG):Random {
            this._rng = rng;
            return this;
        }
        getRng():rngs.RNG {
            return this._rng;
        }
        setMin(min:number):Random {
            this._min = min;
            return this;
        }
        getMin():number {
            return this._min;
        }
        setMax(max:number):Random {
            this._max = max;
            return this;
        }
        getMax():number {
            return this._max;
        }
    }

    export class RandomWalk extends Sequence {
        _rng:rngs.RNG;
        _start:number;
        _cur:number;
        _min:number;
        _max:number;

        constructor(rng:rngs.RNG = defaultRNG,
                    start:number = 0.5,
                    min:number = 0,
                    max:number = 1)
        {
            super();

            this._rng = rng;
            this._start = start;
            this._cur = start;
            this._min = min;
            this._max = max;
        }

        _next() {
            var result = this._cur;
            var direction = defaultRNG.next() > 0.5 ? -1 : +1;
            this._cur += this._rng.next() * direction;

            if(this._cur > this._max) {
                this._cur = this._max;
            }
            if(this._cur < this._min) {
                this._cur = this._min;
            }
            return result;
        }

        setRng(rng:rngs.RNG):RandomWalk {
            this._rng = rng;
            return this;
        }
        getRng():rngs.RNG {
            return this._rng;
        }
        setStart(start:number):RandomWalk {
            this._start = start;
            this._cur = start;
            return this;
        }
        getStart():number {
            return this._start;
        }
        setMin(min:number):RandomWalk {
            this._min = min;
            return this;
        }
        getMin():number {
            return this._min;
        }
        setMax(max:number):RandomWalk {
            this._max = max;
            return this;
        }
        getMax():number {
            return this._max;
        }
    }

    export class Combine extends Sequence {
        _seqs:any[];

        constructor(seqs:any[] = []) {
            super();

            this._seqs = [];
            for(var i = 0; i < seqs.length; i++) {
                var seq = seqs[i];
                this._seqs[i] = _isArray(seq) ? new Cycle(seq) : seq;
            }
        }

        _next() {
            var result = 0;
            for(var i = 0; i < this._seqs.length; i++) {
                var seq = this._seqs[i];
                result += seq.next();
            }
            return result;
        }

        add(seq):Combine {
            this._seqs.push(_isArray(seq) ? new Cycle(seq) : seq);
            return this;
        }
    }

    export class Repeat extends Sequence {
        _seq:Sequence;
        _count:number;
        _curValue:number;
        _curCount:number;

        constructor(seq:Sequence, count:number=2) {
            super();

            this._seq = seq;
            this._count = count;
            this._curValue = 0;
            this._curCount = +Infinity;
        }

        _next() {
            if(this._curCount >= this._count) {
                this._curValue = this._seq.next();
                this._curCount = 0;
            }
            this._curCount++;
            return this._curValue;
        }

        setCount(count:number):Repeat {
            this._count = count;
            return this;
        }
        getCount():number {
            return this._count;
        }
    }

    function _isArray(value):bool {
        return Object.prototype.toString.call(value) === '[object Array]';
    }
}

export module norms {
    export class Normalizer {
        //noinspection JSUnusedLocalSymbols
        normalize(data:number[]):number[] {
            throw new Error('Not Implemented');
        }
    }
    export class Identity extends Normalizer {
        normalize(data:number[]):number[] {
            return data;
        }
    }
    export class Minmax extends Normalizer {
        _min:number;
        _max:number;

        constructor(min:number = 0, max:number = 1) {
            super();
            this._min = min;
            this._max = max;
        }
        normalize(data:number[]):number[] {
            // first pass to scan low/high
            var smin = +Infinity;
            var smax = -Infinity;
            data.forEach((d) => {
                if(d < smin) {
                    smin = d;
                }
                if(d > smax) {
                    smax = d;
                }
            });
            var srange = smax - smin;
            var trange = this._max - this._min;
            var ratio = trange / srange;

            // second pass to normalize
            return data.map((d) => (d - smin) * ratio + this._min);
        }
    }
    export class Sum extends Normalizer {
        _sum:number;

        constructor(sum:number = 1) {
            super();
            this._sum = sum;
        }
        normalize(data:number[]):number[] {
            // first pass to scan sum
            var ssum = 0;
            data.forEach((d) => ssum += d);
            var ratio = ssum === 0 ? 0 : this._sum / ssum;

            // second pass to normalize
            return data.map((d) => d * ratio);
        }
    }
}
