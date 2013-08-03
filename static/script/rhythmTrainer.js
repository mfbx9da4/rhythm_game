function RhythmTrainer(rhythm, metronomeTemp, stateRepitition, stateRepititionRequired)
{
	this.rhythm = rhythm;
	this.states = {"start":0, "playback":1, "visual":2, "speed1":3, "speed2":4 , "end":5 };
	this.state = this.states.playback;
	this.rhythms = [];

	this.tracks = rhythm.tracks;
	this.xscale = c.width / this.tracks;
  	this.offset = c.width % this.tracks + ( this.xscale / 2 );

	this.metronome = metronomeTemp;
	
	this.screenTime = 0;

	this.nextDisplayedDiffTime = 0;
	this.nextDisplayedState = 1;

	// The number of time left the rhythm has be played to progress to the next level:
	this.numberOfRhythmBeforeNextState = 0;

	// The number of time the rhyhtms is played in each state ( it's an array ):
    this.stateRepitition = stateRepitition;

    // This is used to know how many rhythm the player must got right in a state to progress to the next state:
    this.stateRepititionRequired = stateRepititionRequired;

    // This variable is used to know how many "right" rhythms the player played in a state:
    this.playerCounter = 0;

	this.createNextRhyhthms = function()
	{
		for( i = 0; i < this.stateRepitition[this.nextDisplayedState] ; i ++)
		{
			this.rhythms.push( this.rhythm.duplicate());
			this.rhythms[this.rhythms.length - 1].initialise(this.xscale, this.offset);
			this.rhythms[this.rhythms.length - 1].diff_time = this.nextDisplayedDiffTime;
			switch( this.nextDisplayedState )
			{
				case this.states.playback:
					this.rhythms[this.rhythms.length - 1].setvisible(0);
					break;
				case this.states.visual:
					this.rhythms[this.rhythms.length - 1].setvisible(1);
					break;
				case this.states.speed1:
					this.rhythms[this.rhythms.length - 1].setvisible(1);
					break;
				case this.states.speed2:
					this.rhythms[this.rhythms.length - 1].setvisible(1);
					break;
				default:
					this.rhythms[this.rhythms.length - 1].setvisible(0);
					break;
			}
			this.nextDisplayedDiffTime = this.rhythms[this.rhythms.length - 1].diff_time 
																		+ this.rhythms[this.rhythms.length - 1].rhythm_time;
		}
	}
	
	this.replayLastRhythm = function()
	{
		for( i = 0; i < this.stateRepitition[this.state] ; i ++)
		{
			this.rhythms.splice( 1, 0, this.rhythm.duplicate());
			this.rhythms[1].initialise(this.xscale, this.offset);
			this.rhythms[1].diff_time = this.rhythms[0].diff_time + this.rhythms[0].rhythm_time;
			switch( this.nextDisplayedState )
			{
				case this.states.playback:
					this.rhythms[0].setvisible(1);
					break;
				case this.states.visual:
					this.rhythms[0].setvisible(1);
					break;
				case this.states.speed1:
					this.rhythms[0].setvisible(1);
					break;
				case this.states.speed2:
					this.rhythms[0].setvisible(1);
					break;
			}
		}
	}

	this.updateOtherRhythms = function()
	{
		i = 1 + this.stateRepitition[this.state];
		while( i < this.rhythms.length )
		{
			this.rhythms[i].diff_time = this.rhythms[i-1].diff_time + this.rhythms[i-1].rhythm_time;
			i++;
		}
	}

	this.start = function(yscale)
	{
		this.start_time = new Date().getTime();
		this.yscale = yscale;
		this.start_rhythm = 0;
		this.state = this.states.playback;

		this.screenTime = c.height / yscale;

		// Iniatialise variables used to create dynamically the next rhythms to be displayed:
		this.nextDisplayedDiffTime = this.screenTime;
		this.nextDisplayedState = 1;

		// Initialise the variable used to determine when we go from a state to another:
		this.numberOfRhythmBeforeNextState = this.stateRepitition[this.state];
	}

	this.play = function(time, draw)
	{
		if( this.states == this.end )
		{
			return;
		}
		else
		{
			if ( this.rhythms.length > 0 && time > this.rhythms[0].diff_time + this.rhythms[0].rhythm_time + this.start_time )
			{
				this.numberOfRhythmBeforeNextState--;
				if( this.numberOfRhythmBeforeNextState == 0 )
				{
					if( this.playerCounter >= this.stateRepititionRequired[this.state] )
					{
						this.state++;
						this.playerCounter = 0;
					}
					else
					{
						this.replayLastRhythm();
						this.updateOtherRhythms();
					}
					this.numberOfRhythmBeforeNextState = this.stateRepitition[this.state];
				}
				this.rhythms.shift();
			}

			if( time + this.screenTime  >= this.nextDisplayedDiffTime + this.start_time )
			{
				this.createNextRhyhthms();
				this.nextDisplayedState++;
			}

			for( var i = 0; i < this.rhythms.length; i ++)
			{
		  		this.rhythms[i].play(this.start_time, time, this.yscale, draw);
			}
		}
	}

	this.getCurrentBeatTime = function (current_time, track)
	{
		if( this.state != this.states.start && this.state != this.states.playback )
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
		else
		{
			return -1;
		}
	}

	this.getCurrentBeatTimePlayback = function (current_time, track)
	{
		if( this.state == this.states.playback )
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
		else
		{
			return -1;
		}
	}

}