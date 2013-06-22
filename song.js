
function Song()
{
	this.construct = function( rhythms, sound_track )
	{
	//	this.music = new Audio(sound_track);
		this.rythms = rhythms;
	}

	this.start = function(yscale)
	{
		this.start_time = new Date().getTime();
		this.yscale = yscale;
	}

	this.play = function()
	{
		time = new Date().getTime();
		for( i = 0; i < this.rythms.length; i ++)
		{
			this.rythms[i].play(this.start_time, time, this.yscale);
		}
	}
}