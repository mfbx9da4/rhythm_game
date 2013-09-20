function RhythmSet(rhythm, params, start_time, xscale, offset){
	this.rhythms = new Array();
	this.rhythms_played = 0;
	this.start_time = start_time;
	this.init = function (rhythm, params, xscale, offset){
		var nextDisplayedDiffTime = this.start_time;
		// for each repition init rhythm
		for( i = 0; i < params.repetitions; i ++)
		{
			rhy = rhythm.duplicate();
			rhy.initialise(xscale, offset);
			rhy.diff_time = nextDisplayedDiffTime;
			rhy.setvisible(params.visible);
			rhy.rhythm_time = rhythm.rhythm_time * params.speed;
			this.rhythms.push(rhy);
			nextDisplayedDiffTime = rhy.diff_time + rhy.rhythm_time;
		}	
	}

	this.get_rhythms_played = function()
	{
		var counter = 0;
		for( i = 0 ; i < this.rhythms.length; i++)
		{
			if( this.rhythms[i].played == 1)
				counter++;
		}
		return counter;
	}

	this.left_canvas = function(start_time, time, yscale)
	{
		return this.rhythms[this.rhythms.length - 1].leftCanvas(start_time, time, yscale);
	}

	this.finished = function(start_time, time)
	{
		return this.rhythms[this.rhythms.length-1].finished(start_time, time);
	}

	this.init(rhythm, params, xscale, offset);
}