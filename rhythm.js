function Rhythm (tracks){

	this.construct = function (beats, diff_time, rhythm_time)
	{
		this.tracks = beats.length;
		this.beats = beats;
  		this.xscale = c.width / this.tracks;
  		this.offset = c.width % this.tracks + ( this.xscale / 2 );
  		this.diff_time = diff_time;
  		this.rhythm_time = rhythm_time;
	}
	
	this.play = function(start_time, time, yscale)
	{
	  if(  start_time + this.diff_time + this.rhythm_time > time )
	  {
	  	var start_time_position = ( time_position - ( start_time + this.diff_time - time ) * yscale )
	    for( track = 0; track < this.tracks ; track ++ )
	    {
	      var x = track * this.xscale + this.offset;
	      for( j = 0; j < this.beats[track].length; j ++ )
	      {
      		var beat_offest = this.beats[track][j] * this.rhythm_time * yscale;
	        var y =  start_time_position - beat_offest;
	        var color = 'red';
	        var circle = new Circle(x, y, color);
	        circle.draw();
	      }
	    }
	  }
	}

	this.getCurrentBeatTime = function (current_time, start_time, track)
	{
		var rhythm_start_time = start_time + this.diff_time;
		for ( j = 0; j < this.beats[track].length; j ++)
		{
			var beat_offset = this.beats[track][j] * this.rhythm_time;
			var beat_time = rhythm_start_time + beat_offset
			if ( Math.abs(beat_time - current_time) < error_range )
			{
				return beat_time;
			}
		}
		return -1;
	}
}
