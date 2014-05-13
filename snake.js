var canvas,
	context,
	Game, 
	Snake,
	Food,
	Direction;

canvas = document.createElement( 'canvas' );
canvas.width = 512;
canvas.height = 512;
context = canvas.getContext( '2d' );
document.body.appendChild( canvas );

Direction = (function () {
	return {
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40
	}
})();


Game = {

};


Snake = {
	segmentSize: 10,
	segments: [{x: canvas.width/2, y: canvas.height/2}],
	direction: {x: 0, y: 0},

	update: function() {
		this.segments[0].x = this.segments[0].x + this.direction.x;
		this.segments[0].y = this.segments[0].y + this.direction.y;
	},

	draw: function() {
		context.fillStyle = '#FF0000';
		context.fillRect(this.segments[0].x, this.segments[0].y, this.segmentSize, this.segmentSize);
	}
};

var initialize = function() {
	Snake.draw();
	registerKeyListeners();
};

var registerKeyListeners = function() {
	document.addEventListener('keydown', function(e) {
		if (32 === e.keyCode) {
			clearTimeout(timeOutId);
		}
		if (Direction.LEFT === e.keyCode) {
			Snake.direction.x = -Snake.segmentSize;
			Snake.direction.y = 0;
			Snake.update();
			Snake.draw();
		}
		if (Direction.RIGHT === e.keyCode) {
			Snake.direction.x = Snake.segmentSize;
			Snake.direction.y = 0;
			Snake.update();
			Snake.draw();
		}
		if (Direction.UP === e.keyCode) {
			Snake.direction.y = -Snake.segmentSize;
			Snake.direction.x = 0;
			Snake.update();
			Snake.draw();
		}	
		if (Direction.DOWN === e.keyCode) {
			Snake.direction.y = Snake.segmentSize;
			Snake.direction.x = 0;
			Snake.update();
			Snake.draw();
		}
	}, false);
};

initialize();