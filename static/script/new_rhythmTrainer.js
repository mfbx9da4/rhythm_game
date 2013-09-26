function log(str){
	console.log(str);
}

function RhythmTrainer  (rhythm, metronomeTemp, stateRepitition, stateRepititionRequired)
{
	// The rhythm to learn:
	this.rhythm = rhythm;

	this.all_states_finished = false;

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

	// The number of time the rhyhtms is played in each state ( it's an array ):
    this.stateRepitition = stateRepitition;

    // This is used to know how many rhythm the player must got right in a state to progress to the next state:
    this.stateRepititionRequired = stateRepititionRequired;

    this.playing = 1;

    this.pauseTime = 0;

    // prepare next state and metronome?
	this.prepareState = function(index)
	{
		// create next metronome
		var new_metronome = this.metronome.duplicate();
		new_metronome.start_time_window = this.nextDisplayedDiffTime;
		
		this.createState(index);
		this.updateNextDisplayDiffTime(new_metronome);
		new_metronome.speed *= this.state.params.speed;
		new_metronome.diff_time *= this.state.params.speed;
		
		// add metronome		
		this.metronomes.push(new_metronome);
	}

	this.createState = function(index)
	{
		this.state = new State(index, this.rhythm, this.nextDisplayedDiffTime, this.xscale, this.offset);
		this.states.push(this.state);
	}

	
	this.updateNextDisplayDiffTime = function(new_metronome)
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

	this.start = function(yscale)
	{
		this.start_time = new Date().getTime();
		this.screenTime = c.height / yscale;
		this.yscale = yscale;
		this.start_rhythm = 0;

		this.nextDisplayedDiffTime = this.screenTime;
		this.states = []
		this.prepareState(0);
	}

	this.handleIfPlayerCompletedState = function()
	{
		if(this.state.complete())
		{
			this.metronomes.shift();
			var index_of_next_state = this.state.index + 1;
			this.prepareState(index_of_next_state)
		}	
		else
		{
			this.metronomes.shift();
			var index_of_next_state = this.state.index;
			this.prepareState(index_of_next_state)
		}

	}

	this.play = function(time, draw)
	{
		if( this.all_states_finished || this.playing == false)
			return;
		else
		{
			if ( this.state.rhythm_set.finished(this.start_time, time) )
				this.handleIfPlayerCompletedState();

			if (this.states.length > 0 && this.states[0].rhythm_set.left_canvas(this.start_time, time, this.yscale))
				this.states.shift();

			for( var i = 0; i < this.metronomes.length; i ++)
		  		this.metronomes[i].draw(this.start_time, time, this.yscale );

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
		rhythms = this.state.rhythm_set.rhythms;
		if( this.state.index != 0 )
		{
			for ( i = 0; i < rhythms.length; i++ ) 
			{
				if( track < rhythms[i].tracks )
				{
					var cur_beat_time = rhythms[i].getCurrentBeatTime(current_time, this.start_time, track);
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
		rhythms = this.state.rhythm_set.rhythms;
		for ( i = 0; i < rhythms.length; i++ ) 
		{
			if( track < rhythms[i].tracks )
			{
				var audio_index = rhythms[i].getCurrentBeatTimePlayback(current_time, this.start_time, track);
				if ( audio_index != -1)
				{
					return 1;
				}
			}
		}
		return -1;
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
		for( var j = 0; j < this.states.length ; j++)
		{
			for( var i = 0; i < this.states[j].rhythm_set.rhythms.length; i++ )
			{
				this.states[j].rhythm_set.rhythms[i].diff_time += shift_time;
			}
		}

		for( var i = 0; i < this.metronomes.length; i++ )
		{
			this.metronomes[i].start_time_window += shift_time;
			this.metronomes[i].end_time_window += shift_time;
		}
		this.nextDisplayedDiffTime += shift_time;
		
	}

}