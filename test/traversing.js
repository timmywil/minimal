module("traversing");

test("slice()", function() {
	expect(2);
	deepEqual( minimal('.list').slice(1, 3).toArray(), q('listTwo', 'listThree'), 'Slice correctly slices selection' );
	deepEqual( minimal('.list').slice(-1).toArray(), q('listFiveDiv'), 'Negative index retrieves last element' );
});

test("first()", function() {
	expect(1);
	deepEqual( minimal('.list').first().toArray(), q('listOne'), 'First correctly retrieves the first' );
});

test("eq()", function() {
	expect(2);
	deepEqual( minimal('.list').eq(2).toArray(), q('listThree'), 'EQ correctly retreives zero-indexed element' );
	deepEqual( minimal('.list').eq(-1).toArray(), q('listFiveDiv'), 'EQ correctly retreives zero-indexed element with -1' );
});

test("find()", function() {
	expect(7);

	var $list = minimal('#unorderedList');
	deepEqual( $list.find('.list').toArray(), q('listOne', 'listTwo', 'listThree'), 'Find the list items within one ul' );
	deepEqual( $list.find('li').toArray(), q('listOne', 'listTwo', 'listThree', 'listFour'), 'Find all lis within the ul' );
	deepEqual( $list.find('#listOne').toArray(), q('listOne'), 'Finding with ID is ok' );
	deepEqual( $list.find('notthere').toArray(), [], 'No elements found' );
	deepEqual( $list.find( undefined ).toArray(), [], 'Passing undefined' );
	equal( minimal('#table1').find('tr').length, 3, 'trs within a table' );

	deepEqual( minimal('#container, #foo').find('p').toArray(), q('firstp', 'sndp', 'en', 'sap', 'lastp'), 'Find all p\'s within container and foo. Remove dups.' );
});

test("filter()", function() {
	expect(11);

	var $list = minimal('.list');
	var $filtered = $list.filter(function( node, i ) {
		deepEqual( this, node, 'Context is set to the node and node is passed as the first argument' );
		equal( typeof i, 'number', 'index is passed as second argument' );
		return this.id === 'listFiveDiv';
	});
	deepEqual( $filtered.toArray(), q('listFiveDiv'), '.list elements properly filtered to contain only the #listFiveDiv' );

	$filtered = $list.filter(function( node, i ) {
		return node.id !== 'listFiveDiv' && i !== 1;
	});

	deepEqual( $filtered.toArray(), q('listOne', 'listThree'), '.list elements filtered to contain 1, 3, and 4');

	$filtered = minimal('input', '#container').filter(function() {
		return this.type === 'checkbox';
	});
	deepEqual( $filtered.toArray(), q('check1'), 'Filter inputs by type to get the checkbox');
});
