module("traversing");

test("slice()", function() {
	expect(1);
	deepEqual( minimal('.list').slice(1, 3).toArray(), q('listTwo', 'listThree'), 'Slice correctly slices selection' );
});

test("first()", function() {
	expect(1);
	deepEqual( minimal('.list').first().toArray(), q('listOne'), 'First correctly retrieves the first' );
});

test("eq()", function() {
	expect(1);
	deepEqual( minimal('.list').eq(2).toArray(), q('listThree'), 'EQ correctly retreives zero-indexed element' );
});