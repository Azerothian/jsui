
define ['bluebird'], (Promise) ->
  class Promises
    constructor: (@promises = []) ->
      @length = @promises.length;

    all: () =>
      return new Promise (resolve, reject) =>
        arrs = []
        for i in @promises
          args = i.args || arguments
          arrs.push i.promise.apply(i.context, args);
        Promise.all(arrs).then () =>
          resolve();

    add: (promise, context, args) =>
      if not promise?
        throw "Promises - Error: promise being provided is not valid";
      @promises.push { promise: promise, context: context, args: args };
      @length = @promises.length;

    push: (promise, context, args) =>
      
      this.add promise, context, args;

    concat: () =>
      for i in arguments
        @promises.concat(i);

    getAll: () =>
      return @promises;

    clear: () =>
      @promises = [];
      @length = 0;

    chain: () =>
      return Promises.chainUtil(0, @promises, arguments);
    @chainUtil: (i, array, originalArgs, collect) ->
      return new Promise (resolve, reject) =>
        if not array?
          console.log "Promises - chainUtil - array is not defined";
          return;
        if not collect?
          collect = [];
        if array[i]?
          #console.log "Promises - chainUtil - function found", array[i];
          if array[i].args?
            args = array[i].args;
          else 
            args = originalArgs;
          return array[i].promise.apply(array[i].context, args).then () =>
            collect.push arguments
            return @chainUtil(i+1, array, originalArgs, collect).then(resolve, reject);
        else
          return resolve(collect);
  return Promises;