// This function returns an XMLHttpRequest:
function getXMLHttpRequest() {
    var xhr = null;
     
    if (window.XMLHttpRequest || window.ActiveXObject) {
        if (window.ActiveXObject) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch(e) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        } else {
            xhr = new XMLHttpRequest(); 
        }
    } else {
        alert("Your webbrowser doesn't suppot XMLHTTP!");
        return null;
    }     
    return xhr;
}

function sendSongRequest(song_name)
{
	var xhr = getXMLHttpRequest();
	xhr.open("GET", song_name, false);
	xhr.send(null);
	return parseXml( xhr.responseXML );
}

function parseXml( xml)
{
	var new_rhythm = null;
	
	// Load the notes:
	var rhythm = xml.getElementsByTagName("rhythm")[0];
	var tracks = rhythm.getElementsByTagName("track");
	var beats = [];
	for( var k = 0; k <tracks.length; k++ )
	{
		var track = tracks[k];
		var beatsT = [];
		var notes = track.getElementsByTagName("note");
		for( j = 0; j < notes.length; j++) {
			var visible = 1;
			var silent = 0;
			if( notes[j].attributes.getNamedItem("visible") != null )
				visible = Number(notes[j].attributes.getNamedItem("visible").nodeValue);
			if( notes[j].attributes.getNamedItem("silent") != null )
				silent = Number(notes[j].attributes.getNamedItem("silent").nodeValue);
			beatsT[j] = new Beat( Number(notes[j].childNodes[0].nodeValue), map_track_color[k], 40, visible, silent );
		}
		beats[k] = beatsT;
	}
	new_rhythm = new Rhythm( beats, Number( rhythm.getElementsByTagName("start")[0].childNodes[0].nodeValue ), 
											Number( rhythm.getElementsByTagName("length")[0].childNodes[0].nodeValue ) );
	
	
	// Load the name of the soud to play for each track:
	var sounds = xml.getElementsByTagName("sound");
	for( var i = 0; i < sounds.length; i++)
		map_track_sound.push(sounds[i].childNodes[0].nodeValue);
	
	// Load the name of the background sound:
	var song_background = xml.getElementsByTagName("backgroundsong");
	if( song_background.length == 1 )
		backgroundsong = song_background[0].childNodes[0].nodeValue;

	// Set the metronome:
	var metronome = xml.getElementsByTagName("metronome");
	if( metronome.length == 1 )
	{
		start_metronome = Number(metronome[0].getElementsByTagName("start")[0].childNodes[0].nodeValue);
		metronome_speed = Number(metronome[0].getElementsByTagName("speed")[0].childNodes[0].nodeValue);
		metronomeObject = new AdvancedMetronome(start_metronome, metronome_speed, 0, 5000);
	}

	return new RhythmTrainer(new_rhythm, metronomeObject, new Array(2,2,2,2,2,2), new Array(0,0,2,2,2,2));
}

function loadAudio(backGroundSong)
{
	metronome_sound = new Audio("sound/metronome/klack.wav");
	if( backGroundSong == 1)
		playbackSound = new Audio(backgroundsong)
	if( map_track_sound.length == 0 )
		alert("There is an error in the song.");
	else
	{
		for( i = 0; i < map_track_sound.length ; i++)
		{
			soundIndex[i] = 0;
			audio[i] = new Array();
			for( j = 0; j < 3 ; j++)
			{
				var snd = new Audio(map_track_sound[i]);
				snd.load();
				snd.addEventListener('canplaythrough', function() { 
		   				startoff();
					}, false);
				audio[i][j] = snd;
			}
		}
	}
}

function loadGameElements(backGroundSong, song_name)
{
	ctx.font="50px Arial";
	ctx.fillText("LOADING...", 0, 50);
	new_song = sendSongRequest(song_name);
	staticCircles = new StaticCircles(new_song.tracks);
	loadAudio(backGroundSong);
}