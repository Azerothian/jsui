jsui_context = null;
define ['jquery','underscore', 'bluebird', './Control', './lib/Promises', './Util', './controls/template'], ($,_, Promise, Control,  Promises, Util, Template) ->
	if jsui_context?
		return jsui_context;

	class jsui
		constructor: () ->
			@primaryControls = {};
			@roots = []
			@ioc = {}

		setControlBaseObject: (@ioc = {}) =>


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

		loadControlsFromString: (text, parent) =>
			return new Promise (resolve, reject) =>
				obj = Util.jsonToObject(text);
				return  @loadControlsFromObject(obj, parent).then (control) =>
					return resolve(control);

		loadControlsFromObject: (obj, parent = null, primary = null) =>
			return new Promise (resolve, reject) =>
				#console.log "Loading control", obj;
				if Util.isArray(obj)
					if not primary? or not parent?
						return reject("loadControlsFromObject - Error: primary control not set when using array as base");
					return @loadChildren(parent, obj, primary).then () =>
						 return resolve(primary); # returns the main control for reference

				controlType = obj.Control || "jsui/controls/html";
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
							return @childCheck(obj, c, primary).then () =>
								return resolve(c);
							, reject
						, reject
					else
						return @childCheck(obj, c, primary).then () =>
							return resolve(c);
						, reject
							
					
		childCheck: (obj, control, primary) =>
			return new Promise (resolve, reject) =>
				if obj.Children?
					return @loadChildren(control, obj.Children, primary).then () =>
						return resolve();
					, reject
				return resolve();

		loadChildren: (parent, children, primary) =>
			return new Promise (resolve, reject) =>
				promises = new Promises();        
				for child in children
					promises.push @loadControlsFromObject, @, [child, parent, primary]
				return promises.chain().then (results) =>
					return resolve();
	jsui_context = new jsui;
	return jsui_context;