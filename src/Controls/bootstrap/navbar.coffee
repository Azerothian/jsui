
define ['jsui', 'jquery', 'bluebird','../../lib/Promises', '../template', '../../util', 'log'], (jsui, $, Promise, Promises, Template, util, log) ->
	return class navbar extends Template
		constructor: () ->
			super;
			@model.on "Title", (value) =>
				if value? and @lblTitle?
					@lblTitle.model.set 'Html', value;
			@model.on "Items", @SetData
		SetData: (value = @model.get "Items") =>
			if value? and @ddlItems?
				@ddlItems.clearChildren().then () =>
						return jsui.loadControlsFromObject(value, @ddlItems, @primary).then () =>


		OnInit: () =>
			return new Promise (resolve, reject) =>
				@elements = [{ 
					Class: "navbar navbar-default"
					Attributes: { role: "navigation" }
					Children: [{ 
						Class: "container-fluid" 
						Children: [{
							Class: "navbar-header"
							Children: [{
								TagName: "button",
								Class: "navbar-toggle",
								Control: "jsui/Controls/button",
								Attributes: {
									"data-toggle": "collapse",
									"data-target": ".navbar-collapse"
								},
								Html: '<span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>'
							},{
								Name: "lblTitle",
								TagName: 'a',
								Class: 'navbar-brand',
								Control: 'jsui/Controls/html'
							}]
						}, {
							Class: "navbar-collapse collapse",
							Children: [{
								Name: "ddlItems"
								Class: "nav navbar-nav",
								TagName: "ul"
							}]
						}]
					}]
				}]

				
				return super().then resolve, reject;
	
		RefreshProperties: () =>
			super;
			title = @model.get "Title";
			if title?
				@lblTitle.html(title);
			@SetData();

	return navbar;
