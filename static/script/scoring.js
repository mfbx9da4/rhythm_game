// This function is respomsible for upadting the scores:
// TODO: Need to account for the person pressing the key twice for one beat 
function updateScore (keyCode){
	var t = new Date().getTime();
	var track = map_key_track[keyCode];
	if( track == undefined || track >= new_song.tracks )
	  	return;
	var cur_beat_time = new_song.getCurrentBeatTime(t, track);
	if (cur_beat_time == -1){
		update = - 1;
	}
	else
	{
		update = (1 / (Math.abs(cur_beat_time - t))) * 100;
		if ( update > 100 )
			update = 100;
	}
	score = score + update
	var updateTag = document.getElementById("update");
	var scoreTag = document.getElementById("score");
	updateTag.innerHTML = Math.round(update);
	scoreTag.innerHTML = Math.round(score);
}