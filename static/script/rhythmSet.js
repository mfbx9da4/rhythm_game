function RhythmSet(rhythm, params){
	this.rhythms = new Array();
	this.rhythms_played = 0;
	this.init = function (rhythm, params){
		// for each repition init rhythm
		for( i = 0; i < params.repetitions; i ++)
		{
			rhy = rhythm.duplicate();
			rhy.initialise(this.xscale, this.offset);
			rhy.diff_time = this.nextDisplayedDiffTime;
			rhy.setvisible(params.visible);
			rhy.setRhyhtmLength(rhy.rhythm_time / params.speed );
			this.rhythms.push(rhythm);
		}	
		this.nextDisplayedDiffTime = rhy.diff_time + rhy.rhythm_time;
	}
	this.init();
}