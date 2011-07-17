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
	expect(1);
	deepEqual( minimal('.list').eq(2).toArray(), q('listThree'), 'EQ correctly retreives zero-indexed element' );
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