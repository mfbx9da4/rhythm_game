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
    // Load the notes:
    var rhythms = xml.getElementsByTagName("rhythm");
   
    var rhythm = rhythms[0];
    var tracks = rhythm.getElementsByTagName("track");
    var beats = [];
    var trackNumber_to_trackID = [];
    for( k = 0; k <tracks.length; k++ )
    {
        var track = tracks[k];
        var beatsT = [];
        trackNumber_to_trackID[k] = track.getAttribute("id");
        var notes = track.getElementsByTagName("note");
        for( j = 0; j < notes.length; j++) {
            beatsT[j] = Number(notes[j].childNodes[0].nodeValue);
        }
        beats[k] = beatsT;
    }

    var songs = rhythm.getElementsByTagName("song");
    var track_to_song = {};
    for( k = 0; k < songs.length; k++ )
    {
        var song = songs[k].getAttribute("name");
        var track_id = songs[k].getAttribute("trackid");
        track_to_song[track_id] = song;
    }

    var columns = rhythm.getElementsByTagName("numbercolumns");
    var nbColumns = Number(columns[0].childNodes[0].nodeValue);

    return new createAdvancedRhythm( beats, 0, 0, trackNumber_to_trackID, track_to_song, nbColumns );
}