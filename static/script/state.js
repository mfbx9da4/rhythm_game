var map_state_str_to_params = {
	"playback": 
		{"visible": 0,
		"speed" : 1,
		"repetitions" : 3,
		"repetitions_to_play": 0},
	"visual":
		{"visible": 1,
		"speed" : 1,
		"repetitions" : 3,
		"repetitions_to_play": 3}, 
	"speed1":
		{"visible": 1,
		"speed" : 0.75,
		"repetitions" : 3,
		"repetitions_to_play": 3}, 
	"speed2":
		{"visible": 1,
		"speed" : 0.5,
		"repetitions" : 3,
		"repetitions_to_play": 3}
}


function State(state_str, rhythm, start_time, xscale, offset){
	this.name = state_str;
	this.params = map_state_str_to_params[state_str];
	this.rhythm_set = new RhythmSet(rhythm, this.params, start_time, xscale, offset);
	this.numRhythmsToBePlayed = this.params.repetitions
	this.complete = function(){
		var player_succeeded = this.rhythm_set.get_rhythms_played() >= this.params.repetitions_to_play;
		return player_succeeded;
	};
}