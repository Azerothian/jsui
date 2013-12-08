
define ['jquery','./html', 'bluebird', '../util','../lib/promises' ], ($, Html, Promise, Util, Promises) ->
  class Template extends Html
    constructor: () ->
      super #always call this when overriding the constructor, while extending a object;

    OnInit: () =>
      return new Promise (resolve, reject) =>
        if @elements?
          return Template.loadControlsFromObject(@elements, @, @).then () =>
            return resolve();
        else
          return resolve();
    @loadControlsFromObject: (obj, parent = null, primary = null) =>
      return new Promise (resolve, reject) =>
        console.log "Loading control", obj;
        if Util.isArray(obj)
          if not primary? or not parent?
            return reject("loadControlsFromObject - Error: primary control not set when using array as base");
          return Template.loadChildren(parent, obj, primary).then () =>
             return resolve(primary); # returns the main control for reference

        controlType = obj.Control || "jsui/controls/html";
        return requirejs [controlType], (control) =>
         
          args = obj.Parameters || [];
          console.log "Processing control constructor", { obj: obj, args: args };
          newControl = control.bind.apply control, args;
          c = new newControl();
          for prop of obj
            if prop isnt "Children"
              c.model.set(prop, obj[prop]); 
          if not primary?
            primary = c;
          Name = c.model.get("Name");
          if Name? #not sure but will see
            console.log "SETTING RAWRS", primary,  c, Name
            primary[Name] = c;
          if parent?
            return parent.addChild(c).then () =>
              return Template.childCheck(obj, c, primary).then () =>
                return resolve(c);
              , reject
            , reject
          else
            return Template.childCheck(obj, c, primary).then () =>
              return resolve(c);
            , reject
              
          
    @childCheck: (obj, control, primary) =>
      return new Promise (resolve, reject) =>
        if obj.Children?
          return Template.loadChildren(control, obj.Children, primary).then () =>
            return resolve();
          , reject
        else
          return resolve();

    @loadChildren: (parent, children, primary) =>
      return new Promise (resolve, reject) =>
        promises = new Promises();        
        for child in children
          promises.push Template.loadControlsFromObject, @, [child, parent, primary]
        return promises.chain().then (results) =>
          return resolve();
          #promises_ac = new Promises();
          #for r in results
          #  promises_ac.push parent.addChild, parent, [r[0]];
          #return promises_ac.chain().then () => 
          #  return resolve();
  return Template;