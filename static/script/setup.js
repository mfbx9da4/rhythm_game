function startMetronome()
{
	setInterval( function(){flip();}, metronome_speed);
}


function startoff()
{
	counter ++;
	if( counter == map_track_sound.length )
		startScreen();
}

function startScreen()
{
	clearCanvas();
	drawStatic(new_song.tracks);
	// TODO: choose nice fonts scheme
	ctx.fillText("Press any key to start", 0, 50);
	d.addEventListener('keypress', function (e){ 
															this.removeEventListener('keypress',arguments.callee,false)
															start();
														}, false);
}

function start()
{
	m = d.getElementById("metronome");
	metronome = m.getContext("2d");
	metronome.fillStyle="#000000";

	new_song.start(0.3);

	d.addEventListener('keypress', function (e){keyHandler(e);}, false);


	// setInterval(function () { flip(); }, 1000);
	setTimeout(function(){startMetronome();}, start_metronome);
	setInterval(function () { animate(); }, 10);
	if( playbackSound != null )
	{
		playbackSound.volume = 0.1;
		playbackSound.play();
	}
}
