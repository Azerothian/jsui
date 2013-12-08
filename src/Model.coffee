
define ['eventEmitter'], (EventEmitter) ->
  class Model extends EventEmitter
    constructor: () ->
      
    get: (name) =>
      if @[name]?
        return @[name];
      return null;
    set: (name, value) =>
      if @[name] isnt value
        @emitEvent name, [value];
      @[name] = value;
    on: (name, func) =>
      @addListener name, func;

  return Model;