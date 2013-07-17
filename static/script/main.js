// This function is responsible to call all the other functions to: draw the static content ( circle at the bottom ), to
// draw the notes, and to play the notes.
function animate()
{
	var time = new Date().getTime();
	var draw = 0;
	playback(time);
	if( time - lastTime >= 20 )
	{
		draw = 1;
		lastTime = time;
		clearCanvas();
		drawStatic(new_song.tracks);
	}
	else
	{
		draw = 0;
	}
	new_song.play(time, draw);
}

// Clear the canvas ( the canvas is white after calling this function)
function clearCanvas () {
  	ctx.clearRect(0, 0, c.width, c.height);
}

// This function draw the circle at the bottom of the page as well as the letters in the circle ( corresponding to key for the track)
function drawStatic (n_sounds) 
{
	var spacing = c.width / n_sounds
	var padding = c.width % n_sounds + (spacing/2)
	for (i=0; i<n_sounds; i++){
		ctx.beginPath();
		var x_pos = padding + spacing*i
		ctx.arc(x_pos, time_position, 40, 0 , 2 * Math.PI);
		ctx.stroke();
		var character = String.fromCharCode(map_track_key[i]);
		ctx.font="30px Impact";
		ctx.fillStyle="#000000";
		ctx.fillText(character, x_pos - 8, time_position + 5);
	}
}

// Maybe make this a method of a DrawStatic object
function drawPlayed(track, n_sounds) 
{
  var spacing = c.width / n_sounds
  var padding = c.width % n_sounds + (spacing/2)
  var x_pos = padding + spacing*track
  ctx.beginPath();
  ctx.arc(x_pos, time_position, 40, 0 , 2 * Math.PI);
  ctx.fillStyle="red";
  ctx.fill();
  ctx.stroke();
  var character = String.fromCharCode(map_track_key[track]);
  ctx.font="30px Impact";
  ctx.fillStyle="#ffffff";
  ctx.fillText(character, x_pos - 8, time_position + 5);
}


// This function is called when the player pressa key, if the key key correspond to a track then the scroe is update and the notes is 
// played
// make the relevant static circle change color each time the key is played
// regardless of whether the player is in time
function keyHandler(e){
	var keyCode = String(e.keyCode);
	updateScore(keyCode);
	var p1 = d.getElementById("keypressed");
	p1.innerHTML = e.keyCode;
	var track = map_key_track[keyCode];
  	drawPlayed(track, new_song.tracks);
  	playSound(track);
	
}


// Play the sound corresponding to a particular track
function playSound(track){
	soundIndex[track]++;
	if( soundIndex[track] > 2)
		soundIndex[track] = 0;
	// -- DEBUGGING --
  	console.log(track)
  	console.log(soundIndex)
  	console.log(audio[track][soundIndex[track]])
  	// ---
	audio[track][soundIndex[track]].play();
}

// Play the notes in song.xml at the right time:
function playback(t)
{
	for ( track = 0; track < new_song.tracks; track ++)
	{
		var play = new_song.getCurrentBeatTimePlayback(t, track);
		if ( play == 1)
		{
			playSound(track);
		}
	}
}


// This function is respomsible for upadting the scores:
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
	var updateTag = d.getElementById("update");
	var scoreTag = d.getElementById("score");
	updateTag.innerHTML = update;
	scoreTag.innerHTML = score;
}

// TODO: get rid replace with horizontal line
function flip()
{
	if( metronome_state == 1)
		metronome.fillRect(0,0,c.width, c.height);
	else
		metronome.clearRect(0, 0, c.width, c.height);
	metronome_state = -metronome_state;

}

