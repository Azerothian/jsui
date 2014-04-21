
define ['jquery','../Control', 'bluebird','../lib/Promises', '../Util', 'log' ], ($, Control, Promise, Promises, Util, log) ->
	class Html extends Control
		constructor: (@jsui, @tagName = "div") ->
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

			@model.on "Style", @setStyles
			@model.on "Attributes", @setAttributes
			@model.on "TagName", @setTag

			@model.on "Text", (value) =>
				if @el?
					$(@el).text(value);
			@model.on "Html", (value) =>
				#log "Html - set - html", value;
				if @el?
					$(@el).html(value);
			


		show: () =>
			if $(@el).hasClass('hidden')
				$(@el).removeClass('hidden');
		hide: () =>
			if not $(@el).hasClass('hidden')
				$(@el).addClass('hidden');

		
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


			if @primary?
				@SetEvents(@primary);
			else
				@SetEvents(@);
			
			#targetControl = @model.get "MasterControl"

			#if targetControl?
			#	return @getParentByName(targetControl).then (@MasterControl) =>
			#		if @MasterControl?
			#			@SetEvents(@MasterControl);
			#		else 
			#			@SetEvents(@);

		SetEvents: (target) =>
			onFuncs = @model.get "On";
			if onFuncs?
				for func of onFuncs
					targetFunc = onFuncs[func]
					if target[targetFunc]?
						fuc = (context) =>
							target[targetFunc](context);
						$(@el).on func, () ->
							fuc(this);

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
				return $(@el).attr arguments[0]
			else if arguments.length == 2
				return $(@el).attr "#{arguments[0]}", "#{arguments[1]}"
		html: () =>
			if arguments.length == 1
				$(@el).html arguments[0]
			else 
				return $(@el).html();

		fireValidation: (validationGroup) =>
			return new Promise (resolve, reject) =>
				validators = @findValidators(validationGroup);
				return validators.chain().then () =>
					return resolve();
				, (results) =>
					result = [];
					for i in results
						for r in i
							result.push r;
					return reject(result);


		findValidators: (validationGroup, current = @) =>
			validators = new Promises()
			if current?
				for childName of current.children
					results = @findValidators validationGroup, current.children[childName]
					for i in results.promises
						validators.promises.push i;
				if current.OnValidation?
					validators.push current.OnValidation, current, [validationGroup]
			return validators;

		getAllControlsWithValidators: (validationGroup, current = @) =>
			validators = []
			if current?
				for childName of current.children
					results = @getAllControlsWithValidators validationGroup, current.children[childName]
					for i in results
						validators.push i;
				if current.OnValidation?
					validators.push current;
			return validators;
		OnDispose: () =>
			return new Promise (resolve, reject) =>
				$(@el).remove().promise().done resolve;
	return Html;