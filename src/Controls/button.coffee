
define ['jquery', 'bluebird', './template', '../util'], ($, Promise, Template, util) ->
	class Button extends Template
		constructor: () ->
			super;
			@model.set "TagName", "input";
			@model.set "Attributes", { type: "button" };
			@model.on "Text", (value) =>
				$(@el).val(value);

		OnInit: () =>
			return new Promise (resolve, reject) =>
				return super().then () =>
					$(@el).val @model.get "Text"
					return resolve();

	return Button;
