module("queryAll");

test("ID", function() {
	expect(6);
	t( '#foo', [ 'foo' ], 'Checks for a single element' );
	t( '#child', [ 'child' ], '#child is found' );
	t( '#foo, #child, #parent', [ 'foo', 'child', 'parent' ], 'Checks IDs split by commas' );
});

test("TAGS", function() {
	expect(3);
	t( 'ul', [ 'unorderedList' ], 'Tag selection' );
	equal( queryAll('div').length, document.getElementsByTagName('div').length, 'Retrieve all divs' );
});

test("CLASS", function() {
	expect(6);
	t( '.list', [ 'listOne', 'listTwo', 'listThree', 'listFiveDiv' ], 'Checks class selector' );
	t( 'li.list', [ 'listOne', 'listTwo', 'listThree' ], 'Checks tag.class selector' );
	t( 'div.list', [ 'listFiveDiv' ], 'Checks tag.class selector' );
});

test("Rooted Selections", function() {
	expect(3);
	equal( queryAll('div', '#parent')[0].id, 'child', '#parent passed as root for child div' );
	var ul = q('unorderedList')[0];
	equal( queryAll('.list', ul).length, q('listOne', 'listTwo', 'listThree').length, 'Select elements with given class only within ul root' );
	var table = minimal('#table1');
	ok( queryAll('td', table).length, 'Passing a minimal object as the context does not throw an error' );
});

test("Invalid", function() {
	expect(5);

	try {
		queryAll('#parent #child');
	} catch( e ) {
		ok( true, e );
	}

	try {
		queryAll('div ul');
	} catch( e ) {
		ok( true, e );
	}

	try {
		queryAll('ul li.list')
	} catch( e ) {
		ok( true, e );
	}

	try {
		queryAll('#child:last-child')
	} catch( e ) {
		ok( true, e );
	}

	try {
		queryAll('input[type="text"]')
	} catch( e ) {
		ok( true, e );
	}
});
