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
    return new Rhythm( beats, 0, 0 );
}