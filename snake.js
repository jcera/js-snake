window.requestAnimFrame = (function(){
 		return window.requestAnimationFrame  	||
        	window.webkitRequestAnimationFrame	||
        	window.mozRequestAnimationFrame		||
        	function( callback ){
        		//fallback of 60fps
        		window.setTimeout(callback, 1000 / 60);
        	};
	})();

	var canvas, context, toggle;

	var SNAKE = {
		x: 100,
		y: 250,
		width: 100,
		height: 20
	}

	init();
	animate();

	function init() {
		canvas = document.createElement( 'canvas' );
    	canvas.width = 512;
	    canvas.height = 512;
	    context = canvas.getContext( '2d' );
    	document.body.appendChild( canvas );
	}

	function animate() {
		requestAnimFrame(animate);
		draw();
	}
    
	function draw() {
		var time = new Date().getTime() * 0.002;
	    var x = Math.sin( time ) * 192 + 256;
	    var y = Math.cos( time * 0.9 ) * 192 + 256;
	    toggle = !toggle;

	    context.fillStyle = toggle ? 'rgb(200,200,20)' :  'rgb(20,20,200)';
	    context.beginPath();
	    context.arc( x, y, 10, 0, Math.PI * 2, true );
	    context.closePath();
	    context.fill();
	}
