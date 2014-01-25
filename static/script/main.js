// This function is responsible to call all the other functions to: draw the static content ( circle at the bottom ), to
// draw the notes, and to play the notes.
function animate()
{
	var time = new Date().getTime();
	var draw = 0;
	playback(time);
	if( time - lastTime >= 2 )
	{
		draw = 1;
		lastTime = time;
		clearCanvas();
		staticCircles.drawStatic(time);
	}
	else
	{
		draw = 0;
	}
	new_song.play(time, draw);
	displayMetronome();
}

// Clear the canvas ( the canvas is white after calling this function)
function clearCanvas () {
  	ctx.clearRect(0, 0, c.width, c.height);
}


// This function is called when the player pressa key, if the key key correspond to a track then the scroe is update and the notes is 
// played
// make the relevant static circle change color each time the key is played
// regardless of whether the player is in time
function keyHandler(e){
	var keyCode = String(e.keyCode);
	updateScore(keyCode);
	var p1 = d.getElementById("keypressed");
	//p1.innerHTML = e.keyCode;
	var track = map_key_track[keyCode];
  	staticCircles.playedNote(track, new Date().getTime());
  	playSound(track);
	
}


// Play the sound corresponding to a particular track
function playSound(track){
	soundIndex[track]++;
	if( soundIndex[track] > 2)
		soundIndex[track] = 0;
	// -- DEBUGGING --
  	// console.log(track)
  	// console.log(soundIndex)
  	// console.log(audio[track][soundIndex[track]])
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


// TODO: get rid replace with horizontal line
function flip()
{
	metronome_state = -metronome_state;
	metronome_sound.play();
}


function displayMetronome()
{
	ctx.fillStyle="#FFFFFF";
	ctx.fillRect(5, 5, 30, 30);
	ctx.fillStyle="#000000";
	if( metronome_state == 1)
		ctx.fillRect(5, 18, 30, 4);
}