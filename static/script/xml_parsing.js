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

function parseXml( xml)
{
    var new_rhythms = [];
    
    // Load the notes:
    var rhythms = xml.getElementsByTagName("rhythm");
    for( var i = 0; i < rhythms.length; i++)
    {
        var rhythm = rhythms[i];
        var tracks = rhythm.getElementsByTagName("track");
        var beats = [];
        for( k = 0; k <tracks.length; k++ )
        {
            var track = tracks[k];
            var beatsT = [];
            var notes = track.getElementsByTagName("note");
            for( j = 0; j < notes.length; j++) {
                beatsT[j] = Number(notes[j].childNodes[0].nodeValue);
            }
            beats[k] = beatsT;
        }
        new_rhythms[i] = new Rhythm( beats, Number( rhythm.getElementsByTagName("start")[0].childNodes[0].nodeValue ), 
                                            Number( rhythm.getElementsByTagName("length")[0].childNodes[0].nodeValue ) );
    }
    
    // Load the name of the soud to play for each track:
    var sounds = xml.getElementsByTagName("sound");
    for( var i = 0; i < sounds.length; i++)
        map_track_sound.push(sounds[i].childNodes[0].nodeValue);
    
    // Load the name of the background sound:
    var song_background = xml.getElementsByTagName("backgroundsong");
    if( song_background.length == 1 )
        backgroundsong = song_background[0].childNodes[0].nodeValue;

    return new Song(new_rhythms, "ij");
}