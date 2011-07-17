/**
 * @license minimal.js
 * Copyright (c) 2011 timmy willison
 * Dual licensed under the MIT and GPL licenses.
 * http://timmywillison.com/licence/
 */

(function( window, document ) {

	var _$ = window.$,
		_minimal = window.minimal,
		_queryAll = window.queryAll,
		_query = window.query,

		// Selector
		rcomma = /[\s*]?,[\s*]?/,
		rid = /^#([\w\-]+)$/,
		rtagclass = /^(?:^([\w\-]+)$)|(?:^([\w]+)?\.([\w\-]+)$)/,
		
		// Classes
		rtrimLeft = /^\s+/,
		rtrimRight = /\s+$/,
		rspaces = /\s+/,
		ptrim = String.prototype.trim,
		
		// Core
		forEach = Array.prototype.forEach,
		slice = Array.prototype.slice,
		hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * Main constructor
	 */
	var minimal = function( selector, root ) {

		// Self-instantiate if not instantiated
		if ( !this.version ) {
			return new minimal( selector, root );
		}

		var selection = queryAll( selector, root );

		this.length = selection.length;
		merge( this, selection );
	};

	var proto = minimal.prototype;
	proto.version = '0.0.1';

	var toArray = minimal.toArray = function( list ) {
		var i = 0,
			len = list.length,
			ret = [];
		for ( ; i < len; i++ ) {
			ret[ i ] = list[ i ];
		}
		return ret;
	};

	/**
	 * A short simple selector engine
	 * Never use descendants (although setting context is allowed) and only use id, tag, tag.class, or .class
		- Since there should only one element with a given ID on a page, this does not support
		   rooted selections for id selectors e.g. queryAll('#child', '#parent'),
		   but it will do queryAll('div', '#parent')
	 * @param {String} selector The selector string in which to match elements against
	 * @param {Element|String|null} root Either the owner document for the selection, an id, or null
	 * @return {Array} Returns the matched elements in array form (not nodelist)
	 */
	var queryAll = function( selector, root ) {
		root = root && (typeof root === 'string' ? queryAll(root)[0] : root.nodeName ? root : root[0]) || document;

		if ( !selector || !root ) {
			return [];
		}

		if ( typeof selector !== 'string' ) {
			if ( selector.nodeName ) {
				return [ selector ];
			}
			return toArray( selector );
		}

		var match, elem, ret, m;

		// ID
		if ( match = rid.exec(selector) ) {
			return ( elem = root.getElementById( match[1] ) ) ? [ elem ] : [];
		// Tag, Class, and Tag.Class
		} else if ( match = rtagclass.exec(selector) ) {
			if ( m = match[1] ) {
				return toArray( root.getElementsByTagName(m) );
			} else if ( m = match[3] ) {

				// Class
				if ( !match[2] && 'getElementsByClassName' in root ) {
					return toArray( root.getElementsByClassName(m) );

				// Tag.Class
				} else if ( 'querySelectorAll' in root ) {
					return toArray( root.querySelectorAll( selector ) );

				// IE fallback
				} else {
					var tags = root.getElementsByTagName( match[2] || '*' );
					ret = [];
					for ( var j = 0; elem = tags[j]; j++ ) {
						if ( ~(' ' + elem.className + ' ').indexOf( ' ' + m + ' ' ) ) {
							ret.push( elem );
						}
					}
					return ret;
				}
			}

		// Multiple selectors
		} else {
			ret = [];
			selector = selector.split( rcomma );

			// No split means selector not supported
			if ( selector.length === 1 ) {
				throw new Error( 'Invalid selector: ' + selector );
			}

			for ( var i = 0, sel; sel = selector[ i ]; i++ ) {
				ret = ret.concat( queryAll( sel, root ) );
			}
			return ret;
		}
	};

	/**
	 * Retrieves the first of the matched set in a query
	 */
	var query = function( selector, root ) {
		return queryAll( selector, root )[0];
	};


	/**
	 * An implementaton of each based off underscore.js
	 */
	var each = minimal.each = minimal.forEach = function( obj, iterator, context ) {
		var key, len;
		if ( !obj ) {
			return;
		}

		if ( forEach && obj.forEach === forEach ) {
			obj.forEach( iterator, context );

		} else if ( obj.length === +obj.length ) {
			for ( key = 0, len = obj.length; key < len; key++ ) {
				if ( key in obj ) {
					iterator.call( context, obj[ key ], key, obj );
				}
			}

		} else {
			for ( key in obj ) {
				if ( hasOwnProperty.call( obj, key ) ) {
					iterator.call( context, obj[ key ], key, obj );
				}
			}
		}

		return obj;
	};

	// Simplified merge & extend (merge expects numerical length, extend expects objects)
	var merge = minimal.merge = function( one, two ) {
		for ( var i = 0, len = two.length; i < len; i++ ) {
			one[i] = two[i];
		}
		return one;
	};
	var extend = minimal.extend = function( one, two ) {
		for ( var prop in two ) {
			one[ prop ] = two[ prop ];
		}
		return one;
	};

	// IE doesn't match non-breaking spaces with \s
	if ( /\S/.test( "\xA0" ) ) {
		rtrimLeft = /^[\s\xA0]+/;
		rtrimRight = /[\s\xA0]+$/;
	}

	// Cross-browser trim
	var trim = minimal.trim = ptrim ?
		function( str ) {
			return ptrim.call( str );
		} :
		function( str ) {
			return str.replace( rtrimLeft, '' ).replace( rtrimRight, '' );
		};


	/**
	 * Classes
	 * Some class manipulation is based off of Google's code for the html5 presentation
	 */
	var addClass = minimal.addClass = function( node, classStr ) {
		classStr = classStr.split( rspaces );
		var cls = ' ' + node.className + ' ';
		for ( var i = 0, len = classStr.length, c; i < len; ++i ) {
			c = classStr[ i ];
			if ( c && cls.indexOf(' ' + c + ' ') < 0 ) {
				cls += c + ' ';
			}
		}
		node.className = trim( cls );
	};

	var removeClass = minimal.removeClass = function( node, classStr ) {
		var cls;
		if ( classStr !== undefined ) {
			classStr = classStr.split( rspaces );
			cls = ' ' + node.className + ' ';
			for ( var i = 0, len = classStr.length; i < len; ++i ) {
				cls = cls.replace(' ' + classStr[ i ] + ' ', ' ');
			}
			cls = trim( cls );
		} else {
			cls = '';
		}
		if ( node.className !== cls ) {
			node.className = cls;
		}
	};

	minimal.toggleClass = function( node, classStr ) {
		var cls = ' ' + node.className + ' ';
		if ( ~cls.indexOf(' ' + trim( classStr ) + ' ') ) {
			removeClass( node, classStr );
		} else {
			addClass( node, classStr );
		}
	};

	var hasClass = minimal.hasClass = function( node, classStr ) {
		return node && classStr &&
			!!~(' ' + node.className + ' ').indexOf( ' ' + classStr + ' ' );
	};


	/**
	 * Support
	 * Currently houses the support test for attributes, but is built to be expandable
	 */
	var support = minimal.support = (function() {
		var div = document.createElement('div');
		div.setAttribute('className', 't');
		return {
			getSetAttribute: div.className !== 't'
		};
	})();


	/**
	 * Attributes
	 */
	var getAttr, removeAttr;
	if ( support.getSetAttribute ) {
		getAttr = function( node, name ) {
			var nType;
			// don't get/set attributes on text, comment and attribute nodes
			if ( !node || (nType = node.nodeType) === 3 || nType === 8 || nType === 2 ) {
				return null;
			}
			// Does not normalize to undefined or null
			return node.getAttribute( name );
		};
		removeAttr = function( node, name, value ) {
			node.removeAttribute( name );
		};
	} else {
		// IE6/7
		getAttr = function( node, name ) {
			var nType;
			// don't get/set attributes on text, comment and attribute nodes
			if ( !node || (nType = node.nodeType) === 3 || nType === 8 || nType === 2 ) {
				return null;
			}
			var ret = node.getAttributeNode( name );
			return ret && (ret = ret.nodeValue) !== '' ? ret : null;
		};
		removeAttr = function( node, name, value ) {
			node.setAttribute( name, '' );
			node.removeAttributeNode( node.getAttributeNode( name ) );
		};
	}
	minimal.getAttr = getAttr;
	minimal.removeAttr = removeAttr;

	var setAttr = minimal.setAttr = function( node, name, value ) {
		var nType, ret;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !node || (nType = node.nodeType) === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Always set to string
		value += '';

		if ( !support.getSetAttribute ) {
			ret = node.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				node.setAttributeNode( ret );
			}
			ret.nodeValue = value;
			return;
		}

		node.setAttribute( name, value );
	};


	/**
	 * Events
	 */
	var on, off, fnCache;
	if ( 'addEventListener' in document ) {
		on = function( node, type, fn ) {
			if ( 'addEventListener' in node ) {
				node.addEventListener( type, fn, false );
			}
		};
		off = function( node, type, fn ) {
			if ( 'removeEventListener' in node ) {
				node.removeEventListener( type, fn, false );
			}
		};

	// IE
	} else {
		fnCache = {}; // used for event context
		on = function( node, type, fn ) {
			var f;
			if ( 'attachEvent' in node ) {
				f = fnCache[ fn ] = function() {
					fn.call( node );
				};
				node.attachEvent( 'on' + type, f);
			}
		};
		off = function( node, type, fn ) {
			if ( 'detachEvent' in node ) {
				node.detachEvent( 'on' + type, fnCache[ fn ] || fn );
			}
		};
	}
	minimal.on = on;
	minimal.off = off;

	var fire;
	if ( 'createEvent' in document ) {
		fire = function( node, type ) {
			var event = document.createEvent('HTMLEvents');
			event.initEvent( type, true, true );
			node.dispatchEvent( event );
		};
	} else {
		fire = function( node, type ) {
			var event = document.createEventObject();
			node.fireEvent( 'on' + type, event );
		};
	}
	minimal.fire = fire;

	// Add internal functions to the prototype
	var methods = 'each forEach merge toArray'.split(' ');
	each(methods, function( val ) {
		proto[ val ] = function() {
			return minimal[ val ].apply( this, [this].concat(slice.call( arguments, 0 )) );
		};
	});
	methods = 'addClass removeClass toggleClass setAttr removeAttr on off fire'.split(' ');
	each(methods, function( val ) {
		proto[ val ] = function() {
			var elem, i = 0;
			for ( ; elem = this[i]; i++ ) {
				minimal[ val ].apply( elem, [elem].concat(slice.call( arguments, 0 )) );
			}
			return this;
		};
	});

	// If any of the elements have the class, return true
	proto.hasClass = function( classStr ) {
		var elem, i = 0, ret;
		for ( ; elem = this[i]; i++ ) {
			if ( hasClass(elem, classStr) ) {
				return true;
			}
		}
		return false;
	};

	// getAttr only returns for the first node
	proto.getAttr = function( name ) {
		return getAttr( this[0], name );
	};


	/**
	 * Traversing
	 */
	extend(proto, {
		slice: function( start, end ) {
			return new minimal( toArray(this).slice(start, end) );
		},
		first: function() {
			return this.slice(0, 1);
		},
		eq: function( index ) {
			return this.slice( index, index + 1 );
		}
	});


	/**
	 * Responsible infection of the global namespace
	 * @param {Boolean} query - Restore window.query & window.queryAll to previous values
	 * @param {Boolean} deep - Restore window.minimal
	 * @return {Object} Returns minimal
	 */
	minimal.noConflict = function( query, deep ) {
		window.$ = _$;
		if ( query ) {
			window.queryAll = _queryAll;
			window.query = _query;
		}
		if ( deep ) {
			window.minimal = _minimal;
		}
		return minimal;
	};

	// Expose minimal
	window.$ = window.minimal = minimal;

	// Expose query
	window.queryAll = queryAll;
	window.query = query;

})( this, this.document );
