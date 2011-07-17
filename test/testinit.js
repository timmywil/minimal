/**
 * Returns an array of elements with the given IDs
 * @example q("qunit-fixture", "foo", "bar")
 * @return {Array} An array of selected elements
 */
var q = function() {
	var r = [];

	for ( var i = 0; i < arguments.length; i++ ) {
		r.push( document.getElementById( arguments[i] ) );
	}

	return r;
};

/**
 * Asserts that a select matches the given IDs
 * Runs two tests for both queryAll and query
 * @param {String} a - description of test
 * @param {String} b - queryAll selector
 * @param {Array} c - list of ids for the elements that should be retrieved
 * @example t("Check for foo", "#foo", ["foo"]);
 */
var t = function( a, b, c ) {
	var i = q.apply( q, b );
	deepEqual( queryAll( a ), i, c + " (" + a + ")" );
	deepEqual( query( a ), i[0], c + " with query (" + a + ")" );
};

(function() {
	// Run tests in noConflict mode
	minimal.noConflict();
})();