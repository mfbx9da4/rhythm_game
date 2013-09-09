function resizeGridTracks(new_tracks)
{
    var difference = number_line - new_tracks;
    if( difference < 0)
        for( var i = 0; i > difference; i--)
            addATrack();
    else if ( difference > 0 )
        for( var i = 0; i < difference; i++)
            removeATrack();
}

function addATrack()
{
    number_line++;
    var table = document.getElementById("rhythm_table");
    var new_line = document.createElement("tr");
    new_line.id = "row" + getZeros(number_line-1);
    table.appendChild(new_line);
    var first_row = document.createElement("td");
    new_line.appendChild(first_row);
    first_row.innerHTML = "<select class=\"song_dropdown\" name=\"\" id="+number_line+"> </select>";
    var counter = ( number_line - 1 ) * number_columns;
    console.log( counter + " " + number_line + " " + number_columns);
    for( var i = 0; i < number_columns ; i++)
    {
        var next_row = document.createElement("td");
        next_row.innerHTML = "<input type=\"checkbox\" id=\"cb"+ getZeros(counter)+"\" value=\"\">";
        new_line.appendChild(next_row);
        counter++;
    }
    songs.updateDropDown(number_line-1);
    updateCursors();
}

function removeATrack()
{
    number_line--;
    var lineToDelete = document.getElementById("row"+getZeros(number_line));
    lineToDelete.remove();
    updateCursors();
}