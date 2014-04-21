
define ['jquery', 'bluebird','../../lib/Promises', '../template', '../../util', 'log'], ($, Promise, Promises, Template, util, log) ->
	class formTextBox extends Template
		constructor: () ->
			super;
			@model.set 'ControlTagName', 'input';
			@model.set 'Type', 'text'
			
			@model.on "Placeholder", (value) =>
				#console.log "Placeholders", value, @;
				if @Input?
					@Input.attr("placeholder", value);
			@model.on "Label", (value) =>
				if @lblLabel?
					#console.log "Labels", value, @;
					@lblLabel.html(value);
			@model.on "Type", (value) =>
				if @Input?
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
							Name: "Input"
							TagName: @model.get 'ControlTagName'
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
		getText: () =>
			return $(@Input.el).val();

		OnValidation: (validationGroup) =>
			return new Promise (resolve, reject) =>
				#log "formTextBox - OnValidation - validationGroup", validationGroup
				check = @model.get "ValidationGroup"
				if validationGroup is check
					rules = @model.get "Validators";
					validators = new Promises()

					for ruleName of rules
						rule = rules[ruleName]
						log "rule - #{ruleName}", rule
						switch rule.type 
							when "required" then validators.push @OnValidationRequired, @, [rule]
							when "email" then validators.push @OnValidationEmail, @, [rule]
							when "compare" then validators.push @OnValidationCompare, @, [rule]
							when "custom" then validators.push @OnValidationCustom, @, [rule]
					#log "start ALL"
					return validators.chain()
						.then (results) =>
							#log "formTextBox - OnValidation - resolve", arguments
							return resolve();
						, (results) =>
							#log "formTextBox - OnValidation - reject", arguments
							if results
								vResult = { messages: [], target: @Input, control: @ };	
								for r in results
									if r?
										for ir in r
											vResult.messages.push ir
								return reject(vResult);
							return reject();
				return resolve();

		OnValidationRequired: (rule) =>
			return new Promise (resolve, reject) =>
				text = @getText();
				name = @model.get 'Name';
				#log "OnValidationRequired - text: #{text} - #{name}"
				if text is ''
					return @OnValidationFailed(rule, reject);
				return resolve();

		OnValidationEmail: (rule) =>
			return new Promise (resolve, reject) =>
				emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				text = @getText();
				#log "formTextBox - OnValidationEmail", text.match emailPattern
				if not text.match emailPattern
					return @OnValidationFailed(rule, reject);
				return resolve();
		
		OnValidationCompare: (rule) =>
			return new Promise (resolve, reject) =>
				emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				text = @getText();
				#log "formTextBox - OnValidationEmail", text.match emailPattern
				if not text.match emailPattern
					return @OnValidationFailed(rule, reject);
				return resolve();	
		OnValidationCustom: (rule) =>
			return new Promise (resolve, reject) =>
				text = @getText();
				if rule.OnValidate?
					if !rule.OnValidate(text)
						return @OnValidationFailed(rule, reject);
				return resolve();
		OnValidationFailed: (rule, reject) =>
			#log "formTextBox - OnValidationFailed", rule
			return reject(rule);

	return formTextBox;
