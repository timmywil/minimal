minimal.js
================

An experiment.

The #1 priority for minimal is ***FAST***.  #2 is ***small***.

With these priorities in mind, users should have at least an intermediate understanding of javascript.  minimal will not keep you safe, but it will keep you speedy.


## Selector

The minimal selector engine supports a limited set of selectors for the sake of performance. Because of this, it is the fastest selector engine around, but it does not support css3 selectors. (selector benchmarks available in the repo)

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
	queryAll('.list') ==> [ <li class="list"></li>, <li class="list"></li>]
	queryAll('div')   ==> [ <div id="container"></div>, <div id="foo"></div>]

###query( selector, context )

This function uses queryAll and simply returns the first matched element so that you don't have to do `queryAll('div')[0]`

	query('#foo')  ==> Element with id foo
	query('.list') ==> First element with class 'list'
	query('div')   ==> First div


###`minimal.noConflict( query, deep)`

For responsible infection of the global namespace, this function is provided to clear away unwanted global variables. Minimal exposes itself as window.minimal and as window.$.  The dollar sign is used in several other libraries and should only be assigned to one of those libraries if there are multiple included on the page.  jQuery, Dojo, and any other library will provide a similar function to clear away your global namespace.

`@param {Boolean} query` - Restore window.query & window.queryAll to previous values
`@param {Boolean} deep` - Restore window.minimal
`@return {Object}` Returns minimal


##Core

These are the main utility functions offered in minimal.

###`minimal.each( obj, fn, context )` & `.each( fn, context )`

Largely based off underscore.js, this each uses the forEach for both arrays and objects when available, then provides fallbacks that should work the same way. Unlike jQuery, returning false does not stop the iteration. Native forEach does not support this so it did not seem appropriate to provide that in the fallbacks.

`@param context`: functions can be run in any context.  If no context is provided, the iterators run in the context of the `obj`.

`minimal.each()` is also on the prototype and the context for those iterators is the current minimal object.

***Note***: The iterator function is passed arguments in this order. This differs from jQuery in that element or object value is the first argument rather than the index.

	$('li').each(function( li, key ) {
		console.log( 'At index: %d, ID is: %s', key, li.id );
	});


##`minimal.merge( one, two )` & `.merge( two )` & `minimal.extend( one, two )`

`merge` has a sister called `extend` and instead of both functions doing only slightly different things for both arrays and objects, merge and extend do exactly the same thing but merge is for arrays (or minimal objects because they contain a .length proerty) and `extend` is for objects.

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


###`minimal.indexOf( array, searchElement[, fromIndex])` & `.indexOf( searchElement[, fromIndex])`

This uses the native [`Array.prototype.indexOf`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf) if available and works the same way. If the given searchElement is in the array (or current minimal object), the index of that element will be returned, otherwise -1.


###`minimal.trim( str )`

This will use the native [`String.prototype.trim`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/trim) if available and works the same way. It removes whitespace from both ends of a string.

	minimal.trim('     blar      ') ==> 'blar'


###`minimal.toArray( nodeList )` & `.toArray()`

This is only used as a quick way to convert a NodeList to a proper Array for manipulation in the minimal object.  This method is exposed for your convenience, but should not be used for converting anything and anything to an array. Normally, `Array.prototype.slice` works fine for that, but IE cannot convert NodeLists with `slice`.

	minimal('.list').toArray() // is the same as queryAll('.list') but can be convenient when chaining
	minimal.toArray( getElementsByTagName('div') );


##Traversing

minimal offers a few of the quickest traversing functions so that the minimal object can be manipulated to contain the elements you want without having to break your chain.  These are the methods currently offered:

###`.slice( start, end )`


Indices are *zero-indexed* integers. Indexes work the same as [`Array.prototype.slice`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/slice).

	// Retrieves the first five div elements
	$('div').slice(0, 4);
	
	// Retrieves the last row in a table
	$('tr').slice( -1 );

###`.eq( index )`

Also *zero-indexed*, this will return a minimal object containing the element at that index in the object.

	// Returns a minimal object with the first element
	$('div').eq( 0 );
	
	// Returns a minimal object with the last element
	$('div').eq( -1 );
	
	// Third element
	$('div').eq( 2 );

###`.first()`

This is the same as `.eq(0)` or `.slice(0, 1)`.

###`.find( selector )`

Find can be even more useful than a context selection, but may not always be as fast.  It will not add any element to the minimal object that is already there and your selections are always scoped which will mean improved performance *if* the main selector is not an ID.  Since IDs should be unique to a page (and there really are no exceptions to this), they should simply be passed to getElementById without a context.

	// Finds all table rows within all tables
	$('table').find('tr');
	
	// This will work so that you don't have to break the chain, but in terms of performance,
	// because ids should be unique on a page, is one check slower than creating a new minimal object
	$('#parent').find('#child');
	
	// If starting a completely new selection and the parent is being selected with an ID,
	// this is faster than find because there's no need to check for duplicates
	$('.list', '#parent');


***more coming soon***