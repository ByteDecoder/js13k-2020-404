'use strict';


{

class LevelObject {


	/**
	 *
	 * @constructor
	 * @param {?number}  x
	 * @param {?number}  y
	 * @param {?number}  w
	 * @param {?number}  h
	 * @param {?string}  color
	 * @param {?string}  topBorder
	 */
	constructor( x, y, w, h, color, topBorder ) {
		this.color = color || '#696a6a';
		this.top = topBorder;

		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		this.dirX = 0;
		this.dirY = 0;

		this.velocityX = 0;
		this.velocityY = 0;

		this.blocks = {};
		this.collision = true;
		this.nextPos = { x, y };
		this.progress = 0;
	}


	/**
	 *
	 * @param {CanvasRenderingContext2d} ctx
	 */
	draw( ctx ) {
		ctx.fillStyle = this.color;
		ctx.fillRect( this.x, this.y, this.w, this.h );

		if( this.top ) {
			ctx.fillStyle = this.top;
			ctx.fillRect( this.x, this.y, this.w, 6 );
		}
	}


	/**
	 *
	 * @param {number} dt
	 */
	update( dt ) {
		this.progress += dt;
	}


}


js13k.LevelObject = LevelObject;

}
