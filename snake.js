var canvas,
	context,
	Game, 
	Snake,
	Food,
	Direction;

canvas = document.createElement( 'canvas' );
canvas.width = 500;
canvas.height = 500;
context = canvas.getContext( '2d' );
document.body.appendChild( canvas );

Game = {
	clearMap: function () {
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
};


Snake = {

	segmentSize: 10,

	segmentCount: 5,

	segments: [],

	direction: Direction.RIGHT,

	head : function () {
		return this.segments[0];
	},

	fillSegment : function (segment) {
		context.fillStyle = '#FF0000';
		context.fillRect(segment.x * this.segmentSize, segment.y * this.segmentSize, this.segmentSize, this.segmentSize);
	},

	getNextHead : function (direction) {
		var x = this.head().x;
		var y = this.head().y;
		switch (this.direction) {
			case Direction.RIGHT:
				x++;
				break;
			case Direction.LEFT:
				x--;
				break;
			case Direction.UP:
				y--;
				break;
			case Direction.DOWN:
				y++
				break;
			default:
				break;
		};
		return {x: x, y: y};
	},

	/*
	*	updates the values of snake such as direction, etc etc. according to user-input
	*/
	update : function () {
		var nextHead = this.getNextHead(this.direction);
		var tail = this.segments.pop();
		tail.x = nextHead.x;
		tail.y = nextHead.y;
		this.segments.unshift(tail);
	},

	/*
	*	draws the snake using the updated values
	*/
	draw : function () {
		for (var i = this.segments.length - 1; i >= 0; i--) {
			this.fillSegment(this.segments[i]);
		};
	},

	init : function () {
		for (var i = this.segmentCount - 1; i >= 0; i--) {
			this.segments.push({x: i, y: 0});
		};
	}

};

var registerKeyListeners = function() {
	document.addEventListener('keydown', function(e) {
		if (32 === e.keyCode) {
			clearTimeout(timeOutId);
		}
		switch (e.keyCode) {
			case Direction.LEFT:
				if (Snake.direction === Direction.RIGHT) {
					break;
				}
				Snake.direction = Direction.LEFT;
				break;
			case Direction.RIGHT:
				if (Snake.direction === Direction.LEFT) {
					break;
				}
				Snake.direction = Direction.RIGHT;
				break;
			case Direction.UP:
				if (Snake.direction === Direction.DOWN) {
					break;
				}
				Snake.direction = Direction.UP;
				break;
			case Direction.DOWN:
				if (Snake.direction === Direction.UP) {
					break;
				}
				Snake.direction = Direction.DOWN;
				break;
			default:
				console.log('taena');
				break;
		};
	}, false);
};

var fps = 5;
var gameLoop = function() {
	setTimeout(function () {
		requestAnimationFrame(gameLoop);

		Game.clearMap();
		Snake.update();
		Snake.draw();

	}, 1000 / fps);
};

registerKeyListeners();
Snake.init();
gameLoop();