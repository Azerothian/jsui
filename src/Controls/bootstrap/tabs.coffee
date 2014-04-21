
define ['jsui', 'jquery', 'bluebird','../../lib/Promises', '../template', '../../util', 'log'], (jsui, $, Promise, Promises, Template, util, log) ->
	return class tabs extends Template
		constructor: () ->
			super;
			