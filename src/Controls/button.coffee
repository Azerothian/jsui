
define ['jquery', 'bluebird', './template', '../util'], ($, Promise, Template, util) ->
	class Button extends Template
		constructor: () ->
			super;
			@model.set "TagName", "input";
			@model.set "Attributes", { type: "button" };

		OnInit: () =>
			return new Promise (resolve, reject) =>
				return super().then () =>
					
					return resolve();

	return Button;
