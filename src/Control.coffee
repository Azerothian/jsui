
define ['./Model', 'bluebird'], (Model) ->
  class Control
    
    constructor: () ->
      @model = new Model()
      @parent = null;
      @children = []
      @isRendered = false
      
    addChild: (child) =>
      return new Promise (resolve, reject) =>
        if child.model.get("Id") == this.model.get("Id")
          return reject("Cannot add same control to itself");
        child.model.set "ParentId", this.model.get("Id");
        child.parent = @;
        #child.setModel("Name", name);
        this.children[child.model.get("Id")] = child;
        if this.isRendered
          return child.render().then(resolve, reject);
        else 
          return resolve();
    removeChild: (id) =>
      return new Promise (resolve, reject) =>
        if not children[id]?
          return reject("Child id not found in the children collection");
        
      
  return Control;