///<reference path='../../typings/bluebird.d.ts' />

import Promise = require('bluebird');

    interface PromisesEntry
    {
        promise: Promise;
        context: any;
        args: any[];
    }

class PromisesArray {

    promises:any[];
    length = 0;
    constructor(promisesArr?: any[]) {
        if(!promisesArr)
        {
            this.promises = [];
        } else {
            this.promises = promisesArr;
        }
        this.length = this.promises.length;
    }

    all = () => {
        return new Promise((resolve, reject) => {
            var args, arrs, i, _i, _len, _ref;
            arrs = [];
            _ref = this.promises;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                i = _ref[_i];
                args = i.args || arguments;
                arrs.push(i.promise.apply(i.context, args));
            }
            return Promise.all(arrs).then(function () {
                return resolve();
            });
        });
    }
    add = (promise, context, args) => {
        if (!(promise != null)) {
            throw "Promises - Error: promise being provided is not valid";
        }
        this.promises.push({
            promise: promise,
            context: context,
            args: args
        });
        return this.length = this.promises.length;
    }
    push = (promise, context?, args?) => {
        return this.add(promise, context, args);
    }
    concat = () => {
        var i, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = arguments.length; _i < _len; _i++) {
            i = arguments[_i];
            _results.push(this.promises.concat(i));
        }
        return _results;
    }
    getAll = () => {
        return this.promises;
    }
    clear = () => {
        this.promises = [];
        return this.length = 0;
    }
    chain = function () {
        return chainUtil(0, this.promises, arguments);
    }
    

};
function chainUtil(i: number, array: any[], originalArgs: any, collect?) {
    return new Promise((resolve, reject) => {
        var args;
        if (!array) {
            console.log("Promises - chainUtil - array is not defined");
            return;
        }
        if (!collect) {
            collect = [];
        }
        if (array[i]) {
            if (array[i].args) {
                args = array[i].args;
            } else {
                args = originalArgs;
            }
            return array[i].promise.apply(array[i].context, args).then(function () {
                collect.push(arguments);
                return chainUtil(i + 1, array, originalArgs, collect).then(resolve, reject);
            });
        } else {
            return resolve(collect);
        }
    });
}

 export = PromisesArray