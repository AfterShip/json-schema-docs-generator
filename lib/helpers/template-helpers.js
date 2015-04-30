/**
 * Handlebars Comparison Helpers
 * Copyright (c) 2013 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */
'use strict';

// node_modules
var _ = require('lodash');
var Handlebars = require('handlebars');

// The module to be exported
var helpers = {

	contains: function (str, pattern, options) {
		if (str.indexOf(pattern) !== -1) {
			return options.fn(this);
		}
		return options.inverse(this);
	},

	and: function (a, b, options) {
		if (a && b) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	},

	gt: function (value, test, options) {
		if (value > test) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	},

	gte: function (value, test, options) {
		if (value >= test) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	},

	is: function (value, test, options) {
		if (value === test) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	},

	isnt: function (value, test, options) {
		if (value !== test) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	},

	lt: function (value, test, options) {
		if (value < test) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	},

	lte: function (value, test, options) {
		if (value <= test) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	},

	/**
	 * Or
	 * Conditionally render a block if one of the values is truthy.
	 */
	or: function (a, b, options) {
		if (a || b) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	},

	/**
	 * ifNth
	 * Conditionally render a block if mod(nr, v) is 0
	 */
	ifNth: function (nr, v, options) {
		v = v+1;
		if (v % nr === 0) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	},

	/**
	 * {{#compare}}...{{/compare}}
	 *
	 * @credit: OOCSS
	 * @param left value
	 * @param operator The operator, must be between quotes ">", "=", "<=", etc...
	 * @param right value
	 * @param options option object sent by handlebars
	 * @return {String} formatted html
	 *
	 * @example:
	 *   {{#compare unicorns "<" ponies}}
	 *     I knew it, unicorns are just low-quality ponies!
	 *   {{/compare}}
	 *
	 *   {{#compare value ">=" 10}}
	 *     The value is greater or equal than 10
	 *     {{else}}
	 *     The value is lower than 10
	 *   {{/compare}}
	 */
	compare: function(left, operator, right, options) {
		/*jshint eqeqeq: false*/

		if (arguments.length < 3) {
			throw new Error('Handlebars Helper "compare" needs 2 parameters');
		}

		if (options === undefined) {
			options = right;
			right = operator;
			operator = '===';
		}

		var operators = {
			'==':     function(l, r) {return l == r; },
			'===':    function(l, r) {return l === r; },
			'!=':     function(l, r) {return l != r; },
			'!==':    function(l, r) {return l !== r; },
			'<':      function(l, r) {return l < r; },
			'>':      function(l, r) {return l > r; },
			'<=':     function(l, r) {return l <= r; },
			'>=':     function(l, r) {return l >= r; },
			'typeof': function(l, r) {return typeof l == r; }
		};

		if (!operators[operator]) {
			throw new Error('Handlebars Helper "compare" doesn\'t know the operator ' + operator);
		}

		var result = operators[operator](left, right);

		if (result) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	},


	/**
	 * {{if_eq}}
	 *
	 * @author: Dan Harper <http://github.com/danharper>
	 *
	 * @param  {[type]} context [description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 *
	 * @example: {{if_eq this compare=that}}
	 */
	if_eq: function (context, options) {
		if (context === options.hash.compare) {
			return options.fn(this);
		}
		return options.inverse(this);
	},

	/**
	 * {{unless_eq}}
	 * @author: Dan Harper <http://github.com/danharper>
	 *
	 * @param  {[type]} context [description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 *
	 * @example: {{unless_eq this compare=that}}
	 */
	unless_eq: function (context, options) {
		if (context === options.hash.compare) {
			return options.inverse(this);
		}
		return options.fn(this);
	},

	/**
	 * {{if_gt}}
	 * @author: Dan Harper <http://github.com/danharper>
	 *
	 * @param  {[type]} context [description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 *
	 * @example: {{if_gt this compare=that}}
	 */
	if_gt: function (context, options) {
		if (context > options.hash.compare) {
			return options.fn(this);
		}
		return options.inverse(this);
	},

	/**
	 * {{unless_gt}}
	 * @author: Dan Harper <http://github.com/danharper>
	 *
	 * @param  {[type]} context [description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 *
	 * @example: {{unless_gt this compare=that}}
	 */
	unless_gt: function (context, options) {
		if (context > options.hash.compare) {
			return options.inverse(this);
		}
		return options.fn(this);
	},

	/**
	 * {{if_lt}}
	 * @author: Dan Harper <http://github.com/danharper>
	 *
	 * @param  {[type]} context [description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 *
	 * @example: {{if_lt this compare=that}}
	 */
	if_lt: function (context, options) {
		if (context < options.hash.compare) {
			return options.fn(this);
		}
		return options.inverse(this);
	},

	/**
	 * {{unless_lt}}
	 * @author: Dan Harper <http://github.com/danharper>
	 *
	 * @param  {[type]} context [description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 *
	 * @example: {{unless_lt this compare=that}}
	 */
	unless_lt: function (context, options) {
		if (context < options.hash.compare) {
			return options.inverse(this);
		}
		return options.fn(this);
	},

	/**
	 * {{if_gteq}}
	 * @author: Dan Harper <http://github.com/danharper>
	 *
	 * @param  {[type]} context [description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 *
	 * @example: {{if_gteq this compare=that}}
	 */
	if_gteq: function (context, options) {
		if (context >= options.hash.compare) {
			return options.fn(this);
		}
		return options.inverse(this);
	},

	/**
	 * {{unless_gteq}}
	 * @author: Dan Harper <http://github.com/danharper>
	 *
	 * @param  {[type]} context [description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 *
	 * @example: {{unless_gteq this compare=that}}
	 */
	unless_gteq: function (context, options) {
		if (context >= options.hash.compare) {
			return options.inverse(this);
		}
		return options.fn(this);
	},

	/**
	 * {{if_lteq}}
	 * @author: Dan Harper <http://github.com/danharper>
	 *
	 * @param  {[type]} context [description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 *
	 * @example: {{if_lteq this compare=that}}
	 */
	if_lteq: function (context, options) {
		if (context <= options.hash.compare) {
			return options.fn(this);
		}
		return options.inverse(this);
	},

	/**
	 * {{unless_lteq}}
	 * @author: Dan Harper <http://github.com/danharper>
	 *
	 * @param  {[type]} context [description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 *
	 * @example: {{unless_lteq this compare=that}}
	 */
	unless_lteq: function (context, options) {
		if (context <= options.hash.compare) {
			return options.inverse(this);
		}
		return options.fn(this);
	},

	/**
	 * {{ifAny}}
	 * Similar to {{#if}} block helper but accepts multiple arguments.
	 * @author: Dan Harper <http://github.com/danharper>
	 *
	 * @param  {[type]} context [description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 *
	 * @example: {{ifAny this compare=that}}
	 */
	ifAny: function () {
		var argLength = arguments.length - 1;
		var content = arguments[argLength];
		var success = true;
		var i = 0;
		while (i < argLength) {
			if (!arguments[i]) {
				success = false;
				break;
			}
			i += 1;
		}
		if (success) {
			return content.fn(this);
		} else {
			return content.inverse(this);
		}
	},

	/**
	 * {{ifEven}}
	 * Determine whether or not the @index is an even number or not
	 * @author: Stack Overflow Answer <http://stackoverflow.com/questions/18976274/odd-and-even-number-comparison-helper-for-handlebars/18993156#18993156>
	 * @author: Michael Sheedy <http://github.com/sheedy> (found code and added to repo)
	 *
	 * @param  {[type]} context [description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 *
	 * @example: {{ifEven @index}}
	 */
	ifEven: function (conditional, options) {
		if ((conditional % 2) == 0) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	},

	/**
	 * Output an object or value to JSON
	 * @param data
	 */
	debug: function(data) {
		return JSON.stringify(data, null, true ? 2 : void 0);
	},

	objectLink: function(text, url) {
		text = Handlebars.Utils.escapeExpression(text);
		url  = Handlebars.Utils.escapeExpression(url).toLowerCase();

		var result = '<a href="#' + url + '-properties">' + text + '</a>';
		return new Handlebars.SafeString(result);
	},

	printEnum: function(arr) {
		function wrap( val ) {
			return '<code>' + val + '</code>';
		}
		var result = _.map(arr, wrap);
		return result;
	},

	printParam: function( val ) {
		return '<code>' + val + '</code>';
	},

	/**
	 * {{#prioSort}}
	 * @author: Oskar Nordgren
	 *
	 * @param  {[array]} context [An array with objects]
	 * @param  {[string]} key [The key that exist on the objects in the context array]
	 * @return {[array]} prioList [An array with strings. The order or the strings will reflect the results]
	 *
	 * @example: {{#prioSort myArrayOfObjects "id" myArrayWithIdStrings}}
	 * Where myArrayOfObjects is: [{id:"cat"},{id:"monkey"},{id:"lion"},{id:"sheep"}]
	 * and myArrayOfStrings is: ["monkey","lion"]
	 * Template will iterate over the array: [{id:"monkey"},{id:"lion"},{id:"cat"},{id:"sheep"}]
	 */	
	prioSort: function(context, key, prioList, options) {
		if (arguments.length < 3) {
			throw new Error('Handlebars Helper "prioSort" needs 3 parameters');
		}
		var prioritized;
		var orderedPrioritized = [];
		var nonPrio;
		var reOrdered;
		var ret = "";

		// Get the prioritized objects from the list
		prioritized = _.filter(context, function(obj) {
			return _.contains(prioList, obj[key]);
		});

		// Reorder the prioritized values according to prioList
		_.each(prioList, function(prioName) {
			_.each(prioritized, function(prioObj) {
				if(prioName === prioObj[key]) {
					orderedPrioritized.push(prioObj);
					return;
				}
			})
		});

		// Remove all prioritized objects
		nonPrio = _.difference(context, orderedPrioritized);

		// Merge the arrays togather
		reOrdered = _.union(orderedPrioritized,nonPrio);

		// Make output
		for(var i=0, j=reOrdered.length; i<j; i++) {
			ret = ret + options.fn(reOrdered[i]);
		}

		return ret;
	},
	/**
	 * {{capitalizeFirst}}
	 * Capitalize first word in a sentence
	 * @param  {[type]} str [description]
	 * @return {[type]}     [description]
	 */
	capitalizeFirst: function (str) {
		if(str && typeof str === "string") {
			return str.charAt(0).toUpperCase() + str.slice(1);
		}
	},
	/**
	 * {{hyphenate}}
	 * Replace spaces in string with hyphens.
	 * @param  {[type]} str [description]
	 * @return {[type]}     [description]
	 */
	hyphenate: function (str) {
		if(str && typeof str === "string") {
			return str.split(" ").join("-").toLowerCase();
		}
	}

};

// Aliases
helpers.ifeq       = helpers.if_eq;
helpers.unlessEq   = helpers.unless_eq;
helpers.ifgt       = helpers.if_gt;
helpers.unlessGt   = helpers.unless_gt;
helpers.iflt       = helpers.if_lt;
helpers.unlessLt   = helpers.unless_lt;
helpers.ifgteq     = helpers.if_gteq;
helpers.unlessGtEq = helpers.unless_gteq;
helpers.ifLtEq     = helpers.if_lteq;
helpers.unlessLtEq = helpers.unless_lteq;

module.exports = helpers;
