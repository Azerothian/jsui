
define ['jquery','./html', 'bluebird', '../util','../lib/promises', 'jsui' ], ($, Html, Promise, Util, Promises, jsui) ->
	class Template extends Html
		constructor: () ->
			super #always call this when overriding the constructor, while extending a object;

		OnInit: () =>
			return new Promise (resolve, reject) =>
				if @elements?
					return jsui.loadControlsFromObject(@elements, @, @).then () =>
						return resolve();
				else
					return resolve();

	return Template;