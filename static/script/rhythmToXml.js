function RhythmToXml()
{
	this.parseRhythm = function ( advancedRhythm )
    {
        this.xml = document.createElement('xml');
        rhythm = document.createElement('rhythm');
        this.xml.appendChild(rhythm);

        columns = document.createElement('numbercolumns');
        columns.innerText = String(number_columns);
        rhythm.appendChild(columns);

        columns = document.createElement('numbercolumns');
        columns.innerText = String(number_columns);
        rhythm.appendChild(columns);

        tracks = document.createElement('tracks');
        rhythm.appendChild(tracks);

        var table = document.getElementById('main_table');
        for (var i = 0; i < advancedRhythm.tracks; i++) 
        {
            track = document.createElement('track');
            track.id = "track" + String(i);
            rhythm.appendChild(track)
            for (var j = 0; j < advancedRhythm.beats[i].length ; j++) 
            { 
                note = document.createElement('note');
                note.innerText = String(advancedRhythm.beats[i][j].time);
                track.appendChild(note);   
            }
            var song = document.createElement('song');
                    
            var att=document.createAttribute("trackid");
            att.value=track.id;
            song.setAttributeNode(att);

            var att=document.createAttribute("name");
            att.value=advancedRhythm.track_to_song[advancedRhythm.trackNumber_to_trackID[i]];      
            song.setAttributeNode(att);

            tracks.appendChild(song);
        
        }
        // check if track empty delete track else add sound
        this.delEmptyTracks();
        return this.xml;

    }

    this.delEmptyTracks = function ()
    {
        var tracks = this.xml.getElementsByTagName('track');
        var songs = this.xml.getElementsByTagName('song');
        for (var i = tracks.length - 1; i >= 0; i--)
        {
            console.log(tracks[i]);
            if (tracks[i].innerText == ''){
                //alert(tracks[i]);
                tracks[i].remove();
                //alert(songs[i]);
                songs[i].remove();
                
            }
        }
    }
}