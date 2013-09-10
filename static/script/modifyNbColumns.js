function resizeGrid(new_columns)
{
    var difference = number_columns - new_columns;
    if( difference < 0)
        addColumns(-difference, 1);
    else if ( difference > 0 )
        removeColumns(difference, 1);
}

function removeColumns(nb_columns_to_remove, row_number)
{
    var counter = 0;
    var table = document.getElementById('main_table');
    for (var i = 0, row; row = table.rows[i+1]; i++) 
    {
        var deleted_columns = 0;
        for (var j = 0, col; col = row.cells[j]; j++) 
        {           
            var cb = col.childNodes[0];
            if( j == row_number && deleted_columns < nb_columns_to_remove)
            {
                if( number_columns < 3)
                    return;
                deleted_columns++;
                row.removeChild(col);
                j--;
            }
            else if( j > 0 )
            {
                cb.id = "cb"+getZeros(counter);
                counter++;
            }
            
        }
    }   
    number_columns -= nb_columns_to_remove;  
    updateCursors();
}

function addColumns(nb_columns_to_add, row_number)
{
    var counter = 0;
    var table = document.getElementById('main_table');
    for (var i = 0, row; row = table.rows[i+1]; i++) 
    {
        var j = 0;
        var col = null;
        for ( ; col = row.cells[j]; j++) 
        {           
            var cb = col.childNodes[0];
            if( j == row_number)
            {
                var nextCell = row.cells[j];
                for( var k = 0; k < nb_columns_to_add; k++)
                {
                    var new_cell = document.createElement("td");
                    var checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.id = "cb"+getZeros(counter); 
                    new_cell.appendChild(checkbox);
                    row.insertBefore(new_cell, nextCell );
                    counter++;
                }
                j += ( nb_columns_to_add - 1);
            }
            else if( j > 0 )
            {
                cb.id = "cb"+getZeros(counter);
                counter++;
            }
        }
        if( j == row_number)
        {
            for( var k = 0; k < nb_columns_to_add; k++)
            {
                var new_cell = document.createElement("td");
                var checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = "cb"+getZeros(counter); 
                new_cell.appendChild(checkbox);
                row.appendChild(new_cell);
                counter++;
            }
        }
    }     
    number_columns += nb_columns_to_add;  
    updateCursors();
}