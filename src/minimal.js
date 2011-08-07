/**
 * @license minimal.js v0.3pre
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
		rcomma = /\s*,\s*/,
		rid = /^#([\w\-]+)$/,
		rtagclass = /^(?:([\w]+)|([\w]+)?\.([\w\-]+))$/,

		// Classes
		rtrimLeft = /^\s+/,
		rtrimRight = /\s+$/,
		rspaces = /\s+/,
		ptrim = String.prototype.trim,

		// Attributes
		rleveltwo = /(?:href|src|width|height)/i,

		// CSS
		rnotnumpx = /^-?\d+[^p\s\d]+$/i,
		ropacity = /opacity=([^)]*)/,
		ralpha = /alpha\([^)]*\)/i,

		// Core
		forEach = [].forEach,
		slice = [].slice,
		push = [].push,
		pindexOf = [].indexOf,
		indexOf,
		hasOwnProperty = ({}).hasOwnProperty,

		ID = 'minimal@timmywillison.com';

		expandoProxy = ID + "/proxy";

	/**
	 * Main constructor
	 */
	var minimal = function( selector, root ) {

		// Self-instantiate if not instantiated
		if ( !this[ ID ] ) {
			return new minimal( selector, root );
		}

		this.length = 0;

		if ( selector == null ) {
			return;
		}

		if ( typeof selector === 'string' ) {
			queryAll( selector, root, this );

		} else if ( this[0] = selector.nodeType ? selector : selector.documentElement ) {
			this.length = 1;

		} else {
			merge( this, selector );
		}
	};

	var proto = minimal.prototype;
	proto[ ID ] = proto.version = '0.3pre';

	proto.push = push;

	var toArray = minimal.toArray = function( list ) {
		return merge( [], list );
	};

	//A faster toArray for minimal instances (native objects).
	proto.toArray = function() {
		return slice.call( this, 0 );
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
	var queryAll = function( selector, root, ret ) {
		root = root && (typeof root === 'string' ? queryAll(root)[0] : root.nodeName ? root : root[0]) || document;
		ret = ret || [];

		if ( !selector || !root ) {
			return ret;
		}

		var match, node, mTag, mClass, i, j;

		// ID
		if ( match = rid.exec(selector) ) {
			node = root.getElementById( match[1] );
			node && ret.push( node );
			return ret;

		// Tag, Class, and Tag.Class
		} else if ( match = rtagclass.exec(selector) ) {
			mTag = match[1] || match[2];
			mClass = match[3];

			// Tag
			if ( !mClass ) {
				return merge( ret, root.getElementsByTagName(mTag) );
			}

			// Class
			if ( !mTag && root.getElementsByClassName ) {
				return merge( ret, root.getElementsByClassName(mClass) );
			}

			// Tag.Class
			if ( root.querySelectorAll ) {
				return merge( ret, root.querySelectorAll( selector ) );
			}

			// IE fallback
			match = root.getElementsByTagName( mTag || '*' );
			j = 0;
			mClass = ' ' + mClass + ' ';
			for ( ; node = match[ j ]; ++j ) {
				if ( ~(' ' + node.className + ' ').indexOf( mClass ) ) {
					ret.push( node );
				}
			}

		// Multiple selectors
		} else {
			selector = selector.split( rcomma );

			// No split means selector not supported
			if ( selector.length < 2 ) {
				throw 'Invalid selector: ' + selector;
			}

			for ( i = 0; node = selector[ i ]; ++i ) {
				queryAll( node, root, ret );
			}
		}

		return ret;
	};

	// Retrieves the first of the matched set in a query
	var query = function( selector, root ) {
		return queryAll( selector, root )[0];
	};


	// An implementaton of each based off underscore.js
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
		var i = one.length,
			j = 0,
			len;

		if ( typeof two.length === 'number' ) {
			for ( len = two.length; j < len; ++j ) {
				one[ i++ ] = two[ j ];
			}

		} else {
			for ( ; two[j]; ++j ) {
				one[ i++ ] = two[ j ];
			}
		}

		one.length = i;

		return one;
	};
	var extend = minimal.extend = function( one, two ) {
		for ( var prop in two ) {
			one[ prop ] = two[ prop ];
		}
		return one;
	};

	// Checks if an item is within an array
	if ( pindexOf ) {
		indexOf = Array.indexOf || function( array, searchElement, fromIndex ) {
			return pindexOf.call( array, searchElement, fromIndex );
		};
	} else {
		indexOf = function( array, searchElement, fromIndex ) {
			var len = array.length,
				i = fromIndex ? fromIndex < 0 ? Math.max( 0, len + fromIndex ) : fromIndex : 0;

			for ( ; i < len; ++i ) {
				if ( i in array && array[ i ] === searchElement ) {
					return i;
				}
			}

			return -1;
		};

		pindexOf = function( searchElement, fromIndex ) {
			return indexOf( this, searchElement, fromIndex );
		};
	}

	minimal.indexOf = indexOf;
	proto.indexOf = pindexOf;

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
			return ( '' + str ).replace( rtrimLeft, '' ).replace( rtrimRight, '' );
		};


	/**
	 * Classes
	 * Some class manipulation is based off of Google's code for the html5 presentation (http://code.google.com/p/html5slides/)
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
	 */
	var support = minimal.support = (function() {
		var div = document.createElement('div');
		div.setAttribute('className', 't');
		div.innerHTML = '<b style="float:left;opacity:.5"></b>';
		var b = div.getElementsByTagName('b')[0];
		return {
			getSetAttribute: div.className !== 't',
			cssFloat: !!b.style.cssFloat,
			opacity: /^0.5$/.test( b.style.opacity )
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
				return undefined;
			}
			// Does not normalize to undefined or null
			// Both values are useful
			return node.getAttribute( name );
		};
		removeAttr = function( node, name, value ) {
			node.removeAttribute( name );
		};
	} else {
		// IE6/7
		getAttr = function( node, name ) {
			var nType, ret;
			// don't get/set attributes on text, comment and attribute nodes
			if ( !node || (nType = node.nodeType) === 3 || nType === 8 || nType === 2 ) {
				return undefined;
			}
			if ( rleveltwo.test( name ) ) {
				return node.getAttribute( name, 2 );
			} else {
				ret = node.getAttributeNode( name );
				return ret && (ret = ret.nodeValue) !== '' ? ret : null;
			}
		};
		removeAttr = function( node, name, value ) {
			node.setAttribute( name, '' );
			node.removeAttributeNode( node.getAttributeNode( name ) );
		};
	}
	minimal.getAttr = getAttr;
	minimal.removeAttr = removeAttr;

	minimal.setAttr = function( node, name, value ) {
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
	 * CSS
	 */
	var getCSS;
	if ( window.getComputedStyle ) {
		getCSS = function( node, name ) {
			name = cssProps[ name ] || name;
			var style,
				ret = cssHooks[ name ];
			if ( ret && hasOwnProperty.call(ret, 'get') ) {
				return ret.get( node, name );
			} else {
				ret = getComputedStyle( node, null )[ name ];
				return !ret ? (style = node.style) && style[ name ] : ret;
			}
		};
	} else if ( document.documentElement.currentStyle ) {
		getCSS = function( node, name ) {
			name = cssProps[ name ] || name;
			var left, rsLeft, style,
				ret = cssHooks[ name ];

			if ( ret && hasOwnProperty.call(ret, 'get') ) {
				return ret.get( node, name );
			} else {
				// Credits to jQuery
				ret = node.currentStyle && node.currentStyle[ name ];

				// Uses the pixel converter by Dean Edwards
				// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
				if ( rnotnumpx.test( ret ) ) {
					rsLeft = node.runtimeStyle && node.runtimeStyle[ name ];
					style = node.style;

					left = style.left;
					if ( rsLeft ) {
						node.runtimeStyle.left = node.currentStyle.left;
					}
					style.left = name === 'fontSize' ? '1em' : (ret || 0);
					ret = style.pixelLeft + 'px';

					// Revert the changed values
					style.left = left;
					if ( rsLeft ) {
						node.runtimeStyle.left = rsLeft;
					}
				}

				return ret === '' ? 'auto' :
					!ret ? (style = node.style) && style[ name ] : ret;
			}
		};
	}
	minimal.getCSS = getCSS;

	var cssProps = {
		// Normalize float
		'float': support.cssFloat ? 'cssFloat' : 'styleFloat'
	};

	var cssHooks = {};

	// IE uses filter for opacity
	if ( !support.opacity ) {
		cssHooks.opacity = {
			get: function( node ) {
				var alpha = node.filters.alpha;
				// Return a string just like the browser
				return alpha ? alpha.opacity / 100 + '': '1';
			},
			set: function( node, value ) {
				var style = node.style;
				var alpha = node.filters.alpha;

				style.zoom = 1; // Force opacity in IE by setting the zoom level
				if ( alpha ) {
					alpha.opacity = value * 100;
				} else {
					style.filter += 'alpha(opacity=' + value * 100 + ')';
				}
			}
		};
	}

	minimal.setCSS = function( node, name, value ) {
		name = cssProps[ name ] || name;
		var hook = cssHooks[ name ];
		if ( hook && hasOwnProperty.call(hook, 'set') ) {
			hook.set( node, value );
		} else {
			node.style[ name ] = value;
		}
	};


	/**
	 * Window/Document dimensions
	 */
	minimal.getWinDimension = function( name ) {
		name = name.charAt(0).toUpperCase() + name.slice(1); // Capitialize
		var docElemProp = document.documentElement[ "client" + name ];
		return document.compatMode === "CSS1Compat" && docElemProp ||
			document.body[ "client" + name ] || docElemProp;
	};
	minimal.getDocDimension = function( name ) {
		name = name.charAt(0).toUpperCase() + name.slice(1); // Capitialize
		return Math.max(
			document.documentElement[ "client" + name ],
			document.body["scroll" + name], document.documentElement[ "scroll" + name ],
			document.body["offset" + name], document.documentElement[ "offset" + name ]
		);
	};


	/**
	 * Events
	 */
	var on, off, preventDefault, stopPropogation;
	if ( document.addEventListener ) {
		on = function( node, type, fn ) {
			if ( node.addEventListener ) {
				node.addEventListener( type, fn, false );
			}
		};
		off = function( node, type, fn ) {
			if ( node.removeEventListener ) {
				node.removeEventListener( type, fn, false );
			}
		};

	// IE
	} else {
		preventDefault = function() { this.returnValue = false; };
		stopPropagation = function() { this.cancelBubble = true; };
		on = function( node, type, fn ) {
			var f;
			if ( node.attachEvent ) {
				f = fn[ expandoProxy ] || ( fn[ expandoProxy ] = function( e ) {
					if ( typeof e.preventDefault !== 'function' ) {
						e.preventDefault = preventDefault;
						e.stopPropagation = stopPropagation;
					}
					fn.call( node, e );
				});
				node.attachEvent( 'on' + type, f );
			}
		};
		off = function( node, type, fn ) {
			if ( node.detachEvent ) {
				node.detachEvent( 'on' + type, fn[ expandoProxy ] || fn );
			}
		};
	}
	minimal.on = on;
	minimal.off = off;

	var fire;
	if ( document.createEvent ) {
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
	each('each forEach merge'.split(' '), function( val ) {
		proto[ val ] = function() {
			var args = [ this ];
			push.apply( args, arguments );
			return minimal[ val ].apply( this, args );
		};
	});
	each('addClass removeClass toggleClass setAttr removeAttr setCSS on off fire'.split(' '), function( val ) {
		proto[ val ] = function() {
			var node, args, i = 0;
			for ( ; node = this[i]; i++ ) {
				args = [ node ];
				push.apply( args, arguments );
				minimal[ val ].apply( node, args );
			}
			return this;
		};
	});

	// If any of the elements have the class, return true
	proto.hasClass = function( classStr ) {
		var node, i = 0, ret;
		for ( ; node = this[i]; i++ ) {
			if ( hasClass(node, classStr) ) {
				return true;
			}
		}
		return false;
	};

	// getAttr/getCSS only return for the first node
	each([ 'getAttr', 'getCSS' ], function( val ) {
		proto[ val ] = function( name ) {
			return minimal[ val ]( this[0], name );
		};
	});


	/**
	 * Traversing
	 */
	extend(proto, {
		slice: function( start, end ) {
			var ret = new minimal();
			push.apply( ret, slice.apply( this, arguments ) );
			return ret;
		},
		first: function() {
			return this.slice(0, 1);
		},
		last: function() {
			return this.slice(-1);
		},
		eq: function( index ) {
			return ~index ? this.slice( index, index + 1 ) : this.slice(-1);
		},
		find: function( selector ) {
			var node, sel, j, el,
				i = 0, ret = new minimal();
			for ( ; node = this[i]; i++ ) {
				sel = queryAll( selector, rid.test(selector) ? document : node );
				for ( j = 0; el = sel[ j ]; j++ ) {
					if ( !~indexOf(ret, el) ) {
						ret.push( el );
					}
				}
			}
			return ret;
		},
		filter: function( fn ) {
			var node,
				ret = new minimal(),
				i = 0;
			for ( ; node = this[i]; i++ ) {
				if ( fn.call(node, node, i) ) {
					ret.push( node );
				}
			}
			return ret;
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
