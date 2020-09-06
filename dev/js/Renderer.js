'use strict';


/**
 * @namespace js13k.Renderer
 */
js13k.Renderer = {


	cnv: null,
	ctx: null,
	inputUpdateInterval: 0,
	last: 0,
	level: null,
	sprite: null,


	/**
	 *
	 * @param {js13k.Level} level
	 */
	changeLevel( level ) {
		js13k.Input.off( 'gp_connect' );
		js13k.Input.off( 'gp_disconnect' );

		this.level = level;
	},


	/**
	 * Clear the canvas.
	 */
	clear() {
		this.ctx.fillStyle = '#cbdbfc';
		this.ctx.fillRect( 0, 0, this.cnv.width, this.cnv.height );
	},


	/**
	 * Draw to the canvas.
	 */
	draw() {
		this.clear();
		this.level && this.level.draw( this.ctx );
	},


	/**
	 * Draw the pause screen.
	 */
	drawPause() {
		this.ctx.fillStyle = '#111';
		this.ctx.fillRect( 0, 0, this.cnv.width, this.cnv.height );

		this.ui_pause.centerX();
		this.ui_pause.y = this.centerY;
		this.ui_pause.draw( this.ctx );
	},


	/**
	 * Initialize the renderer.
	 * @param {function} cb
	 */
	init( cb ) {
		this.cnv = document.getElementById( 'c' );
		this.ctx = this.cnv.getContext( '2d', { alpha: false } );

		this.ui_pause = new js13k.UI.Text(
			'PAUSED', 'bold 128px sans-serif', [162, 162, 162], 0, 0, true
		);

		this.registerEvents();
		this.loadSprite( cb );
	},


	/**
	 * Load images for use on the canvas.
	 * @param {function} cb
	 */
	loadSprite( cb ) {
		const img = new Image();
		img.onload = () => {
			this.sprite = img;
			cb();
		};
		img.src = 's.gif';
	},


	/**
	 * Start the main loop. Update logic, render to the canvas.
	 * @param {number} [timestamp = 0]
	 */
	mainLoop( timestamp = 0 ) {
		js13k.Input.update();

		if( timestamp > 0 ) {
			const timeElapsed = timestamp - this.last; // Time that passed between frames. [ms]

			// Target speed of 60 FPS (=> 1000 / 60 ~= 16.667 [ms]).
			const dt = timeElapsed / ( 1000 / js13k.TARGET_FPS );

			this.ctx.imageSmoothingEnabled = false;
			this.ctx.lineWidth = 1;
			this.ctx.textBaseline = 'alphabetic';

			this.ctx.setTransform( 1, 0, 0, 1, 0, 0 );

			if( this.isPaused ) {
				this.drawPause();
				return; // Stop the loop.
			}
			else {
				this.level && this.level.update( dt );
				this.draw( dt );
			}
		}

		this.last = timestamp;

		requestAnimationFrame( t => this.mainLoop( t ) );
	},


	/**
	 *
	 */
	registerEvents() {
		window.addEventListener( 'resize', () => this.resize() );
		this.resize();

		const keysEscape = js13k.Input.getKeysForAction( js13k.Input.ACTION.ESC );

		js13k.Input.onKeyUp( 'Escape', () => {
			if( this.isPaused ) {
				this.unpause();
			}
			else {
				this.isPaused = true;

				// Keep on updating the inputs (gamepads), but much slower.
				this.inputUpdateInterval = setInterval(
					() => {
						js13k.Input.update();

						for( const key of keysEscape.gamepad ) {
							if( js13k.Input.isPressedGamepad( key ) ) {
								this.unpause();
								return;
							}
						}
					},
					500
				);
			}
		} );
	},


	/**
	 * Resize the canvas.
	 */
	resize() {
		const diff = window.innerHeight - js13k.MAX_CANVAS_HEIGHT;

		this.cnv.height = window.innerHeight - diff;
		this.cnv.width = window.innerWidth;

		this.centerX = Math.round( this.cnv.width / 2 );
		this.centerY = Math.round( this.cnv.height / 2 );

		if( this.isPaused ) {
			this.drawPause();
		}
	},


	/**
	 *
	 */
	unpause() {
		if( this.isPaused ) {
			clearInterval( this.inputUpdateInterval );
			this.isPaused = false;
			this.mainLoop();
		}
	}


};
