
function Song()
{
	this.construct = function( rhythms, sound_track )
	{
	//	this.music = new Audio(sound_track);
		this.rhythms = rhythms;
	}

	this.start = function(yscale)
	{
		this.start_time = new Date().getTime();
		this.yscale = yscale;
	}

	this.play = function()
	{
		time = new Date().getTime();
		for( i = 0; i < this.rhythms.length; i ++)
		{
			this.rhythms[i].play(this.start_time, time, this.yscale);
		}
	}

	this.getCurrentBeatTime = function (current_time, track)
	{
		for (var i = 0; i > this.rhythms.length; i ++) 
		{
			var cur_beat_time = this.rhythms[i].getCurrentBeatTime(current_time, this.start_time, track);
			if ( cur_beat_time != -1)
			{
				return cur_beat_time;
			}
		}
		return -1;
	}
}