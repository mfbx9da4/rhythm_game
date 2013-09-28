var edit = false;

function toggleEdit()
{
	if( !edit )
		showEditButtons();
	else
		removeEditButtons();
	edit = !edit;
}

function updateEdit()
{
	removeEditButtons();
	showEditButtons();
}

function removeEditButtons()
{
	buttons = document.getElementsByClassName("editButton");
	for( i = buttons.length - 1; i >= 0; i--)
	{
		document.body.removeChild(buttons[i]);
	}
}

function showEditButtons()
{
	var column_number = number_columns * ( number_line - 1 );
	for( i = 0 ; i < number_columns; i++)
	{
		var columnID = "cb"+getZeros(column_number+i); 
		showAddButton(i+1 ,columnID);
		showRemoveButton(i+1, columnID);
	} 
	showLastAddButton(i, columnID);
	
}

function showLastAddButton(number, id )
{
	button = document.createElement("img");
	button.src = "img/add.png";
	button.id = "a" + (number + 1);
	button.className = "editButton";
	document.body.appendChild(button);
    button.setAttribute("onload", "configureLastAddButton(\""+ id +"\", " + number + ")");
    button.setAttribute("onclick", "addColumns( 1, " + ( number + 1 ) + ")");
}

function configureLastAddButton(id, number)
{
	button = document.getElementById("a"+ (number + 1 ));
	cb = document.getElementById(id);
	pos = findPos(cb);
	button.style.position = 'absolute';
	var distance = getDistanceBetweenTwoCheckbox();
	button.style.left = pos.left + pos.width + (distance / 2 ) - ( button.offsetWidth / 2 );
	button.style.top = pos.top + pos.height + button.offsetHeight;	
}

function showAddButton(number, id )
{
	button = document.createElement("img");
	button.src = "img/add.png";
	button.id = "a" + number;
	button.className = "editButton";
	document.body.appendChild(button);
    button.setAttribute("onload", "configureAddButton(\""+ id +"\", " + number + ")");
    button.setAttribute("onclick", "addColumns( 1, " + number + ")");
}

function configureAddButton(id, number)
{
	button = document.getElementById("a"+number);
	cb = document.getElementById(id);
	pos = findPos(cb);
	button.style.position = 'absolute';
	var distance = getDistanceBetweenTwoCheckbox();
	button.style.left = pos.left - (distance / 2 ) - ( button.offsetWidth / 2 );
	button.style.top = pos.top + pos.height + button.offsetHeight;	
}

function showRemoveButton(number, id)
{
	button = document.createElement("img");
	button.src = "img/delete.png";
	button.id = "d" + number;
	button.className = "editButton";
 	document.body.appendChild(button);
    button.setAttribute("onload","configureRemoveButton(\""+ id +"\", " + number + ")");
    button.setAttribute("onclick", "removeColumns( 1, " + number + ")");

 }

function configureRemoveButton(id, number)
{
	button = document.getElementById("d"+number);   
	cb = document.getElementById(id);
	pos = findPos(cb);
	button.style.position = 'absolute';
	button.style.left = pos.left + ( pos.width / 2 ) - ( button.offsetWidth / 2 );
	button.style.top = pos.top + pos.height;
}

function getDistanceBetweenTwoCheckbox()
{
	var number = ( number_line - 1 ) * number_columns + 1;
	var number_other = ( number_line - 1 ) * number_columns + 2;
	return findPos(getCbNumber( number_other )).left - ( findPos(getCbNumber(number)).left + findPos(getCbNumber(number)).width );
}

function getCbNumber(id)
{
	return document.getElementById("cb"+getZeros(id));
}

function findPos(obj) 
{
    var curleft = curtop = 0;
    var width = obj.offsetWidth;
    var height = obj.offsetHeight;
    if (obj.offsetParent) 
    {
        while ( obj != document.body )
        {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
            obj = obj.offsetParent;
        } 
    }
    return new function(){ this.left = curleft; this.top = curtop; this.width = width; this.height = height };
}