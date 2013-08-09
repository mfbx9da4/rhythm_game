function GridToXML()
{
    this.submitRhythm = function ()
    {
        this.parseRhythm();
        this.send();
        updateRhythms('all');
    }

    this.parseRhythm = function ()
    {
        this.xml = document.createElement('xml');
        rhythm = document.createElement('rhythm');
        this.xml.appendChild(rhythm);
        var table = document.getElementById('main_table');
        for (var i = 0, row; row = table.rows[i+1]; i++) 
        {
            track = document.createElement('track');
            track.id = String(i);
            rhythm.appendChild(track)
            for (var j = 0, col; col = row.cells[j]; j++) 
            {
                // cb = checkbox
                var cb = col.childNodes[1]
                if (cb.checked)
                {
                    // (id - (row * 16)) / 16. 
                    var note_time = j / 16.0;
                    note = document.createElement('note');
                    note.innerText = String(note_time)
                    track.appendChild(note);
                }
            }
            // check if track empty delete track else add sound
            this.delEmptyTracks();
        }
    }

    this.delEmptyTracks = function ()
    {
        var tracks = this.xml.getElementsByTagName('track');
        for (var i = 0; i < tracks.length; i++)
        {
            if (tracks[i].innerText == ''){
                tracks[i].remove();
            }
        }

    }
    
    this.send = function () 
    {
        var xhr = getXMLHttpRequest();
        xhr.open("POST", '/rhythm_db', false);
        var xml_str = this.xml.innerHTML;
        var title = document.getElementById('rhythm_title').value;
        var request_body = title + '|' + xml_str
        xhr.send(request_body);
        console.log(request_body);
        console.log(xhr.responseText);
        document.getElementById('error').innerHTML = xhr.responseText;
    }
}