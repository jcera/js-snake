// just a shim
//smoother/smarter way of creating a game-loop
if ( !window.requestAnimationFrame ) {
	window.requestAnimationFrame = ( function() {
		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback) {
			//gameloop fallbacks to 60fps
			window.setTimeout( callback, 1000 / 60 );
		};
	} )();
}
