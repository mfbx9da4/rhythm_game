function RhythmTrainer  (rhythm, metronomeTemp, stateRepitition, stateRepititionRequired)
{
	// The rhythm to learn:
	this.rhythm = rhythm;

	// Variable used for the state machine:
	// need to rm ambiguation between:
	// 		names of states and array of state objects
	// 		name of current state and current state object
	// this.states = array of state objects
	// this.state = current state object
	// this.state.name = name of current state
	this.order_of_states = ["start", "playback", "visual", "speed1", "speed2", "end"];


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

    // prepare next state and metronome?
	this.prepareNextState = function()
	{
		// create next metronome
		var new_metronome = this.metronome.duplicate();
		new_metronome.start_time_window = this.nextDisplayedDiffTime;
		
		this.createNextState();
		this.updateNextDisplayDiffTime();
		
		// add metronome		
		this.metronomes.push(new_metronome);
	}

	this.createNextState = function()
	{
		// create next state and add it to states
		var index_of_next_state = this.order_of_states.indexOf(this.state.name);
		var state_str = this.order_of_states[index_of_next_state];
		this.states.push(new State(state_str, this.rhythm));
	}
	
	this.updateNextDisplayDiffTime = function()
	{
		// update the next display time to be at the end of the last
		// rhythm of new state 
		var new_state = this.states.last();
		var last_rhythm = new_state.rhythm_set.rhythms.last();
		this.nextDisplayedDiffTime = last_rhythm.diff_time + last_rhythm.rhythm_time;

		// update the time window for the metronome
		new_metronome.end_time_window = this.nextDisplayedDiffTime;

		this.nextDisplayedDiffTime += this.screenTime;
	}

	this.replayLastRhythm = function()
	{
		var rhythms = this.state.rhythm_set.rhythms
		var diff_time = rhythms[0].diff_time + this.screenTime;
		this.metronomes.unshift(  this.metronome.duplicate() );
		this.metronomes[0].start_time_window = diff_time + rhythms[0].rhythm_time;
		// recreates rhythms for given state
		for( i = 0; i < this.state.params.repetitions ; i ++)
		{
			rhythms.splice( i + 1, 0, this.rhythm.duplicate());
			rhythms[i + 1].initialise(this.xscale, this.offset);
			rhythms[i + 1].diff_time = diff_time + rhythms[i].rhythm_time;
			switch( this.state )
			{	
				case this.states.playback:
					rhythms.last().setvisible(0);
					break;
				case this.states.visual:
					rhythms.last().setvisible(1);
					break;
				case this.states.speed1:
					rhythms.last().setvisible(1);
					rhythms.last().setRhyhtmLength(this.rhythm.rhythm_time * 0.60);
					break;
				case this.states.speed2:
					rhythms.last().setvisible(1);
					rhythms.last().setRhyhtmLength(this.rhythm.rhythm_time * 0.40);
					break;
				default:
					rhythms.last().setvisible(0);
					break;
			}
			diff_time = rhythms[i+1].diff_time;
		}
		this.metronomes[0].end_time_window = diff_time + rhythms[i].rhythm_time; 
	}

	this.updateOtherRhythms = function()
	{
		var rhythms = this.state.rhythm_set.rhythms
		// might need to change rhythms[1].rhythm_time IT WAS ORIGINALLY this.rhythms[1].rhythm_time 
		var shift_time = this.screenTime + ( this.state.params.repetitions * rhythms[1].rhythm_time );
		var i = 1 + this.state.params.repetitions;
		while( i < rhythms.length )
		{
			rhythms[i].diff_time += shift_time;
			i++;
		}


		i = 1;
		while( i < this.metronomes.length )
		{
			this.metronomes[i].start_time_window += shift_time;
			this.metronomes[i].end_time_window += shift_time;
			i++;
		}
		this.nextDisplayedDiffTime = rhythms.last().diff_time 
		                                +  rhythms.last().rhythm_time
		                                + this.screenTime;
	}

	this.start = function(yscale)
	{
		this.start_time = new Date().getTime();
		this.yscale = yscale;
		this.start_rhythm = 0;
		this.state = new State(this.order_of_states[0], rhythm);
		this.states = [this.state]

		this.screenTime = c.height / yscale;

		// Iniatialise variables used to create dynamically the next rhythms to be displayed:
		this.nextDisplayedDiffTime = this.screenTime;
		this.nextDisplayedState = 1;

		// Initialise the variable used to determine when we go from a state to another:
		this.numberOfRhythmBeforeNextState = this.state.repetitions;
	}

	this.endTimeOfCurrentRhythmHasPassed = function(cur_rhy)
	{
		var absolute_end_rhythm_time = cur_rhy.diff_time + cur_rhy.rhythm_time + this.start_time;
		var end_time_of_rhythm_has_passed = time >= absolute_end_rhythm_time;
		return end_time_of_rhythm_has_passed
	}

	this.noMoreRhythmsToBePlayed = function()
	{
		return this.state.numRhythmsToBePlayed == 0;
	}

	this.handleIfPlayerCompletedState = function()
	{
		if(this.state.complete())
		{
			this.metronomes.shift();
			this.prepareNextState();
			this.pause();
		}	
		else
		{
			this.metronomes.shift();
			this.replayLastRhythm();
			this.updateOtherRhythms();
			this.playerCounter = 0;
		}

	}

	this.play = function(time, draw)
	{
		if( all_states_finished || this.playing == false)
			return;
		else
		{
			if (this.state.rhythm_set.rhythms.length > 0)
				var cur_rhy = this.state.rhythm_set.rhythms[0]
				if (this.endTimeOfCurrentRhythmHasPassed(cur_rhy))
				{
					this.state.numRhythmsToBePlayed--;
					if(cur_rhy.played)
						this.state.rhythm_set.rhythms_played++;
					if(this.noMoreRhythmsToBePlayed())
					{
						this.handleIfPlayerCompletedState();
						this.numberOfRhythmBeforeNextState = this.state.params.repetitions;
					}
					this.rhythms.shift();
				}

			if (this.state.rhythm_set.left_canvas())
			{
				this.state.rhythm_set.remove();	
			}


			for( var i = 0; i < this.metronomes.length; i ++)
			{
		  		this.metronomes[i].draw(this.start_time, time, this.yscale );
			}

			for( var i = 0; i < this.states.length; i ++)
			{
				for (var j = 0; j < this.states[i].rhythm_set.rhythms.length; j++)
				{
					var rhy = this.states[i].rhythm_set.rhythms[j];
			  		rhy.play(this.start_time, time, this.yscale, draw);
				}
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
		c.style.webkitFilter = "blur(3px)";
		d.removeEventListener('keypress', playKeysFunction, false);
		d.addEventListener('keypress', function (e){ 	
			d.removeEventListener('keypress',arguments.callee,false);
			d.addEventListener('keypress', playKeysFunction, false);
			new_song.resume();
			c.style.webkitFilter = "blur(0px)"; }, false);
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
		{
			this.rhythms[i].diff_time += shift_time;
		}

		for( var i = 0; i < this.metronomes.length; i++ )
		{
			this.metronomes[i].start_time_window += shift_time;
			this.metronomes[i].end_time_window += shift_time;
		}
		this.nextDisplayedDiffTime += shift_time;
		
	}

}