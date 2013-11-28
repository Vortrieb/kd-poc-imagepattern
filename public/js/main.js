window.onload = function () {
	"use strict";
	var canvas = document.getElementById('canvas');
	var frequency     = 15;
	var angle         = 45;
	var stepSize      = 1;
	var linesPerFrame = 10;
	var minSize       = 0;
	var maxSize       = 1;

	function replaceWithImage() {
		var image = new Image();
		image.src = canvas.toDataURL('image/png');
		document.body.appendChild(image);
		canvas.parentNode.removeChild(canvas);
	}

	var process = new Processing(canvas, function (p) {
		var finishedLines = 0;
		var run = false;
		var image = p.loadImage('/image', 'jpg', function () {
			run = true;
			init();
		});

		function Line(opts) {
			if (!opts.angle) { opts.angle = 45 }

			this.startX = (opts.x) ? opts.x : 0;
			this.startY = (opts.y) ? opts.y : 0;
			this.velocity = new p.PVector(
				Math.cos(p.radians(opts.angle)),
				Math.sin(p.radians(opts.angle))
			);
			this.velocity.mult(stepSize);
			this.position = new p.PVector(this.startX, this.startY);
			this.finished = false;
		}

		Line.calcY = function (x, angle) {
			var y;
			if (x > p.width) {
				x = x - p.width;
				x *= -1;
			}

			if (x >= 0 && x <= p.width || Math.abs(angle) === 90) {
				y = 0;
			} else {
				y = Math.tan(p.radians(angle)) * x;
			}

			y = Math.abs(y);

			return (y > p.height) ? false : y;
		}

		Line.prototype.run = function () {
			while (this.step()) {
				this.draw();
			}
		};

		Line.prototype.step = function () {
			if (this.position.x > p.width || this.position.y > p.height) {
				if (!this.finished) {
					this.finished = true;
					finishedLines++;
				}
				return false; // out of bounds
			}

			this.position.add(this.velocity);
			return true;
		};

		Line.prototype.draw = function () {
			var pixel = image.get(
				Math.floor(this.position.x),
				Math.floor(this.position.y)
			);

			var brightness = p.brightness(pixel);
			// if ( p.noise(this.position.x/100, this.position.y/100) > 0.5) {
			// 	brightness /= 1.2;
			// }

			var size = p.map(
				brightness,
				0, 255,
				maxSize, minSize
			);

			size = Math.ceil(size);
			p.fill(brightness);
			p.noStroke();
			p.ellipse(
				this.position.x,
				this.position.y,
				size, size
			);
		};
		window.Line = Line;

		var lines = [];
		function init() {
			p.size(image.width, image.height);
			var line;
			var y;
			var startX = p.height / Math.tan(p.radians(angle));
			for (var x = -startX; x <= p.width ; x += frequency) {
				y = Line.calcY(x, angle);
				if (y !== false) {
					lines.push(new Line({x: (x < 0) ? 0 : x, y: y, angle: angle}));
				}
			}

			angle = 180 - angle;
			for (x = p.width + startX; x >= 0 ; x -= frequency) {
				y = Line.calcY(x, angle);
				if (y !== false) {
					lines.push(new Line({
						x: (x > p.width) ? p.width : x,
						y: y,
						angle: angle
					}));
				}
			}
			p.background(255);
		};

		var currentLine = 0;
		p.draw = function () {
			if (!run) {
				return false;
			}

			if (finishedLines === lines.length) {
				replaceWithImage();
				p.noLoop();
			} else {
				var lineCount = lines.length;
				for (var step = 0; step < linesPerFrame; step++) {
					if (currentLine < lineCount) {
						lines[currentLine].run();
						currentLine++;
					}
				}
			}
		}
	});
};
