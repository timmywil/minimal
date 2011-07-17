module("core");

test("noConflict()", function() {
	expect(5);

	var $$ = minimal;
	var q = query;
	var qa = queryAll;

	notEqual( window.$, window.minimal, 'Tests are running in noConflict mode' );

	minimal.noConflict( true );
	equal( query, undefined, 'noConflict called to remove query from global object' );
	equal( queryAll, undefined, 'noConflict called to remove queryAll from global object' );

	var m = minimal.noConflict( true, true );
	equal( minimal, undefined, 'noConflict deep removes minimal from window' );
	equal( m, $$, 'noConflict returns minimal' );

	minimal = $$;
	query = q;
	queryAll = qa;
});

test("Constructor", function() {
	expect(8);

	// Constructor behavior
	equal( minimal().length, 0, 'minimal() === minimal([])' );
	equal( minimal([]).length, 0, 'minimal([])' );
	equal( minimal(undefined).length, 0, 'minimal(undefined) === minimal([])' );
	equal( minimal(null).length, 0, 'minimal(null) === minimal([])' );
	equal( minimal('').length, 0, 'minimal("") === minimal([])' );
	
	ok( minimal('#foo') instanceof minimal, 'Self instantiated' );
	equal( minimal('div.list').length, 1, 'Length property' );
	equal( minimal('.list').length, 4, 'Multiple objects' );
});

test("minimal.trim()", function() {
	expect(4);

	var nbsp = String.fromCharCode(160);

	equal( minimal.trim('hello  '), 'hello', 'trailing space' );
	equal( minimal.trim('  hello'), 'hello', 'leading space' );
	equal( minimal.trim('  hello   '), 'hello', 'space on both sides' );
	equal( minimal.trim('  ' + nbsp + 'hello  ' + nbsp + ' '), 'hello', '&nbsp;' );

});

test("toArray()", function() {
	expect(8);
	deepEqual( minimal('p', '#container').toArray(), q('firstp', 'sndp', 'en', 'sap', 'lastp'), 'Convert minimal object to an Array' )
	ok( minimal.toArray( document.getElementsByTagName('div') ) instanceof Array, 'Convert nodelist to array' );

	equal( minimal.toArray( minimal('head') )[0].nodeName.toUpperCase(), 'HEAD', 'Pass toArray a minimal object' );

	equal( minimal.toArray( document.getElementsByTagName('ul') ).slice( 0, 1 )[ 0 ].id, 'unorderedList', 'Pass toArray a nodelist' );

	equal( (function(){ return minimal.toArray(arguments); })(1,2).join(''), '12', 'Pass toArray an arguments array' );

	equal( minimal.toArray([1,2,3]).join(''), '123', 'Pass toArray a real array' );

	equal( minimal.toArray({ length: 2, 0: 'a', 1: 'b' }).join(''), 'ab', 'Pass toArray an array like map (with length)' );

	ok( !!minimal.toArray( document.documentElement.childNodes ).slice(0,1)[0].nodeName, 'Pass toArray a childNodes array' );
});

// Test both each and forEach
var testEach = function() {
	minimal.each.apply( null, arguments );
	minimal.forEach.apply( null, arguments );
};

test('minimal.each', function() {
	expect(19);

	testEach([ 0, 1, 2 ], function( n, i ) {
		equal( i, n, 'Check array iteration' );
	});

	testEach([ 5, 6, 7 ], function( n, i ) {
		equal( n - 5, i, 'Check array iteration' );
	});

	testEach({ name: 'name', lang: 'lang' }, function( n, i ) {
		equal( n, i, 'Check object iteration' );
	});

	var total = 0;
	testEach([ 1, 2, 3 ], function( v ) { total += v; });
	equal( total, 12, 'Looping over an array' );
	total = 0;
	testEach({ 'a' : 1, 'b' : 2, 'c' : 3 }, function( v ) { total += v; });
	equal( total, 12, 'Looping over an object' );

	var stylesheet_count = 0;
	testEach(document.styleSheets, function( i ) {
		stylesheet_count++;
	});
	equal(stylesheet_count, 2, 'should not throw an error in IE while looping over document.styleSheets and return proper amount');
});
