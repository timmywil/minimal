module('classes');

test('addClass()', function() {
	expect(8);

	var div = minimal('div');
	div.addClass('test');
	var pass = true;
	for ( var i = 0; i < div.length; i++ ) {
		if ( !~div[i].className.indexOf('test') ) {
			pass = false;
		}
	}
	ok( pass, 'Add Class' );

	div = minimal( document.createElement('div') );

	div.addClass('test');
	equals( div.getAttr('class'), 'test', 'Make sure there\'s no extra whitespace.' );

	div.setAttr('class', ' foo');
	div.addClass('test');
	equals( div.getAttr('class'), 'foo test', 'Make sure there\'s no extra whitespace.' );

	div.setAttr('class', 'foo');
	div.addClass('bar baz');
	equals( div.getAttr('class'), 'foo bar baz', 'Make sure there isn\'t too much trimming.' );
	
	div.removeClass();
	div.addClass('foo').addClass('foo');
	equal( div.getAttr('class'), 'foo', 'Do not add the same class twice in separate calls.' );

	div.addClass('fo');
	equal( div.getAttr('class'), 'foo fo', 'Adding a similar class does not get interrupted.' );
	div.removeClass().addClass('wrap2');
	ok( div.addClass('wrap').hasClass('wrap'), 'Can add similarly named classes');

	div.removeClass();
	div.addClass('bar bar');
	equal( div.getAttr('class'), 'bar', 'Do not add the same class twice in the same call.' );
});

test('removeClass()', function() {
	expect(7);

	var $divs = minimal('div');

	$divs.addClass('test').removeClass('test');

	ok( !$divs.hasClass('test'), 'Remove Class' );

	QUnit.reset();
	$divs = minimal('div');

	$divs.addClass('test').addClass('foo').addClass('bar');
	$divs.removeClass('test').removeClass('bar').removeClass('foo');

	ok( !$divs.hasClass('test'), 'Remove multiple classes' );
	ok( !$divs.hasClass('bar'), 'Remove multiple classes' );
	ok( !$divs.hasClass('foo'), 'Remove multiple classes' );

	QUnit.reset();
	$divs = minimal('div');

	$divs.first().addClass('test').removeClass('');
	ok( $divs.first().hasClass('test'), 'Empty string passed to removeClass' );

	var div = document.createElement('div');
	div.className = ' test foo ';

	minimal(div).removeClass('foo');
	equal( div.className, 'test', 'Make sure remaining className is trimmed.' );

	div.className = ' test ';

	minimal(div).removeClass('test');
	equal( div.className, '', 'Make sure there is nothing left after everything is removed.' );
});

test('toggleClass()', function() {
	expect(6);

	var e = minimal('#firstp');
	ok( !e.hasClass('test'), 'Assert class not present' );
	e.toggleClass('test');
	ok( e.hasClass('test'), 'Assert class present' );
	e.toggleClass('test');
	ok( !e.hasClass('test'), 'Assert class not present' );

	// multiple class names
	e.addClass('testA testB');
	ok( e.hasClass('testA testB'), 'Assert 2 different classes present' );
	e.toggleClass('testA testB');
	ok( !e.hasClass('testA'), 'Assert testA has been removed' );
	ok( !e.hasClass('testB'), 'Assert testB has been removed' );
});

test('addClass(), removeClass(), hasClass()', function() {
	expect(13);
	var elem = document.createElement('p'),
		$elem = minimal( elem );

	$elem.addClass('hi');
	equals( elem.className, 'hi', 'Check single added class' );

	$elem.addClass('foo bar');
	equals( elem.className, 'hi foo bar', 'Check more added classes' );

	$elem.removeClass();
	equals( elem.className, '', 'Remove all classes' );

	$elem.addClass('hi foo bar');
	$elem.removeClass('foo');
	equals( elem.className, 'hi bar', 'Check removal of one class' );

	ok( $elem.hasClass('hi'), 'Check has1' );
	ok( $elem.hasClass('bar'), 'Check has2' );

	elem.className = 'class1 cla.ss3 class4';
	ok( $elem.hasClass('class1'), 'Check hasClass with dot' );
	ok( $elem.hasClass('cla.ss3'), 'Check hasClass with dot' );
	ok( $elem.hasClass('class4'), 'Check hasClass with dot' );

	$elem.removeClass('class2');
	ok( !$elem.hasClass('class2'), 'Check the class has been properly removed' );
	$elem.removeClass('cla');
	ok( $elem.hasClass('cla.ss3'), 'Check the dotted class has not been removed' );
	$elem.removeClass('cla.ss3');
	ok( !$elem.hasClass('cla.ss3'), 'Check the dotted class has been removed' );
	$elem.removeClass('class4');
	ok( !$elem.hasClass('class4'), 'Check the class has been properly removed' );
});