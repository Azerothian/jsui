
define ['jquery', 'bluebird', '../template', '../../util'], ($, Promise, Template, util) ->
	class formTextBox extends Template
		constructor: () ->
			super;
			@model.on "Placeholder", (value) =>
				#console.log "Placeholders", value, @;
				if @txtInput?
					@txtInput.attr("placeholder", value);
			@model.on "Label", (value) =>
				if @lblLabel?
					#console.log "Labels", value, @;
					@lblLabel.html(value);
			@model.on "Type", (value) =>
				if @txtInput?
					#console.log "Types", value, @;
					@txtInput.attr('type',value);
		OnInit: () =>
			return new Promise (resolve, reject) =>
				@elements = [
					{ 
						Name: "lblLabel"
						TagName: "label"
						Class: "col-xs-12 col-sm-3 control-label"
						Html: @model.get "Label"
					},
					{ 
						Class: "col-xs-12 col-sm-9"
						Children: [{ 
							Name: "txtInput"
							TagName: "input"
							Class: "form-control" 
							Attributes: { 
								placeholder: @model.get "Placeholder"
								type: @model.get "Type"
							}
						}]
					}
				]
				return super().then () =>
					$(@el).addClass("form-group");
					return resolve();

	return formTextBox;
