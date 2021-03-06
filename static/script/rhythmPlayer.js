function RhythmPlayer()
{
	this.canPlay = 1;

	this.play = function()
	{
		var time =  new Date().getTime();
		for ( track = 0; track < this.rhythm.tracks; track ++)
		{
			var play = this.rhythm.getCurrentBeatTimePlayback(time, this.startTime, track);
			if ( play == 1)
			{
				this.playSound(track);
			}
		}
		if( time > ( this.rhythm.rhythm_time + this.startTime + this.rhythm.diff_time ) )
		{
			this.canPlay = 1;
			w.clearInterval(this.id);
			this.rhythm.setPlayback(0);
		}
	}

	this.setUp = function(rhythm, duration)
	{	
		if( isNaN(duration) || duration <= 0 )
		{
			this.canPlay = 1;
			return;
		}
		this.rhythm = rhythm;
		this.rhythm.rhythm_time = duration;
		this.soundIndex = new Array();
		this.audio = new Array();
		this.counter = 0;
		
		this.number = this.rhythm.trackNumber_to_trackID.length * 3; 
		for( i = 0; i < this.rhythm.trackNumber_to_trackID.length ; i++)
		{
			this.soundIndex[i] = 0;
			this.audio[i] = new Array();
			for( j = 0; j < 3 ; j++)
			{
				var snd = new Audio(rhythm.track_to_song[rhythm.trackNumber_to_trackID[i]]);
				snd.load();
				this.audio[i][j] = snd;
			}
		}
		for( i = 0; i < this.rhythm.trackNumber_to_trackID.length ; i++)
			for( j = 0; j < 3 ; j++)
			{
				this.audio[i][j].addEventListener('canplaythrough', function(event) {this.removeEventListener('canplaythrough',arguments.callee,false); 
																						rhythm_player.startoff()} , false);
			}
	}

	this.startoff = function()
	{
		this.counter++;
		console.log( "Counter: " + this.counter + " Number: " + this.number );
		if( this.counter >= this.number )
			window.setTimeout(function(){rhythm_player.start(); }, 500);
			//rhythm_player.start();
	}

	this.start = function()
	{
		console.log("Started");
		this.canPlay = 0;
		this.startTime =  new Date().getTime();
		this.play();
		this.id = w.setInterval( function() { rhythm_player.play() }, 10);
	}

	this.playSound = function(track)
	{
		console.log( "Elapsed Time: " + (new Date().getTime() - this.startTime ) );
		this.soundIndex[track]++;
		if( this.soundIndex[track] > 2)
			this.soundIndex[track] = 0;
		console.log( track + "  " + this.soundIndex[track]);
		this.audio[track][this.soundIndex[track]].play();
	}
}