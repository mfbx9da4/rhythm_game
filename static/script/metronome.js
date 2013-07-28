function Metronome(diff_time, speed)
{
	this.diff_time = diff_time;
	this.speed = speed;
	this.coeff = 0;

	this.draw = function(start_time, time, yscale)
	{
		var first = start_time + this.diff_time + ( this.coeff * this.speed ) ;
		while( first < (time - 1000) )
		{
			first += this.speed;
			this.coeff++;
		}
		var last = first;
		var position = ( time_position - ( last  - time ) * yscale );
		while( position >= 0 )
		{
			ctx.fillStyle="#000000";

			ctx.moveTo(0,position);
			ctx.lineTo(ctx.canvas.width,position);
			ctx.stroke();
			last += this.speed;
			position = ( time_position - ( last  - time ) * yscale );
		}
	}
}