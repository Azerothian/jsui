
define ['jsui', 'jquery', 'bluebird','../../lib/Promises', '../html', '../template','./tab', '../../util', 'log'], (jsui, $, Promise, Promises, Html, Template, Tab, util, log) ->
	return class Tabs extends Template
		constructor: () ->
			super;
			@model.on "Items", @SetData
		SetData: (value = @model.get "Items") =>
			if value? and @divContent? and @ulHeader?
				funcs = new Promises();
				funcs.push @ulHeader.clearChildren, @ulHeader, [];
				funcs.push @divContent.clearChildren, @divContent, [];
				for tab in value
					funcs.push @addTab, @, [tab]
				return funcs.chain().then resolve, reject
						


		addTab: (tabConfig) =>
			return new Promise (resolve, reject) =>
				tab = new Tab(@, tabConfig);
				return @addChild(tab).then resolve, reject;


		OnInit: () =>
			return new Promise (resolve, reject) =>
				@elements = [{ 
					Class: ""
					Children: [{ 
						Name: "ulHeader"
						Class: "nav nav-tabs" 
						TagName: "ul"
					}, {
						Name: "divContent"
						Class: "tab-content",
						
					}]
				}]

				
				return super().then resolve, reject;