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
	staticCircles.drawStatic();
	// TODO: choose nice fonts scheme
	ctx.fillText("Press any key to start", 0, 50);
	d.addEventListener('keypress', function (e){ 
															d.removeEventListener('keypress',arguments.callee,false)
															start();
														}, false);
}


playKeysFunction = null;
function start()
{

	new_song.start(0.3);

	playKeysFunction = function(e){keyHandler(e);};
	d.addEventListener('keypress', playKeysFunction, false);


	// setInterval(function () { flip(); }, 1000);
	setTimeout(function(){startMetronome();}, start_metronome);
	setInterval(function () { animate(); }, 10);
	if( playbackSound != null )
	{
		playbackSound.volume = 0.1;
		playbackSound.play();
	}
}
