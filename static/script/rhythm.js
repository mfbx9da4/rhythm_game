function Rhythm (beats, diff_time, rhythm_time){

    this.tracks = beats.length;
    this.track_train = [];
    this.track_hide = [];
    this.beats = beats;
    this.xscale = 0;
    this.offset = 0;
    this.diff_time = diff_time;
    this.rhythm_time = rhythm_time;

    this.counter = 0;
    this.played = 0;



  	this.setPlayback = function( value)
  	{
  		for( track = 0 ; track < this.tracks; track ++)  		
  			for( j = 0; j < this.beats[track].length; j ++ )
	      		this.beats[track][j].playedPlayBack = value;		
  	}

    this.finished = function( start_time, time )
    {
        return time > start_time + this.diff_time + this.rhythm_time + 500;
    }

    this.leftCanvas = function(start_time, time, yscale)
    {
        var canvas_time = ( c.height - time_position) / yscale ;
        return time - canvas_time > start_time + this.diff_time + this.rhythm_time;
    }

    this.duplicate = function()
    {
        var newBeats = new Array(this.tracks);
        for( track = 0 ; track < this.tracks; track ++)
        {
            newBeats[track] = new Array(this.beats[track].length);
            for( j = 0; j < this.beats[track].length; j ++ )
            {
                newBeats[track][j] = this.beats[track][j].duplicate();
            }
        }
        return new Rhythm(newBeats, 0, this.rhythm_time);
    }

    this.initialise = function(xscale, offset)
    {
        this.xscale = xscale;
        this.offset = offset;
        this.played = 0;
        nb = 0;
        for( t = 0; t < beats.length ; t++)
            if ( this.track_train[t] == 1 ) 
                for( l = 0; l < beats[t].length ; l++ )
                    nb++;
        this.numberOfBeats = nb;    
    }

    this.setRhyhtmLength = function(newTime)
    {
        this.rhythm_time = newTime;
    }

    this.reinitialise = function()
    {
        for( track = 0 ; track < this.tracks; track ++)
        {
            for( j = 0; j < this.beats[track].length; j ++ )
            {
                this.beats[track][j].playedPlayBack = 0;
                this.beats[track][j].playedPlayer = 0;
            }
        }
    }

    this.setsilent = function(silent)
    {
        for( track = 0 ; track < this.tracks; track ++)
        {
            for( j = 0; j < this.beats[track].length; j ++ )
            {
                this.beats[track][j].silent = silent;
            }
        }
    }
    
    this.setvisible = function(visible)
    {
        for( track = 0 ; track < this.tracks; track ++)
        {
            for( j = 0; j < this.beats[track].length; j ++ )
            {
                this.beats[track][j].visible = visible;
            }
        }
    }

    this.play = function(start_time, time, yscale, draw)
    {
        // Compute the position of the start of the rhyhtm:
        var start_time_position = ( time_position - ( start_time + this.diff_time - time ) * yscale );
        for( track = 0; track < this.tracks ; track ++ )
        {
            if( this.track_train[track] == 1)
            {
                  // Compute the x position of the track:
                  var x = track * this.xscale + this.offset;
                  for( j = 0; j < this.beats[track].length; j ++ )
                  {
                        // Compute the y position of the beat:
                        var beat_offest = this.beats[track][j].time * this.rhythm_time * yscale;
                        var y = start_time_position - beat_offest;
                        
                        // Draw the circle:
                        this.beats[track][j].circle.x = x;
                        this.beats[track][j].circle.y = y;

                        if( draw == 1 && ( this.track_hide[track] == 0 || y > time_position ))
                            this.beats[track][j].draw();
                  }
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
            if ( this.beats[track][j].playedPlayer == 0 && Math.abs(beat_time - current_time) < error_range )
            {
                this.beats[track][j].playedPlayer = 1;
                this.beats[track][j].updateRadius( this.beats[track][j].radius * 1.5);
                this.counter++;
                if( this.counter == this.numberOfBeats )
                    this.played = 1;
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
