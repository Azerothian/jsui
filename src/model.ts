
///<reference path='../typings/eventemitter.d.ts' />

import EventEmitter = require("eventemitter");
class Model extends EventEmitter {
    constructor() {
        super();
    }
    get = (name) => {
        if (this[name]) {
            return this[name];
        }
        return null;
    }
    set = (name, value) => {
        if (this[name] !== value) {
            this.emitEvent(name, [value]);
        }
        this[name] = value;
    }
}
export = Model;

