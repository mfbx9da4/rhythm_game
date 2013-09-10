var map_state_str_to_params = {
	"playback": 
		{"visible": 0,
		"speed" : 1,
		"repetitions" : 3},
	"visual":
		{"visible": 1,
		"speed" : 1,
		"repetitions" : 3}, 
	"speed1":
		{"visible": 1,
		"speed" : 1.5,
		"repetitions" : 3}, 
	"speed2":
		{"visible": 1,
		"speed" : 2,
		"repetitions" : 3}
}


function State(state_str, rhythm){
	this.name = state_str;
	this.params = map_state_str_to_params[state_str];
	this.rhythm_set = new RhythmSet(rhythm, this.params);
	this.numRhythmsToBePlayed = this.params.repetitions
	this.complete = function(){
		var player_succeeded = this.rhythm_set.rhythms_played >= this.params.repetitions;
		return player_succeeded;
	};
}