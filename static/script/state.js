var map_state_str_to_params = [
	{	
		"visible": 1,
		"speed" : 1,
		"repetitions" : 3,
		"repetitions_to_play": 0,
		"track_to_train": [1,1,1,1,1],
		"track_to_hide":[0,0,0,0,0]
	},
	{	
		"visible": 1,
		"speed" : 1,
		"repetitions" : 3,
		"repetitions_to_play": 3,
		"track_to_train": [1,0,0,0,0],
		"track_to_hide":[0,0,0,0,0]
	},
	{	
		"visible": 1,
		"speed" : 1,
		"repetitions" : 3,
		"repetitions_to_play": 3,
		"track_to_train": [1,0,0,0,0],
		"track_to_hide":[1,0,0,0,0]
	},
	{	
		"visible": 1,
		"speed" : 1,
		"repetitions" : 3,
		"repetitions_to_play": 3,
		"track_to_train": [1,1,0,0,0],
		"track_to_hide":[1,0,0,0,0]
	},
	{	
		"visible": 1,
		"speed" : 1,
		"repetitions" : 3,
		"repetitions_to_play": 3,
		"track_to_train": [1,1,0,0,0],
		"track_to_hide":[1,1,0,0,0]
	}	
]

function State(state_index, rhythm, start_time, xscale, offset){
	this.index = state_index;
	this.params = map_state_str_to_params[state_index];
	this.rhythm_set = new RhythmSet(rhythm, this.params, start_time, xscale, offset);
	this.numRhythmsToBePlayed = this.params.repetitions
	this.complete = function(){
		var player_succeeded = this.rhythm_set.get_rhythms_played() >= this.params.repetitions_to_play;
		return player_succeeded;
	};
}