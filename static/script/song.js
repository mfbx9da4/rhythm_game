
function Song(rhythms, sound_track, metronomeTemp)
{

	this.rhythms = rhythms;
	track_numbers = new Array();
	for ( var i = 0; i < rhythms.length; i ++){
		track_numbers.push(rhythms[i].tracks);
	}
	this.tracks = Math.max.apply( Math, track_numbers);

	this.xscale = c.width / this.tracks;
  	this.offset = c.width % this.tracks + ( this.xscale / 2 );
	for ( var i = 0; i < rhythms.length; i ++){
		this.rhythms[i].initialise(this.xscale, this.offset);
	}

	this.metronome = metronomeTemp;
	

	this.start = function(yscale)
	{
		this.start_time = new Date().getTime();
		this.yscale = yscale;
		this.start_rhythm = 0;
	}

	this.play = function(time, draw)
	{
		this.metronome.draw(this.start_time, time, this.yscale);
		var i = this.start_rhythm;
		for( ; i < this.rhythms.length; i ++)
		{
			if( this.start_time + this.rhythms[i].diff_time + this.rhythms[i].rhythm_time > time )
				break;
			else
				this.start_rhythm = i + 1;
		}
		
		for( ; i < this.rhythms.length; i ++)
		{
			if(  this.start_time + this.rhythms[i].diff_time > time + ( 400 / this.yscale ) )
	  			break;
	  		this.rhythms[i].play(this.start_time, time, this.yscale, draw);
		}
		
	}


	this.getCurrentBeatTime = function (current_time, track)
	{
		for ( i = 0; i < this.rhythms.length; i++ ) 
		{
			if( track < this.rhythms[i].tracks )
			{
				var cur_beat_time = this.rhythms[i].getCurrentBeatTime(current_time, this.start_time, track);
				if ( cur_beat_time != -1)
				{
					return cur_beat_time;
				}
			}
		}
		return -1;
	}


	this.getCurrentBeatTimePlayback = function (current_time, track)
	{
		for ( i = 0; i < this.rhythms.length; i++ ) 
		{
			if( track < this.rhythms[i].tracks )
			{
				var audio_index = this.rhythms[i].getCurrentBeatTimePlayback(current_time, this.start_time, track);
				if ( audio_index != -1)
				{
					return 1;
				}
			}
		}
		return -1;
	}
}