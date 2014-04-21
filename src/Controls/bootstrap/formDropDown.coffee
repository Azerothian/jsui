
define ['jquery', 'bluebird','../../lib/Promises', './formControl','../html', '../../util', 'log'], ($, Promise, Promises, formControl,html, util, log) ->
	return class formDropDown extends formControl
		constructor: () ->
			super;
			@model.set 'ControlTagName', "select";
			@model.on "Items", (value) =>
				@PopulateOptions(value);

		PopulateOptions: (options) =>
			return new Promise (resolve, reject) =>
				if @Input?
					#log 'attempting to clear'
					return @Input.clearChildren().then () =>
						for i in options
							item = new html();
							item.model.set 'TagName', 'option';
							item.model.set 'Html', i.text;
							item.model.set 'Attributes', { value: i.value }
							@Input.addChild(item);
						return resolve();
		RefreshProperties: () =>
			super;
			items = @model.get 'Items'
			#log 'is items', items
			if items?
				@PopulateOptions(items).then () =>



#		renderFinished: () =>
#			return new Promise (resolve, reject) =>
#				return super().then () =>
#					items = @model.get 'Items'
#					#log 'is items', items
#					if items?
#						@PopulateOptions(items).then resolve, reject;
#					return resolve();
