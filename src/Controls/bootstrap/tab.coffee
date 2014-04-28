
define ['jsui', 'jquery', 'bluebird','../../lib/Promises','../../Control', '../html', '../../util', 'log'], (jsui, $, Promise, Promises, Control, Html,  util, log) ->
	return class Tab extends Control
		constructor: (@tabs, @config) ->
			@content = new Html();
			@header = new Html();
			@headerLink = new Html();

			@content.model.set "Class", "tab-pane"

			@header.model.set "TagName", "li"

			@headerLink.model.set "TagName", "a"
			@headerLink.model.set "Html", @config.DisplayName
			@headerLink.model.set "Attributes", { 
				"href": "##{@content.model.get('Id')}", 
				"data-toggle": "tab"
			}
			@headerLink.model.set "On", { 
				"click": () ->
					$(@).tab("show");
			}

		OnRender: () =>
			return new Promise (resolve, reject) =>
				return @header.addChild(@headerLink).then () =>
					return @tabs.divContent.addChild(@content).then () =>
						return @tabs.ulHeader.addChild(@header).then () =>
							return jsui.loadControlsFromObject(@config.Children, @content, @tabs.primary).then resolve, reject
							if @config.Active
								return @tabs.setActive(@content.model.get "Id").then resolve, reject
							return resolve();
