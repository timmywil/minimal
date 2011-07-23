module("css");


test("getCSS()/setCSS()", function() {
	expect(16);

	var $con = minimal('#container');
	equal( $con.getCSS('display'), 'block', 'Check for css property "display"');
	equal( minimal('#logo').getCSS('display'), 'none', 'Display is none on logo' );
	var $foo = minimal('#foo');
	equal( $foo.getCSS('display'), 'block', 'Assert #foo is displayed' );
	equal( $foo.setCSS('display', 'none').getCSS('display'), 'none', 'Assert #foo is hidden' );
	equal( $foo.setCSS('display', '').getCSS('display'), 'block', 'Reset display' );

	equal( parseInt( $con.getCSS('fontSize') ), 16, 'Verify fontSize px set.' );
	equal( parseInt( $con.getCSS('fontSize') ), 16, 'Verify fontSize px set.' );
	$foo.setAttr('class', 'em');
	equal( $foo.getAttr('class'), 'em', 'Verfiy em class set' );
	equal( $foo.getCSS('fontSize'), '32px', 'Verify fontSize em set' );

	$foo.setCSS('width', '100px');
	equal( $foo.getCSS('width'), '100px', 'Set and get width' );
	equal( $con.find('input').setCSS('height', '13px').getCSS('height'), '13px', 'Set and Get height on inputs' );
	$foo.setCSS('height', '100%');
	equal( $foo[0].style.height, '100%', 'Set height to 100%' );

	equal( typeof $foo.getCSS('width'), 'string', 'Make sure that a string width is returned.' );

	var $img = minimal('img').first();
	equal( $img.getCSS('float'), 'none', 'Float starts as none when computed' );
	equal( $img.setCSS('float', 'left').getCSS('float'), 'left', 'Set float style' );
	equal( $img.setCSS('float', '').getCSS('float'), 'none', 'Reset float' );
});

test("getWinDimension()", function() {
	expect(2);
	equal( typeof minimal.getWinDimension('width'), 'number', 'Window dimensions are retrievable' );
	equal( typeof minimal.getWinDimension('height'), 'number', 'Window dimensions are retrievable' );
});

test("getDocDimensions()", function() {
	expect(2);
	equal( typeof minimal.getDocDimension('width'), 'number', 'Window dimensions are retrievable' );
	equal( typeof minimal.getDocDimension('height'), 'number', 'Window dimensions are retrievable' );
});