		
window.LeapPointer = {
	debug: false,
	running: false,
	points: {
		top: {
			left: [-250, 500],
			right: [250, 500]
		},
		bottom: {
			left: [-250, 50],
			right: [250, 50]
		}
	},

	getPointOnScreen: function(position) {
		// it would be better to get the point on the x axis first then find the point along a line between top and bottom left
		var pointX = position[0] - this.points.top.left[0];
		pointX = (pointX / (this.points.top.right[0] - this.points.top.left[0])) * 100;
		
		var pointY = position[1] - this.points.bottom.left[1];
		pointY = (pointY / (this.points.top.left[1] - this.points.bottom.left[1])) * 100;
		
		return [pointX, pointY];
	},
	
	loop: function(frame) {
		for(var i = 0, len = frame.hands.length; i < len; i++) {
			var hand = frame.hands[i];
			if(hand.type === 'right') {
				var posR = (hand.indexFinger.dipPosition[0] + 250);
				
				var pointerLocation = this.getPointOnScreen(hand.indexFinger.dipPosition);
				this.rightLocation = {x: pointerLocation[0], y: pointerLocation[1]};	// Store the location for calibration
				this.rightPointer.style.left = pointerLocation[0] + '%';
				this.rightPointer.style.bottom = pointerLocation[1] + '%';
				
				if(this.debug) {
					if(hand.indexFinger.dipPosition[0] > this.maxX) {
						this.maxX = hand.indexFinger.dipPosition[0];
					} else if(hand.indexFinger.dipPosition[0] < this.minX) {
						this.minX = hand.indexFinger.dipPosition[0];
					}
					if(hand.indexFinger.dipPosition[1] > this.maxY) {
						this.maxY = hand.indexFinger.dipPosition[1];
					} else if(hand.indexFinger.dipPosition[1] < this.minY) {
						this.minY = hand.indexFinger.dipPosition[1];
					}
					this.debugOutput.innerHTML = '<p>Current: '+(Math.floor(pointerLocation[0] * 100) / 100)+','+(Math.floor(pointerLocation[1] * 100) / 100)+'</p>'+
					'<p>X: Min:'+this.minX+' Max:'+this.maxX+'</p>'+
					'<p>Y: Min:'+this.minY+' Max:'+this.maxY+'</p>';
				}
			}

		}		
	},
	
	start: function() {
		if(!this.running) {
			this.running = true;
			this.rightPointer = document.createElement('i');
			this.rightPointer.id = 'rightPointer';
			this.rightPointer.style.position = 'absolute';
			this.rightPointer.className = 'fa fa-circle-o';
			document.body.appendChild(this.rightPointer);
			console.log(this.rightPointer);
		
			Leap.loop({ enableGestures: true}, this.loop.bind(this));
		} else {
			throw new Error('Leap pointer is already running');
		}
		
	},
	
	enableDebug: function(output) {
		this.debugOutput = output;
		this.maxX = 0;
		this.maxY = 0;
		this.minX = 100;
		this.minY = 100;
		
		this.debug = true;
	},
	
	calibrate: function() {
		if(!this.running) {
			throw new Error('Leap point is not running');
		}
		this.calibrateListener = document.addEventListener('keypress', this.continueCalibrating.bind(this));
	},
	
	continueCalibrating: function(evt) {
		if(evt.charCode === 32) {
			// Space bar, do stuff
		}
		console.log(evt);
	}

};
