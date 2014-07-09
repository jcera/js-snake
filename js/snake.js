if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function() {
        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                //gameloop fallbacks to 60fps
                window.setTimeout(callback, 1000 / 60);
            };
    })();
}

(function(w) {

    var _ready = false,
        _blockSize = 20,
        _mapFillStyle = '#0D0D0D',
        _mapStrokeStyle = '#002608',
        _score = 0,

        Game = w.Game = function() {
            if (!this instanceof arguments.callee)
                return new Game();
        };

    Game.prototype.FPS = 50;

    Game.prototype.start = function() {
        _ready = true;
    };

    Game.prototype.pause = function() {
        _ready = false;
    };

    Game.prototype.blockSize = function() {
        return _blockSize;
    };

    Game.prototype.isReady = function() {
        return _ready;
    };

    Game.prototype.clearMap = function() {
        context.fillStyle = _mapFillStyle;
        context.strokeStyle = _mapStrokeStyle;
        for (var x = canvas.width - _blockSize; x >= 0; x--) {
            for (var y = canvas.height - _blockSize; y >= 0; y--) {
                this.applyStyle(context, x, y);
            }
        }
    };

    Game.prototype.showStartText = function() {
        context.font = "bold 35px sans-serif";
        context.fillStyle = '#FFFFFF';
        context.fillText("Press space bar to start!", canvas.width / 4, canvas.height / 2);
    };

    Game.prototype.showScore = function() {
        context.font = "bold 18px sans-serif";
        context.fillStyle = 'rgba(255, 255, 255, 0.3)';
        context.fillText("Score: " + _score, canvas.width - 120, canvas.height - 20);
    };

    Game.prototype.applyStyle = function applyStyle(ctx, x, y) {
        ctx.fillRect(x * _blockSize, y * _blockSize, _blockSize, _blockSize);
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x * _blockSize, y * _blockSize, _blockSize, _blockSize);
    };

    Game.prototype.addScore = function() {
        _score++;
    };

    Game.prototype.resetScore = function() {
        _score = 0;
    };

    return Game;

})(window);



(function(w) {

    var _foodFillStyle = '#FF6363',
        _foodStrokeStyle = '#FFA8A8',
        _x = null,
        _y = null,
        _consumed = true,

        Food = w.Food = function() {
            if (!this instanceof arguments.callee)
                return new Food();
        };

    function generateRandomCoordinates() {
        return {
            x: Math.floor(Math.random() * (canvas.width / game.blockSize())),
            y: Math.floor(Math.random() * (canvas.height / game.blockSize()))
        };
    }

    function isValidCoordinates(x, y) {
        var valid = true;
        snake.forEachSegment(function(segment) {
            if (segment.x === x && segment.y === y) {
                valid = false;
                return true;
            }
        });
        return valid;
    }

    function generateValidCoordinates() {
        var coordinates;
        while (true) {
            coordinates = generateRandomCoordinates();
            if (isValidCoordinates(coordinates.x, coordinates.y)) {
                _x = coordinates.x;
        		_y = coordinates.y;
        		break;
            }
        }
    }

    function checkIfConsumed() {
        snake.forEachSegment(function(segment) {
            if (_x === segment.x && _y === segment.y) {
                _consumed = true;
                return true;
            }
        });
    }

    Food.prototype.consumed = function() {
        return _consumed;
    };

    Food.prototype.draw = function() {

        checkIfConsumed();

        if (_consumed) {
            game.addScore();
            generateValidCoordinates();
            _consumed = false;
            snake.grow();
        }

        context.fillStyle = _foodFillStyle;
        context.strokeStyle = _foodStrokeStyle;

        game.applyStyle(context, _x, _y);
    };

    Food.prototype.init = function() {
        if (_consumed) {
            generateValidCoordinates();
            _consumed = false;
        }

        context.fillStyle = _foodFillStyle;
        context.strokeStyle = _foodStrokeStyle;

        game.applyStyle(context, _x, _y);
    };

    return Food;
})(window);



