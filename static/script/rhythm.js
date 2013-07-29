function Rhythm (beats, diff_time, rhythm_time){

	this.tracks = beats.length;
	this.beats = beats;
  	this.xscale = 0;
  	this.offset = 0;
  	this.diff_time = diff_time;
  	this.rhythm_time = rhythm_time;

  	this.initialise = function(xscale, offset)
  	{
  		this.xscale = xscale;
  		this.offset = offset;
  	}
	
	this.play = function(start_time, time, yscale, draw)
	{
		// Compute the position of the start of the rhyhtm:
	  	var start_time_position = ( time_position - ( start_time + this.diff_time - time ) * yscale )
	    for( track = 0; track < this.tracks ; track ++ )
	    {
	      // Compute the x position of the track:
	      var x = track * this.xscale + this.offset;
	      for( j = 0; j < this.beats[track].length; j ++ )
	      {
	      	// Compute the y position of the beat:
      		var beat_offest = this.beats[track][j].time * this.rhythm_time * yscale;
	        var y =  start_time_position - beat_offest;

	        // Draw te circle:
	        this.beats[track][j].circle.x = x;
	        this.beats[track][j].circle.y = y;
	        if( draw == 1)
	        	this.beats[track][j].draw();
	      }
	    }
	}

	this.getCurrentBeatTime = function (current_time, start_time, track)
	{
		var rhythm_start_time = start_time + this.diff_time;
		for ( j = 0; j < this.beats[track].length; j ++)
		{
			var beat_offset = this.beats[track][j].time * this.rhythm_time;
			var beat_time = rhythm_start_time + beat_offset
			if ( this.beats[track][j].playedPlayer == 0 && Math.abs(beat_time - current_time) < error_range  )
			{
				this.beats[track][j].playedPlayer = 1;
				this.beats[track][j].updateRadius( this.beats[track][j].radius * 1.5);
				return beat_time;
			}
		}
		return -1;
	}

	this.getCurrentBeatTimePlayback = function (current_time, start_time, track)
	{
		var rhythm_start_time = start_time + this.diff_time;
		for ( j = 0; j < this.beats[track].length; j ++)
		{
			var beat_offset = this.beats[track][j].time * this.rhythm_time;
			var beat_time = rhythm_start_time + beat_offset
			if ( this.beats[track][j].playedPlayBack == 0 && beat_time - current_time < 3 && this.beats[track][j].silent == 0 )
			{
				this.beats[track][j].playedPlayBack = 1;
				return 1;
			}
		}
		return -1;
	}

}
