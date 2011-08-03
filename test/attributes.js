module("attributes");

test("getAttr()", function() {
	expect(30);

	equal( minimal('#text1').getAttr('type'), 'text', 'Check for type attribute' );
	equal( minimal('#radio1').getAttr('type'), 'radio', 'Check for type attribute' );
	equal( minimal('#check1').getAttr('type'), 'checkbox', 'Check for type attribute' );
	equal( minimal('#link1').getAttr('rel'), 'nofollow', 'Check for rel attribute' );
	equal( minimal('#link1').getAttr('title'), 'test', 'Check for title attribute' );
	equal( minimal('#mark').getAttr('hreflang'), 'en', 'Check for hreflang attribute' );
	equal( minimal('#en').getAttr('lang'), 'en', 'Check for lang attribute' );
	equal( minimal('#simon').getAttr('class'), 'blog link', 'Check for class attribute' );
	equal( minimal('#name').getAttr('name'), 'name', 'Check for name attribute' );
	equal( minimal('#action').getAttr('name'), 'action', 'Check for name attribute' );
	equal( minimal('#form1').getAttr('action'), '#', 'Check for action attribute' );

	equal( minimal('#text1').setAttr('value', 't').getAttr('value'), 't', 'Check setting the value attribute' );
	equal( minimal( document.createElement('div') ).setAttr('value', 't').getAttr('value'), 't', 'Check setting custom attr named "value" on a div' );

	// Crazy form stuff with input names equal to form attributes
	equal( minimal("#form1").setAttr('blah', 'blah').getAttr('blah'), 'blah', 'Set non-existant attribute on a form' );
	equal( minimal('#foo').getAttr('height'), null, 'Non existent height attribute should return null' );
	equal( minimal('#form1').setAttr('action','newformaction').getAttr('action'), 'newformaction', 'Check that action attribute was changed' );
	equal( minimal('#form1').getAttr('target'), null, 'Retrieving target does not equal the input with name=target' );
	equal( minimal('#form1').setAttr('target', 'newTarget').getAttr('target'), 'newTarget', 'Set target successfully on a form' );
	equal( minimal('#form1').removeAttr('id').getAttr('id'), null, 'Retrieving id does not equal the input with name=id after id is removed' );
	equal( minimal('#form1').getAttr('name'), null, 'Retrieving name does not retrieve input with name=name' );
	
	equal( minimal('#text1').getAttr('maxlength'), '30', 'Check for maxlength attribute' );

	var body = document.body, $body = minimal(body);
	strictEqual( $body.getAttr('foo'), null, 'Make sure that a non existent attribute returns null' );

	equal( minimal('#logo').getAttr('width'), '10', 'Retrieve width attribute an an element with display:none.' );
	equal( minimal('#logo').getAttr('height'), '12', 'Retrieve height attribute an an element with display:none.' );

	// Value should retrieve value attribute on buttons
	equal( minimal('#button1').getAttr('value'), 'foobar', 'Value retrieval on a button does not return innerHTML' );

	equal( minimal('#table1').setAttr('test:attrib', 'foobar').getAttr('test:attrib'), 'foobar', 'Setting an attribute on a table with a colon does not throw an error.' );

	QUnit.reset();
	equal( minimal('#form1').getAttr('class'), 'classOnForm', 'Retrieve the class attribute on a form.' );

	equal( minimal('#mark').getAttr('onclick'), 'something()', 'Retrieve ^on attribute without anonymous function wrapper.' );

	equal( minimal().getAttr("doesntexist"), null, "Make sure null is returned when no element is there." );

	strictEqual( minimal('#firstp').getAttr('nonexisting'), null, 'getAttr works correctly for non existing attributes' );
});


test("setAttr()", function() {
	expect(17);

	var div = minimal('div').setAttr('foo', 'bar'),
		fail = false;

	for ( var i = 0; i < div.length; i++ ) {
		if ( div[ i ].getAttribute('foo') !== 'bar' ){
			fail = i;
			break;
		}
	}

	equal( fail, false, 'Set Attribute, the #' + fail + ' element didn\'t get the attribute "foo"' );

	ok( minimal('#foo').setAttr('width', null), 'Try to set an attribute to nothing' );

	minimal('#name').setAttr('name', 'something');
	equal( minimal('#name').getAttr('name'), 'something', 'Set name attribute' );

	minimal('#name').setAttr('maxlength', '5');
	equal( document.getElementById('name').maxLength, 5, 'Set maxlength attribute' );
	minimal('#name').setAttr('maxLength', '10');
	equal( document.getElementById('name').maxLength, 10, 'Set maxlength attribute' );

	equal( minimal('#text1').setAttr('aria-disabled', false).getAttr('aria-disabled'), 'false', 'Set aria attribute to string');

	minimal('#foo').setAttr('contenteditable', true);
	equal( minimal('#foo').getAttr('contenteditable'), 'true', 'Enumerated attributes are set properly' );

	var attributeNode = document.createAttribute('irrelevant'),
		commentNode = document.createComment('some comment'),
		textNode = document.createTextNode('some text');
	
	minimal.each([commentNode, textNode, attributeNode], function( i, elem ) {
		var $elem = minimal( elem );
		$elem.setAttr( 'nonexisting', 'foo' );
		strictEqual( $elem.getAttr('nonexisting'), undefined, 'setAttr works correctly on comment and text nodes' );
	});


	var table = minimal('#table1'),
		td = minimal('td', table).first();
	td.setAttr('rowspan', '2');
	equal( td[0].rowSpan, 2, 'Check rowspan is correctly set' );
	td.setAttr('colspan', '2');
	equal( td[0].colSpan, 2, 'Check colspan is correctly set' );
	table.setAttr('cellspacing', '2');
	equal( table[0].cellSpacing, '2', 'Check cellspacing is correctly set' );

	equal( minimal('#area1').getAttr('value'), 'foobar', 'Value attribute retrieves the attributes, not the property.' );


	minimal('#name').setAttr('someAttr', '0');
	equal( minimal('#name').getAttr('someAttr'), '0', 'Set attribute to a string of "0"' );
	minimal('#name').setAttr('someAttr', 0);
	equal( minimal('#name').getAttr('someAttr'), '0', 'Set attribute to the number 0' );
	minimal('#name').setAttr('someAttr', 1);
	equal( minimal('#name').getAttr('someAttr'), '1', 'Set attribute to the number 1' );
});

test("removeAttr()", function() {
	expect(5);
	equal( minimal('#mark').removeAttr( 'class' )[0].className, '', 'remove class' );
	equal( minimal('#form1').removeAttr('id').getAttr('id'), null, 'Remove id' );
	minimal('#foo, #table1, #text1').each(function( node ) {
		var $node = minimal( node ).removeAttr('id');
		equal( $node.getAttr('id'), null, 'Remove id' );
	});
});