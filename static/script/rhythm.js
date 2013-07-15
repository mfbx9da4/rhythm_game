function Rhythm (beats, diff_time, rhythm_time){

	this.tracks = beats.length;
	this.beats = beats;
  	this.xscale = c.width / this.tracks;
  	this.offset = c.width % this.tracks + ( this.xscale / 2 );
  	this.diff_time = diff_time;
  	this.rhythm_time = rhythm_time;

  	this.playedPlayBack = new Array(this.beats.length);
	for( var i = 0; i < this.playedPlayBack.length ; i++ )
	{
		this.playedPlayBack[i] = new Array(this.beats[i].length);
		for( j = 0; j < this.playedPlayBack[i].length ; j++)
			this.playedPlayBack[i][j] = 0;
	}

	this.playedPlayer = new Array(this.beats.length);
	for( var i = 0; i < this.playedPlayer.length ; i++ )
	{
		this.playedPlayer[i] = new Array(this.beats[i].length);
		for( j = 0; j < this.playedPlayer[i].length ; j++)
			this.playedPlayer[i][j] = 0;
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
      		var beat_offest = this.beats[track][j] * this.rhythm_time * yscale;
	        var y =  start_time_position - beat_offest;

	        // Use the color of the track:
	        var color = map_track_color[track];
	        
	        // Draw the circle bigger if the player played in time:
	        var radius = 40;
	        if( this.playedPlayer[track][j] == 1 )
	        	radius *= 1.5;

	        // Draw te circle:
	        var circle = new Circle(x, y, radius, color);
	        if( draw == 1)
	        	circle.draw();
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
			if ( this.playedPlayer[track][j] == 0 && Math.abs(beat_time - current_time) < error_range  )
			{
				this.playedPlayer[track][j] = 1;
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
			var beat_offset = this.beats[track][j] * this.rhythm_time;
			var beat_time = rhythm_start_time + beat_offset
			if ( this.playedPlayBack[track][j] == 0 && beat_time - current_time < 3 )
			{
				this.playedPlayBack[track][j] = 1;
				return 1;
			}
		}
		return -1;
	}

}
