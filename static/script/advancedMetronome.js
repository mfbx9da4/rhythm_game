function AdvancedMetronome(diff_time, speed, start_time_window, end_time_window)
{
	this.diff_time = diff_time;
	this.speed = speed;
	this.coeff = 0;

	this.start_time_window = start_time_window;
	this.end_time_window = end_time_window;

	this.draw = function(start_time, time, yscale)
	{
		// first is time when metronome first drawn/played?
		var first = start_time + this.start_time_window + this.diff_time + ( this.coeff * this.speed ) ;
		// increase the first time so that it is in the future by a coeff number of speeds? why?
		while( first < (time - 1000) )
		{
			first += this.speed;
			this.coeff++;
		}
		// calculate the y position of the metronome
		var last = first;
		var position = ( time_position - ( last  - time ) * yscale );
		while( position >= 0 && last <= ( start_time + this.end_time_window ) )
		{
			ctx.moveTo(0, position);
			ctx.lineTo(ctx.canvas.width, position);
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