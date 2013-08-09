function RhythmTrainer(rhythm, metronomeTemp, stateRepitition, stateRepititionRequired)
{
	// The rhythm to learn:
	this.rhythm = rhythm;

	// Variable used for the state machine:
	this.states = {"start":0, "playback":1, "visual":2, "speed1":3, "speed2":4 , "end":5 };
	this.state = this.states.playback;

	// The next rhythms which will be played:
	this.rhythms = [];

	// Information used for the display of the rhythm:
	this.tracks = rhythm.tracks;
	this.xscale = c.width / this.tracks;
  	this.offset = c.width % this.tracks + ( this.xscale / 2 );

  	// This is the template metronome:
	this.metronome = metronomeTemp;

	// This are the actual metronome:
	this.metronomes = [];
	
	// This is used to know how long it takes a note to go from the top to the bottom of the screen:
	this.screenTime = 0;

	// This is used to know what is the diff time of the next rhythm which will be displayed ( which is not 
	// yet on the screen)
	this.nextDisplayedDiffTime = 0;

	// This variable is used to know which state will the next rhyhtm be in:
	this.nextDisplayedState = 1;

	// The number of time left the rhythm has be played to progress to the next level:
	this.numberOfRhythmBeforeNextState = 0;

	// The number of time the rhyhtms is played in each state ( it's an array ):
    this.stateRepitition = stateRepitition;

    // This is used to know how many rhythm the player must got right in a state to progress to the next state:
    this.stateRepititionRequired = stateRepititionRequired;

    // This variable is used to know how many "right" rhythms the player played in a state:
    this.playerCounter = 0;

    this.playing = 1;

    this.pauseTime = 0;

	this.createNextRhythms = function()
	{
		this.metronomes.push( this.metronome.duplicate() );
		this.metronomes[this.metronomes.length-1].start_time_window = this.nextDisplayedDiffTime;
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
					this.rhythms[this.rhythms.length - 1].setRhyhtmLength(this.rhythm.rhythm_time * 0.60);
					break;
				case this.states.speed2:
					this.rhythms[this.rhythms.length - 1].setvisible(1);
					this.rhythms[this.rhythms.length - 1].setRhyhtmLength(this.rhythm.rhythm_time * 0.40);
					break;
				default:
					this.rhythms[this.rhythms.length - 1].setvisible(0);
					break;
			}
			this.nextDisplayedDiffTime = this.rhythms[this.rhythms.length - 1].diff_time 
																+ this.rhythms[this.rhythms.length - 1].rhythm_time;
		}
		this.metronomes[this.metronomes.length-1].end_time_window = this.nextDisplayedDiffTime; 
		this.nextDisplayedDiffTime += this.screenTime;
	}
	
	this.replayLastRhythm = function()
	{
		var diff_time = this.rhythms[0].diff_time + this.screenTime;
		this.metronomes.unshift(  this.metronome.duplicate() );
		this.metronomes[0].start_time_window = diff_time + this.rhythms[0].rhythm_time;
		for( i = 0; i < this.stateRepitition[this.state] ; i ++)
		{
			this.rhythms.splice( i + 1, 0, this.rhythm.duplicate());
			this.rhythms[i + 1].initialise(this.xscale, this.offset);
			this.rhythms[i + 1].diff_time = diff_time + this.rhythms[i].rhythm_time;
			switch( this.state )
			{
				case this.states.playback:
					this.rhythms[this.rhythms.length - 1].setvisible(0);
					break;
				case this.states.visual:
					this.rhythms[this.rhythms.length - 1].setvisible(1);
					break;
				case this.states.speed1:
					this.rhythms[this.rhythms.length - 1].setvisible(1);
					this.rhythms[this.rhythms.length - 1].setRhyhtmLength(this.rhythm.rhythm_time * 0.60);
					break;
				case this.states.speed2:
					this.rhythms[this.rhythms.length - 1].setvisible(1);
					this.rhythms[this.rhythms.length - 1].setRhyhtmLength(this.rhythm.rhythm_time * 0.40);
					break;
				default:
					this.rhythms[this.rhythms.length - 1].setvisible(0);
					break;
			}
			diff_time = this.rhythms[i+1].diff_time;
		}
		this.metronomes[0].end_time_window = this.nextDisplayedDiffTime; 
	}

	this.updateOtherRhythms = function()
	{
		var shift_time = this.screenTime + ( this.stateRepitition[this.state] * this.rhythms[1].rhythm_time );
		var i = 1 + this.stateRepitition[this.state];
		while( i < this.rhythms.length )
		{
			this.rhythms[i].diff_time += shift_time;
			i++;
		}
		i = 0;
		while( i < this.metronomes.length )
		{
			this.metronomes[i].start_time_window += shift_time;
			this.metronomes[i].end_time_window += shift_time;
			i++;
		}
		this.nextDisplayedDiffTime = this.rhythms[this.rhythms.length-1].diff_time 
		                                +  this.rhythms[this.rhythms.length-1].rhythm_time
		                                + this.screenTime;
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
		if( this.state == this.states.end || this.playing == false)
		{

			return;
		}
		else
		{
			if ( this.rhythms.length > 0 && time >= this.rhythms[0].diff_time + this.rhythms[0].rhythm_time 
																									+ this.start_time )
			{
				this.numberOfRhythmBeforeNextState--;
				
				if( this.rhythms[0].played == 1)
					this.playerCounter++;

				if( this.numberOfRhythmBeforeNextState == 0 )
				{
					if( this.playerCounter >= this.stateRepititionRequired[this.state] )
					{
						this.metronomes.shift();
						this.state++;
						this.playerCounter = 0;
						this.pause();
						c.style.webkitFilter = "blur(3px)";
						d.removeEventListener('keypress', playKeysFunction, false);
 						d.addEventListener('keypress', function (e){ 	d.removeEventListener('keypress',arguments.callee,false);
 																		d.addEventListener('keypress', playKeysFunction, false);
 																		new_song.resume();
 																		c.style.webkitFilter = "blur(0px)"; }, false);
					}
					else
					{
						this.metronomes.shift();
						this.replayLastRhythm();
						this.updateOtherRhythms();
						this.playerCounter = 0;
					}
					this.numberOfRhythmBeforeNextState = this.stateRepitition[this.state];
				}
				this.rhythms.shift();
			}

			if( time + this.screenTime  >= this.nextDisplayedDiffTime + this.start_time )
			{
				this.createNextRhythms();
				this.nextDisplayedState++;
			}

			for( var i = 0; i < this.metronomes.length; i ++)
			{
		  		this.metronomes[i].draw(this.start_time, time, this.yscale );
			}

			for( var i = 0; i < this.rhythms.length; i ++)
			{
		  		this.rhythms[i].play(this.start_time, time, this.yscale, draw);
			}
		}
	}

	this.keyHandler = function(e)
	{
		this.play();
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

	this.pause = function()
	{
		this.playing = false;
		this.pauseTime = new Date().getTime();
	}

	this.resume = function()
	{
		if( !this.playing)
		{
			var shift_time = new Date().getTime() - this.pauseTime;
			this.shiftGame(shift_time);
			this.playing = true;
		}
	}

	this.shiftGame = function(shift_time)
	{
		for( var i = 0; i < this.rhythms.length; i++ )
			this.rhythms[i].diff_time += shift_time;
		for( var i = 0; i < this.metronomes.length; i++ )
		{
			this.metronomes[i].start_time_window += shift_time;
			this.metronomes[i].end_time_window += shift_time;
		}
		this.nextDisplayedDiffTime += shift_time;
		
	}

}