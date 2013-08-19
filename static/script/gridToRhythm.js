function GridToRhythm()
{
	this.parseRhythm = function ()
    {
        var table = document.getElementById('main_table');
        var beats = [];
    	var trackNumber_to_trackID = [];
    	var track_to_song = {};
        for (var i = 0, row; row = table.rows[i+1]; i++) 
        {
            var trackId = "track" + String(i);
            trackNumber_to_trackID[i-1] = trackId;
            var beatsT = [];
            for (var j = 0, col; col = row.cells[j]; j++) 
            {           
                var cb = col.childNodes[0]
                if( j == 0 )
                {    
                    track_to_song[trackId] = cb.options[cb.selectedIndex].value;
                }
                else
                {
                    if (cb.checked)
                    {
                        var note_time = ( j - 1 ) / 16.0;
                      	beatsT.push(new Beat(note_time, 0, 0, 1, 0));
                    }
                }
                
            }
            beats[i] = beatsT;       
        }       
        var rhythm = createAdvancedRhythm( beats, 0, 0, trackNumber_to_trackID, track_to_song );
        this.delEmptyTracks(rhythm);
        return rhythm;
    }


    this.delEmptyTracks = function (rhythm)
    {
        for (var i = rhythm.tracks - 1; i >= 0; i--)
        {
            if (rhythm.beats[i].length == 0 ){
                rhythm.beats.splice(i, 1);
                rhythm.trackNumber_to_trackID.splice(i,1); 
                rhythm.tracks--;               
            }
        }
    }
    
}