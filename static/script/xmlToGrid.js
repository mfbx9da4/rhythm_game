function XMLToGrid ()
{

    this.requestRhythm  = function (rhythm_title)
    {
        xhr = this.sendRequest('rhythm_db?arg=get&title=' + rhythm_title);
        this.rhythm = xhr.responseXML;
    }
    
    this.sendRequest = function (url){
        var xhr = getXMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.send(null);
        return xhr;       
    }

    this.displayRhythmOnGrid = function ( title){
        emptyGrid();
        this.requestRhythm(title);
        loaded_rhythm = parseXml(this.rhythm);
        resizeGrid(loaded_rhythm.nbColumns);
        resizeGridTracks(loaded_rhythm.beats.length);
        for( var i = 0; i < loaded_rhythm.beats.length ; i ++)
        {
            for( var j = 0; j < loaded_rhythm.beats[i].length ; j ++)
            {
                var beat = loaded_rhythm.beats[i][j];
                var number = beat / (1 / number_columns );
                this.checkbox( Math.round(beat / (1 / number_columns )), i ); 
            }
        }


        for( var i = 0; i < loaded_rhythm.trackNumber_to_trackID.length; i++)
        {
            var song = loaded_rhythm.track_to_song[loaded_rhythm.trackNumber_to_trackID[i]];
            dropDown = document.getElementById(i+1);
            dropDown.value = song;
        }
    }

    this.checkbox = function(index, track)
    {
        checkbox_number = track * number_columns + index;
        if ( checkbox_number < 10 )
        {
            additional_zero = "00";
        }
        else if( checkbox_number < 100)
        {
            additional_zero = "0"
        }
        else
        {
            additional_zero = ""
        }
        checkbox_id = "cb" + additional_zero + checkbox_number;
        checkbox = document.getElementById(checkbox_id);
        checkbox.checked = true;
    }
}