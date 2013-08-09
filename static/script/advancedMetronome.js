function AdvancedMetronome(diff_time, speed, start_time_window, end_time_window)
{
	this.diff_time = diff_time;
	this.speed = speed;
	this.coeff = 0;

	this.start_time_window = start_time_window;
	this.end_time_window = end_time_window;

	this.draw = function(start_time, time, yscale)
	{
		var first = start_time + this.start_time_window + this.diff_time + ( this.coeff * this.speed ) ;
		while( first < (time - 1000) )
		{
			first += this.speed;
			this.coeff++;
		}
		var last = first;
		var position = ( time_position - ( last  - time ) * yscale );
		while( position >= 0 && last <= ( start_time + this.end_time_window ) )
		{
			ctx.fillStyle="#000000";

			ctx.moveTo(0,position);
			ctx.lineTo(ctx.canvas.width,position);
			ctx.stroke();
			last += this.speed;
			position = ( time_position - ( last  - time ) * yscale );
		}
	}

	this.duplicate = function()
	{
		return new AdvancedMetronome(this.diff_time, this.speed, 0, 0);
	}
}