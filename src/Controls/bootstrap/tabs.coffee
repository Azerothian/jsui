
define ['jsui', 'jquery', 'bluebird','../../lib/Promises','../html', '../template', '../../util', 'log'], (jsui, $, Promise, Promises, Html, Template, util, log) ->
	return class tabs extends Template
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
						


		addTab: (tab) =>
			return new Promise (resolve, reject) =>
				tabContent = new Html();
				if tab.Active
					active = "active";
				tabContent.model.set "Class", "tab-pane #{active}"
				return @divContent.addChild(tabContent).then () =>
					tabHeader = new Html();
					tabHeader.model.set "TagName", "li";
					if tab.Active
						tabHeader.model.set "Class", active;
					tabHeader.model.set 'Html', "<a href='##{tabContent.model.get('Id')}' data-toggle='tab'>#{tab.DisplayName}</a>"
					onrender = tabHeader.OnRender
					tabHeader.OnRender = () =>
						return new Promise (res, rej) =>
							return onrender().then () =>
								headerLink = "##{tabHeader.model.get('Id')} > a"
								$(headerLink).click () =>
									$(headerLink).tab('show')
								return res();

					return @ulHeader.addChild(tabHeader).then () =>
						return jsui.loadControlsFromObject(tab.Children, tabContent, @primary).then resolve, reject



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