snake = (function(w) {

    //initial size of the snake
    var _initialsnakeSize = 5,
        _segments = [],
        _direction = 39,
        _newDirection = 39,
        _snakeFillStyle = '#FFFFFF',
        _snakeStrokeStyle = '#D1D1D1',
        _shouldGrow = false,

        Snake = w.Snake = function() {
            if (!this instanceof arguments.callee)
                return new Snake();
        };

    function head() {
        return _segments[0];
    }

    function fillSegment(segment) {
        context.fillStyle = _snakeFillStyle;
        context.strokeStyle = _snakeStrokeStyle;
        game.applyStyle(context, segment.x, segment.y);
    }

    function forDirection(key, fn) {
    	fn = fn || function() {};
        switch (key) {
            case 37:
                if (_direction != 39)
                    fn(key, -1, 0);
                break;
            case 38:
                if (_direction !== 40)
                    fn(key, 0, -1);
                break;
            case 39:
                if (_direction !== 37)
                    fn(key, 1, 0);
                break;
            case 40:
                if (_direction !== 38)
                    fn(key, 0, 1);
                break;
            default:
                break;
        }
    }

    function getNextHeadBasedOnDirection() {
        var x = head().x,
            y = head().y;
        forDirection(_newDirection, function(direction, newX, newY) {
            _direction = direction;
            x += newX;
            y += newY;
        });
        return {
            x: x,
            y: y
        };
    }

    Snake.prototype.collided = function() {
        var nextHead = getNextHeadBasedOnDirection(),
            collided = false;

        //self collision
        this.forEachSegment(function(segment) {
            if (nextHead.x === segment.x && nextHead.y === segment.y) {
                collided = true;
                return true;
            }
        });

        // x-wall collision
        if (nextHead.x * game.blockSize() > canvas.width - game.blockSize() || nextHead.x < 0)
            collided = true;

        //y-wall collision
        if (nextHead.y * game.blockSize() > canvas.height - game.blockSize() || nextHead.y < 0)
            collided = true;

        return collided;
    };

    Snake.prototype.draw = function() {
        this.forEachSegment(fillSegment);
    };

    Snake.prototype.forEachSegment = function(fn) {
        if (fn && fn.length == 1) {
            for (var i = _segments.length - 1; i >= 0; i--) {
                if (fn(_segments[i])) break;
            }
        }
    };

    Snake.prototype.init = function() {
        _segments = [];
        _direction = 39;
        _newDirection = 39;
        for (var i = _initialsnakeSize - 1; i >= 0; i--) {
            _segments.push({
                x: i,
                y: 0
            });
        }
    };

    Snake.prototype.grow = function() {
        _shouldGrow = true;
    };

    Snake.prototype.segments = function() {
        return _segments;
    };

    Snake.prototype.setDirection = function(keyCode) {
        forDirection(keyCode, function(direction) {
            _newDirection = direction;
        });
    };

    /*
     *	updates the values of snake such as direction, etc etc.
     * 	according to user-input
     */
    Snake.prototype.update = function() {
        var nextHead = getNextHeadBasedOnDirection();
        if (_shouldGrow) {
            _segments.unshift(nextHead);
            _shouldGrow = false;
        } else {
            var tail = _segments.pop();
            tail.x = nextHead.x;
            tail.y = nextHead.y;
            _segments.unshift(tail);
        }
    };

    return Snake;

})(window);


var canvas = (function() {
        var c = document.createElement('canvas');
        c.width = 800;
        c.height = 600;
        document.body.appendChild(c);
        return c;
    })(),
    context = canvas.getContext('2d'),
    game = new Game(),
    snake = new Snake(),
    food = new Food();


var registerKeyListeners = function() {
    document.addEventListener('keydown', function(e) {
        if (32 === e.keyCode)
            game.start();
        snake.setDirection(e.keyCode);
    }, false);
};



var gameLoop = function() {
    setTimeout(function() {
        var requestId = requestAnimationFrame(gameLoop);
        if (game.isReady()) {
            game.clearMap();
            if (snake.collided()) {
                game.pause();
                game.resetScore();
            } else {
                snake.update();
                snake.draw();
                food.draw();
            }
        } else {
            game.clearMap();
            snake.init();
            snake.draw();
            food.init();
            game.showStartText();
        }
        game.showScore();
    }, 1000 / game.FPS);
};

registerKeyListeners();
gameLoop();
