minimal.js v0.2
================

The #1 priority for minimal is ___FAST___.  #2 is ___small___ (currently 6.6k minified/2.7k gzipped).

With these priorities in mind, users should have at least an intermediate understanding of javascript.  minimal will not keep you safe, but it will keep you speedy.

### Supported browsers: IE6+, Firefox 3.0+, Chrome, Safari, Opera, blahblah

## About this repo

There is no makefile because minimal.js is just one file. All of the testing you'd expect is in the test folder along with a benchmark page that looks just like jsperf.  All tests should be run with a local server, but a simple static server will do (until ajax is added).


DOCS
================

## Selector

The minimal selector engine supports a limited set of selectors for the sake of performance. Because of this, it is the fastest selector engine around, but it does not support css3 selectors. (benchmarks in the repo and on [jsperf](http://jsperf.com/qwery-vs-sizzle/11))

Supported selector types, in order of performance, include:

- ID
- tag
- class
- tag.class
- multiple selectors separated by commas
- context (performance depends on scope and main selector type)
	+ Supported context types
		* Any selector type supported
		* An individual element
		* A minimal object
- and that's it!



###Notes

- Although descendants are not supported, passing a context can actually improve performance by limiting the scope of the selection.<br> e.g. `$('div', '#parent')`
- When passing a context, the main selector should not be an ID. e.g. `$('#child', '#parent')` as IDs should be unique. Minimal does not hide this error.


###queryAll( selector, context )

The minimal selector engine. It is exposed to the global object( and can be removed from it with the noConflict function below ), but is convenient for doing your own selections without needing minimal's prototype.

`@return An Array object of elements`

	queryAll('#foo')  ==> [ <div id="foo"></div> ]
	queryAll('.list') ==> [ <li class="list"></li>, <li class="list"></li> ]
	queryAll('div')   ==> [ <div id="container"></div>, <div id="foo"></div> ]

###query( selector, context )

This function uses queryAll and simply returns the first matched element so that you don't have to do `queryAll('div')[0]`

	query('#foo')  ==> Element with id foo
	query('.list') ==> First element with class 'list'
	query('div')   ==> First div


###minimal.noConflict( query, deep)

For responsible infection of the global namespace, this function is provided to clear away unwanted global variables. Minimal exposes itself as window.minimal and as window.$.  The dollar sign is used in several other libraries and should only be assigned to one of those libraries if there are multiple included on the page.  jQuery, Dojo, and any other library will provide a similar function to clear away your global namespace.

- `@param {Boolean} query` - Restore window.query & window.queryAll to previous values
- `@param {Boolean} deep` - Restore window.minimal
- `@return {Object}` Returns minimal

#
	var min = minimal.noConflict( true, true );

##Core

These are the main utility functions offered in minimal.

###minimal.each( obj, fn, context ) & .each( fn, context )

Largely based off [underscore.js](http://documentcloud.github.com/underscore/), this each uses the forEach for both arrays and objects when available, then provides fallbacks that should work the same way. Unlike jQuery, returning false does not stop the iteration. Native forEach does not support this so it did not seem appropriate to provide that in the fallbacks.

`@param context`: functions can be run in any context.  If no context is provided, the iterators run in the context of the `obj`.

`minimal.each()` is also on the prototype and the context for those iterators is the current minimal object.

___Note___: The iterator function is passed arguments in the order of value then key. This differs from jQuery in that the element or object value is the first argument rather than the index.

	$('li').each(function( li, key ) {
		console.log( 'At index: %d, ID is: %s', key, li.id );
	});


###minimal.merge( one, two ) & .merge( two ) & minimal.extend( one, two )

`merge` has a sister named `extend` and instead of both functions doing only slightly different things for both arrays and objects, merge and extend do exactly the same thing but merge is for arrays (or minimal objects because they contain a .length property) and `extend` is for objects.

	minimal.merge([], [1, 2, 3, 4, 5]) ==> [1, 2, 3, 4, 5]
	minimal.merge([1, 2], [3, 4])      ==> [3, 4] // Notice 1 and 2 were overwritten because they were at the same indices.
	minimal('.list').merge( minimal('#foo') ) ==> [ <div id="foo"></div>, <li id="listTwo" class="list"></li>, <li id="listThree" class="list"></li> ]

	var opts = {
		'default': 'option'
	};
	minimal.extend(opts, {
		'default': 'newOption',
		'a': 2
	});


###minimal.indexOf( array, searchElement[, fromIndex]) & .indexOf( searchElement[, fromIndex])

This uses the native [`Array.prototype.indexOf`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf) if available and works the same way. If the given searchElement is in the array (or current minimal object), the index of that element will be returned, otherwise -1.


###minimal.trim( str )

This will use the native [`String.prototype.trim`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/trim) if available and works the same way. It removes whitespace from both ends of a string.

	minimal.trim('     blar      ') ==> 'blar'


###minimal.toArray( nodeList ) & .toArray()

This is only used as a quick way to convert a NodeList to a proper Array for manipulation in the minimal object.  This method is exposed for your convenience, but should not be used for converting anything and everything to an array. Normally, [`Array.prototype.slice`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/slice) works fine for that, but IE cannot convert NodeLists with `slice`.

	minimal('.list').toArray() // is the same as queryAll('.list') but can be convenient when chaining
	minimal.toArray( getElementsByTagName('div') );



##Classes

Class manipulation is one of the most important things in javascript. All of the normal class methods are included in minimal, and obviously they are small and fast. All of these methods are included on the minimal object for per-node manipulation as well as on the minimal prototype.

###.addClass( classStr )

	$('#foo').addClass('bar');
	minimal.addClass( elem, 'bar' );

###.removeClass( classStr )

	$('#foo').removeClass('bar');
	$('#foo').removeClass(); // Removes all classes
	minimal.removeClass( elem ); // Removes all classes on the given element

###.toggleClass( classStr )

	$('.baz').toggleClass('test');
	minimal.toggleClass( elem, 'test' );

###.hasClass( classStr )

`@return {Boolean}`

	$('.test').hasClass('test'); // Returns true


##Attributes

When writing minimal, I rethought how we should treat attributes. IE is terrible at keeping attributes and properties separate, but modern browsers handle it with grace and ease. However, IE can handle things quite well if the DOM level 2 functions are used. I think you'll be surprised at how short and powerful minimal's attribute engine has turned out.

Keep in mind, this engine is not for those who do not understand the difference between attributes and properties. For instance, do not use get/setAttr for checking a checkbox with javascript.  You should already know that the `checked` attribute corresponds to the `defaultChecked` property and not the `checked` property.  [Boolean attributes](http://www.w3.org/TR/html4/intro/sgmltut.html#h-3.3.4.2) store initial or default values, while it is the properties that stay up-to-date with current values.  Manipulating attributes is necessary and powerful, but property manipulation is often the right way to go, and when it comes to minimal, no methods are needed for that. You'll be flying high with raw javascript properties.

###Notes

- All values for attributes are strings
- No hook is provided for the `style` attribute. Use the `elem.style.cssText` property instead.
- The `value` attribute only stores the `defaultValue`, but can be used to see if an input has changed its value since page-load.
- Setting a boolean attribute to `false` does not remove it for you. Set the property instead.
- Some attributes that look like boolean attributes are actually [enumerated attributes](http://www.w3.org/TR/html5/author/common-microsyntaxes.html#enumerated-attribute), which means their values are the strings `'true'` and `'false'` rather than booleans `true` and `false` (e.g. `contenteditable`, `aria-*`, `data-*`, `autocomplete`, `draggable`).  A full list of [boolean attributes](http://www.w3.org/TR/html4/intro/sgmltut.html#h-3.3.4.2) is collected on my <a href="http://www.timmywillison.com/2011/When-to-use-.attr()-and-.prop().html">blog</a>.

#
###.getAttr( name )

	$('#anchor1').getAttr('title');
	$('#anchor1').getAttr('href');
	$('a').getAttr('rel'); // Returns the rel of the first anchor in the matched set
	$('#input1').getAttr('type');


###.setAttr( name, value )

	$('#anchor1').setAttr('title', 'weeeeeeeee');
	$('#foo').setAttr('contenteditable', true); // contenteditable is enumerated


###.removeAttr( name )

	$('#anchor1').removeAttr('title');



##CSS

As you know, IE does computed CSS differently than other browsers. minimal has a powerful CSS engine that matches the consistency of major libraries, but instead of having one big slow method, minimal has a getter method that varies depending on browser support of `getComputedStyle`.  This method can handle pretty much anything you throw at it and, when appropriate, will give you consistent pixel values across browsers where it might normally return a percentage, `em`, or some other unit.


###Notes

- To retrieve computed `width` or `height` on a hidden element, the user must swap `display: none` with `visibility: hidden; position: absolute; display: block` themselves rather than relying on the minimal library to do it for them. This will make for faster code and a smaller javascript library.

#
###.getCSS( name )

As with the `.getAttr()` method, `.getCSS()` will return the value for the first node in the minimal object.

	// Retrieve the computed top of an element
	$('#foo').getCSS('top');
	
	// Retrieve a computed float value
	$('#foo').getCSS('float');
	
	// Retrieve computed width on the first image
	$('img').getCSS('width');
	
	// Opacity support for filters in IE (returns a string just like default browser behavior)
	$('#foo').getCSS('opacity');


###.setCSS( name, value )

It is faster to use `node.style` when _setting_ your styles. A `.setCSS()` method is provide to allow manipulating minimal objects without needing to break a chain. It also normalizes the `opacity` and `float` properties across browsers, but other than those two properties (or unless setting on multiple elements), setting with `node.style` is the best option in terms of performance.

	// Set the float style property
	$('#foo').setCSS('float', 'left');
	
	// Set the display on multiple images
	$('img').setCSS('display', 'block');
	
	// Opacity set with filters in IE
	// Can be passed a number, but browsers return strings when getting
	$('#foo').setCSS('opacity', 0.4);



##Window and Document Dimensions

The window and document require special treatment when retrieving width/height on them. Instead of including this code in getCSS, minimal has two methods for specifically retrieving these values. __Note:__ These functions are not on the prototype


###minimal.getWinDimension( name )

	// Retrieve the window width
	$.getWinDimension('width');
	
	// Retrieve the window height
	$.getWinDimension('height');

###minimal.getDocDimension( name )

	// Retrieve the document width
	$.getDocDimension('width');
	
	// Retrieve the document height
	$.getDocDimension('height');


##Traversing

minimal offers a few of the quickest traversing functions so that the minimal object can be manipulated to contain the elements you want without having to break your chain.  These are the methods currently offered:


###.find( selector )

Find can be even more useful than a context selection, but may not always be as fast.  It will not add any element to the minimal object that is already there and your selections are always scoped which will mean improved performance _if_ the main selector is not an ID.  Since IDs should be unique to a page (and there really are no exceptions to this), they should simply be passed to getElementById without a context.

	// Finds all table rows within all tables
	$('table').find('tr');
	
	// This will work so that you don't have to break the chain, but in terms of performance,
	// because ids should be unique on a page, is one check slower than creating a new minimal object
	$('#parent').find('#child');
	
	// If starting a completely new selection and the parent is being selected with an ID,
	// this is faster than find because there's no need to check for duplicates
	$('.list', '#parent');


###.filter( filterFunction )

The `.filter()` method is a quick way to reduce the current set of elements based off any criteria you supply. Instead of passing a selector that must be parsed and matched against the existing elements, you control what criteria to filter the elements with.  This function can also be used as the equivalent of a `.not()` function (just return the opposite value in your qualifying function).

The qualifying `filterFunction` is passed the `node` and `index` of the node in the matched set in that order and is executed in the context of the `node`.

	// Get the alternating set of list elements
	$('li', '#unorderedList').filter(function( node, index ) {
		return index % 2 === 0;
	});
	
	// The reverse of the previous example
	$('li', '#unorderedList').filter(function( node, index ) {
		return index % 2 !== 0;
	});
	
	// Filter inputs by type
	$('input').filter(function() {
		return this.type === 'checkbox';
	});
	
	// Get all inputs that are not of type image
	$('input').filter(function() {
		return this.type !== 'image';
	});

###.slice( start, end )

Indices are _zero-indexed_ integers. Indexes work the same as [`Array.prototype.slice`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/slice).

	// Retrieves the first five div elements
	$('div').slice(0, 4);
	
	// Retrieves the last row in a table
	$('tr').slice( -1 );


###.eq( index )

Also _zero-indexed_, this will return a minimal object containing the element at that index in the object.

	// Returns a minimal object with the first element
	$('div').eq( 0 );
	
	// Returns a minimal object with the last element
	$('div').eq( -1 );
	
	// Third element
	$('div').eq( 2 );


###.first()

This is the same as `.eq(0)` or `.slice(0, 1)`.



##Events

Events are common enough that they are needed in a minimalistic library. Events are bound using best-practices, but no fake bubbling, delegation handling( such as for live events ), nor vast event object normalization is provided.  Nevertheless, if those things are needed, adding that logic yourself on a per-need basis is the best option for this library.

As per usual, all methods in this area are also on the minimal object for per-node binding( e.g. `minimal.on( elem, 'click', fn )` ).

___Note:___ [event.preventDefault](https://developer.mozilla.org/en/DOM/event.preventDefault) and [event.stopPropagation](https://developer.mozilla.org/en/DOM/event.stopPropagation) are normalized for the event object.

###.on( type, fn )

	var doClick = function( e ) {
		e.preventDefault();
		// Do something on click
	};
	$('a').on('click', doClick);
	
	var imgLoad = function( e ) {
		console.log('Image loaded: ', this.src);
	};
	$('img').on('load', imgLoad);

###.off( type, fn )

In order to unbind, the function previously bound is required. This is in line with native browser behavior and simply means that the user defines bound functions without minimal creating unnecessary overhead.

	$('a').off('click', doClick);
	$('img').off('load', imgLoad);


###.fire( type )

Trigger an event on the matched elements.

	$('a').fire('click');
	minimal.fire( elem, 'click' );


##Things that probably won't be added

1. __Animations and effects__
	- There are so many ways to do effects nowadays. I am speaking of the increasing popularity of [css transtions/animations](https://developer.mozilla.org/en/CSS/CSS_transitions).  The only javascript that should be used for those is add/removeClass.<br>
	As for javascript animations, there's the introduction of [requestAnimationFrame](https://developer.mozilla.org/en/DOM/window.mozRequestAnimationFrame) to Webkit and Firefox, and will be supported in IE10 and an upcoming version of Opera. In light of this, I'd like to leave effects out of minimal and let you include exactly the kinds of animation code you want to include. Besides, in terms of minimal, I'm not sure I'd do more than just add [tween.js](https://github.com/sole/tween.js) as a submodule. :)


##Things that may be added in the future

1. A short, cross-browser way to do a simple __ajax__ request.
