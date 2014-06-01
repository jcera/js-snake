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
	})();
}



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



;Game = (function () {

	var ready = false;

	function start () {
		ready = true;
	}

	function stop () {
		ready = false;
	}

	return {
		// initial FPS/Speed of the game
		FPS: 20,

		start: start,

		stop: stop,

		isReady: function isReady () {
			return ready;
		},

		clearMap: function clearMap () {
			context.fillStyle = '#0D0D0D';
			context.strokeStyle = '#000F03';
			for (var x = canvas.width - 1; x >= 0; x--) {
				for (var y = canvas.height - 1; y >= 0; y--) {
					context.fillRect(x * Snake.segmentSize, y * Snake.segmentSize, Snake.segmentSize, Snake.segmentSize);
				    context.lineWidth = .5;
				    context.strokeRect(x * Snake.segmentSize, y * Snake.segmentSize, Snake.segmentSize, Snake.segmentSize);		
				};
			};
		},

		showStartText: function showStartText () {
			context.font = "bold 35px sans-serif";
			context.fillText("Press space bar to start!", canvas.width / Snake.segmentSize, canvas.height / 2);
		},
	};
}());



;Direction = (function () {
	return {
		// keycode mappings for the arrow keys
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
	};
}());



;Food = (function () {

}());



;Snake = (function () {

	//size of a single segment
	var segmentSize = 10;

	//initial size of the snake
	var segmentCount = 5;

	//a queue data struct for the body of the snake
	var segments = [];

	//RIGHT = initial direction of snake
	var direction = Direction.RIGHT;

	var newDirection = Direction.RIGHT;

	var snakeColor = '#FFFFFF';

	function head () {
		return segments[0];
	};

	function fillSegment (segment) {
		context.fillStyle = snakeColor;
		context.fillRect(segment.x * segmentSize, segment.y * segmentSize, segmentSize, segmentSize);				
	};

	function getNextHeadBasedOnDirection () {
		var x = head().x;
		var y = head().y;
		switch (newDirection) {
			case Direction.RIGHT:
				if (direction !== Direction.LEFT) {
					x++;
					direction = newDirection;
				}
				break;
			case Direction.LEFT:
				if (direction != Direction.RIGHT) {
					x--;
					direction = newDirection;
				}
				break;
			case Direction.UP:
				if (direction !== Direction.DOWN) {
					y--;
					direction = newDirection;
				}
				break;
			case Direction.DOWN:
				if (direction !== Direction.UP) {
					y++;
					direction = newDirection;
				}
				break;
			default:
				break;
		};
		return {x: x, y: y};
	};

	function setDirection (keyCode) {
		switch (keyCode) {
			case Direction.RIGHT:
				if (direction !== Direction.LEFT) {
					newDirection = Direction.RIGHT;
				}
				break;
			case Direction.LEFT:
				if (direction != Direction.RIGHT) {
					newDirection = Direction.LEFT;
				}
				break;
			case Direction.UP:
				if (direction !== Direction.DOWN) {
					newDirection = Direction.UP;
				}
				break;
			case Direction.DOWN:
				if (direction !== Direction.UP) {
					newDirection = Direction.DOWN;
				}
				break;
			default:
				break;
		};
	};

	function init () {
		segments = [];
		direction = Direction.RIGHT;
		newDirection = Direction.RIGHT;
		for (var i = segmentCount - 1; i >= 0; i--) {
			segments.push({x: i, y: 0});
		};
	};

	/*
	*	updates the values of snake such as direction, etc etc. 
	* 	according to user-input
	*/
	function update () {
		var nextHead = getNextHeadBasedOnDirection();
		var tail = segments.pop();
		tail.x = nextHead.x;
		tail.y = nextHead.y;
		segments.unshift(tail);
	};

	/*
	*	draws the snake using the updated values
	*/
	function draw () {
		for (var i = segments.length - 1; i >= 0; i--) {
			fillSegment(segments[i]);
		};
	};

	function collided () {
		var nextHead = getNextHeadBasedOnDirection();
		var collided = false;

		//self collision
		for (var i = segments.length - 1; i >= 0; i--) {
			var s = segments[i];
			if (nextHead.x === s.x && nextHead.y === s.y) {
				collided = true;
				break;
			}
		};

		if (nextHead.x * segmentSize > canvas.width - segmentSize || nextHead.x < 0) {
			collided = true;
		}

		if (nextHead.y * segmentSize > canvas.height - segmentSize || nextHead.y < 0) {
			collided = true;
		}


		return collided;
	}

	return {
		update: update,
		draw: draw,
		init: init,
		setDirection: setDirection,
		collided: collided,
		segmentSize: segmentSize
	};

})();




var registerKeyListeners = function() {
	document.addEventListener('keydown', function(e) {
		if (32 === e.keyCode) {
			Game.start();
		}
		Snake.setDirection(e.keyCode);
	}, false);
};



var gameLoop = function() {
	setTimeout(function () {
		var requestId = requestAnimationFrame(gameLoop);
		if (Game.isReady()) {
			Game.clearMap();
			if (Snake.collided()) {
				Game.stop();
			} else {
				Snake.update();
				Snake.draw();
			}
		} else {
			Game.clearMap();
			Snake.init();
			Snake.draw();
			Game.showStartText();
		}
		
	}, 1000 / Game.FPS);
};



registerKeyListeners();
gameLoop();