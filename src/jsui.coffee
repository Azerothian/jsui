jsui_context = null;
define ['jquery','underscore', 'bluebird', './Control', './lib/Promises', './Util', './controls/template', 'log'], ($,_, Promise, Control,  Promises, Util, Template, log) ->
	if jsui_context?
		return jsui_context;

	class jsui
		constructor: () ->
			@primaryControls = {};
			@roots = []
			@ioc = {}
			#@createRootFromSelector('body').then (@root) =>

		initMainRoot: (selector = 'body') =>
			return new Promise (resolve, reject) =>
				return @createRootFromSelector(selector).then (@root) =>
					return resolve();

		setControlBaseObject: (@ioc = {}) =>
			return new Promise (resolve, reject) =>
				return resolve();


		getPrimaryControl: (name) =>
			return @primaryControls[name];

		createRootFromSelector: (target) =>
			return new Promise (resolve, reject) =>
				#console.log("[jsui] Init root object", target);
				root = new Control;
				root.el = $(target)[0];
				root.isRendered = true;
				$(target).attr('id', root.model.get("Id"));
				@roots.push root;
				return resolve(root);
		loadControlsFromJson: (path, parent = null, primary = null) =>
			return new Promise (resolve, reject) =>
				requirejs ["text!#{path}.json"], (json) =>
					return @loadControlsFromString(json, parent, primary).then resolve, reject;

		loadControlsFromString: (text, parent = null, primary = null) =>
			return new Promise (resolve, reject) =>
				obj = Util.jsonToObject(text);
				return  @loadControlsFromObject(obj, parent, primary).then (control) =>
					return resolve(control);
		loadControlsFromObject: (obj, parent = null, primary = null) =>
			return new Promise (resolve, reject) =>
				return @__loadControlsFromObject(obj, parent, primary).then (control) =>
					return control.OnLoadFinished().then () =>
						return resolve(control);

		__loadControlsFromObject: (obj, parent = null, primary = null) =>
			return new Promise (resolve, reject) =>
				#console.log "Loading control", obj;
				if Util.isArray(obj)
					if not primary? or not parent?
						return reject("loadControlsFromObject - Error: primary control not set when using array as base");
					return @__loadChildren(parent, obj, primary).then () =>
						 return resolve(primary); # returns the main control for reference

				controlType = obj.Control || "jsui/controls/html";

				if obj.IsPrimary
					primary = null;

				if obj.Source?
					return @loadControlsFromJson(obj.Source, parent, primary).then resolve, reject

				return requirejs [controlType], (control) =>
				 
					args = obj.Parameters || [];
					#console.log "Processing control constructor", { obj: obj, args: args };
					newControl = control.bind.apply control, args;
					c = new newControl();

					
					_.extend c, @ioc

					for prop of obj
						# if prop isnt "Children"
						c.model.set(prop, obj[prop]); 
					if not primary?
						#console.log 'PRIMARY IS NOT SET'
						primary = c;

					c.primary = primary;

					primaryName = primary.model.get("Name");

					if primaryName?
						if not @primaryControls[primaryName]?
							@primaryControls[primaryName] = primary;


					Name = c.model.get("Name");
					if Name? #not sure but will see
						#console.log "SETTING RAWRS", primary,  c, Name
						primary[Name] = c;
					if parent?
						return parent.addChild(c).then () =>
							return @__childCheck(obj, c, primary).then () =>
								return resolve(c);
							, reject
						, reject
					else
						return @__childCheck(obj, c, primary).then () =>
							return resolve(c);
						, reject
		__loadChildren: (parent, children, primary) =>
			return new Promise (resolve, reject) =>
				promises = new Promises();        
				for child in children
					promises.push @__loadControlsFromObject, @, [child, parent, primary]
				return promises.chain().then (results) =>
					return resolve();
		__childCheck: (obj, control, primary) =>
			return new Promise (resolve, reject) =>
				if obj.Children?
					return @__loadChildren(control, obj.Children, primary).then () =>
						return resolve();
					, reject
				return resolve();

		processScriptTags: () =>
			return new Promise (resolve, reject) =>
				promises = new Promises();
				context = @;
				$("[type='jsui/json5']")
					.each () ->
						promises.push context.createScriptTag, context, [this];
					.promise().done () =>
						return promises.chain().then resolve, reject;

		getScriptTagContents: (scriptTag) =>
			return new Promise (resolve, reject) =>
				jsonsrc = $(scriptTag).attr("json-src")
				if jsonsrc?
					return requirejs ["text!#{jsonsrc}.json"], resolve
				else
					return resolve($(scriptTag).html())

		createScriptTag: (scriptTag) =>
			return new Promise (resolve, reject) =>
				return @getScriptTagContents(scriptTag).then (json) =>
					newElement = $('<div></div>');
					newContent = $(scriptTag).replaceWith(newElement);
					#log "ui", @;
					return @createRootFromSelector(newElement).then (root) =>
						return @loadControlsFromString(json, root).then resolve, reject;		




	jsui_context = new jsui;
	return jsui_context;