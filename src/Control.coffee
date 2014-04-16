

define ['./Model','./lib/Promises', './Util', 'bluebird'], (Model, Promises, Util, Promise) ->

	class Control
		
		constructor: () ->
			@model = new Model()
			@parent = null;
			@children = []
			@isRendered = false
			newGuid = Util.GenerateGuid();
			@model.set("Id", newGuid);

							

		addChild: (child) =>
			return new Promise (resolve, reject) =>
				if child.model.get("Id") == @model.get("Id")
					return reject("Cannot add same control to itself");
				child.model.set "ParentId", @model.get("Id");
				child.parent = @;
				#child.setModel("Name", name);
				@children[child.model.get("Id")] = child;
				#console.log "Control - addChild - finished adding", @children.length, @children
				if @isRendered
					#console.log "Control - addChild - render"
					return child.render().then(resolve, reject);
				else 
					return resolve();

		getParentByName: (name) =>
			return new Promise (resolve, reject) =>
				if @model?
					controlName = @model.get "Name"
					if controlName is name 
						return resolve(@);
				if @parent?
					if @parent.getParentByName?
						return @parent.getParentByName(name).then resolve, reject;
				return reject();

		removeChild: (id) =>
			return new Promise (resolve, reject) =>
				if not @children[id]?
					return reject("Child id not found in the children collection");
				delete @children[id];
				return resolve();
				
		render: () =>
			return new Promise (resolve, reject) =>
				promises = new Promises();
				if @["OnInit"]?
					promises.push @["OnInit"], @, ["OnInit"]
				if @["OnRender"]?
					promises.push @["OnRender"], @, ["OnRender"]
				promises.push @renderChildren, @, ["renderChildren"]
				promises.push @renderFinished, @, ["renderFinished"]

				#console.log("Control: Render", promises.length);

				return promises.chain().then(() =>
					#console.log("Control - Finished Rendering");
					return resolve();
				,reject)
				.caught () =>
					console.log(arguments);
		getLengthOfChildren: () =>
			return Util.getLengthOfObject(@children);

		renderChildren: () =>
			return new Promise (resolve, reject) =>
				childrenLength = @getLengthOfChildren();
			 # console.log("Control: renderChildren" ,childrenLength);
				promises = new Promises();
				for child of @children
					promises.push @children[child].render, @children[child]
				return promises.chain().then(resolve, reject);
				
		renderFinished: () =>
			return new Promise (resolve, reject) =>
				#console.log("Control: renderFinished");
				@isRendered = true;
				return resolve();
		
		dispose: () =>
			return new Promise (resolve, reject) =>
				promises = new Promises();
				for child in @children
					promises.push child.dispose, child
				if @["OnDispose"]?
					promises.push @["OnDispose"], @ #this will get executed after all children dispose actions
				return promises.chain().then () =>
					@isRendered = false;
					return resolve();
				, reject

	return Control;