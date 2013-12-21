
define ['jquery','../Control', 'bluebird', '../Util' ], ($, Control, Promise, Util) ->
  class Html extends Control
    constructor: (@tagName = "div") ->
      super #always call this when overriding the constructor, while extending a object;
      @el = $("<#{@tagName}></#{@tagName}>");
      
      @attr("id", @model.get("Id"));
      @model.on "Id", (value) =>
        @attr("id", value);
        @id = value;
      @model.on "Class", (value) =>
        #console.log("CLASSS", value, @model);
        @attr("class", value); 
      @model.on "Name", (value) =>
        @attr("name", value); 
        @Name = value;

      @model.on "Style", @setStyles
      @model.on "Attributes", @setAttributes
      @model.on "TagName", @setTag

      @model.on "Text", (value) =>
        if @el?
          $(@el).text(value);
      @model.on "Html", (value) =>
        if @el?
          $(@el).html(value);
      

    
    setStyles: (styles) =>
      if styles?
        for s of styles
          @css s, styles[s]

    setAttributes: (attribs) =>
      if attribs?
        for a of attribs
          @attr a, attribs[a]
    setTag: (@tagName) =>
      @el = $("<#{@tagName}></#{@tagName}>");
      @RefreshProperties();
    
    RefreshProperties: () =>
      html = @model.get('Html')
      if html?
        $(@el).html(html);

      text = @model.get('Text')
      if text?
        $(@el).text(text);

      name = @model.get('Name')
      if name?
        @attr "name", name;
      
      id = @model.get('Id')
      if id?
        @attr 'id', id;

      cc = @model.get('Class')
      if cc?
        @attr 'class', cc;

    OnRender: () =>
      return new Promise (resolve, reject) =>
        #console.log("Html - OnRender - start");
        if @parent?
          $(@parent.el).append(@el);
          @RefreshProperties();
          #console.log("Html - OnRender - resolve");
          return resolve();
        #console.log("Html - OnRender - reject");
        return reject();
     

    css: () =>
      if arguments.length == 1
        $(@el).css arguments[0]
      else if arguments.length == 2
        $(@el).css arguments[0], arguments[1]
    attr: () =>
      if arguments.length == 1
        $(@el).attr arguments[0]
      else if arguments.length == 2
        $(@el).attr "#{arguments[0]}", "#{arguments[1]}"
       #console.log "setting attrib", @el, "#{arguments[0]}", "#{arguments[1]}"
  return Html;