
define [], () ->
  class Model
    constructor: () ->
      
    get: (name) =>
      if @[name]?
        return @[name];
      return null;
    set: (name, value) =>
      @[name] = value;

  return Model;