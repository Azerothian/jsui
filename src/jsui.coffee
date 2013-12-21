
define ['jquery','bluebird', './Control', './lib/Promises', './Util', './controls/template'], ($, Promise, Control,  Promises, util, Template) ->
  class jsui
    constructor: () ->
     
    initialise: (target) =>
      return new Promise (resolve, reject) =>
        #console.log("[jsui] Init root object", target);
        @root = new Control;
        @root.el = $(target)[0];
        @root.isRendered = true;
        $(target).attr('id', this.root.model.get("Id"));
        return resolve();
    @loadControlsFromString: (text, parent) =>
      return new Promise (resolve, reject) =>
        obj = util.jsonToObject(text);
        return  Template.loadControlsFromObject(obj, parent).then (control) =>
          return resolve(control);
  return jsui;