function updateCursors()
{
    if( cursorAdd != null )
        cursorAdd.updateCursor();
    if( cursorRemove != null )
        cursorRemove.updateCursor();
}

function CreateAddCursor(image)
{
    var cursor = new Cursor(image);

    cursor.getMax = function()
    {
        return number_columns + 1;
    }

    cursor.updateCursor = function ()
    {   
        if( this.index > (number_columns + 1) )
            this.index = number_columns + 1;
        if( this.index < ( number_columns + 1 ) )
        {
            var number = ( number_line - 1 ) * number_columns - 1 + this.index;
            var rectObj = this.getRectObj(number);
            this.cursor.style.left = rectObj.left - ( this.getDistanceBetweenTwoCheckbox() / 2 ) - ( this.cursor.width / 2);
            this.cursor.style.top = rectObj.top + rectObj.height;
        }
        else
        {
            var number = ( number_line - 1 ) * number_columns - 1 + ( this.index - 1 );
            var rectObj = this.getRectObj(number);
            this.cursor.style.left = rectObj.left + rectObj.width + ( this.getDistanceBetweenTwoCheckbox() / 2 ) - ( this.cursor.width / 2);
            this.cursor.style.top =rectObj.top + rectObj.height;
        }
    }
    cursor.cursor.onload = function(){ cursor.updateCursor(); };
    return cursor;
}

function CreateRemoveCursor(image)
{
    var cursor = new Cursor(image);

    cursor.getMax = function()
    {
        return number_columns;
    }

    cursor.updateCursor = function ()
    {   
        if( this.index > number_columns  )
            this.index = number_columns;
        var number = ( number_line - 1 ) * number_columns - 1 + this.index;
        var rectObj = this.getRectObj(number);
        this.cursor.style.left = rectObj.left + ( rectObj.width / 2 ) - ( this.cursor.width / 2);
        this.cursor.style.top = rectObj.top + rectObj.height;
    }
    cursor.cursor.onload = function() { cursor.updateCursor(); };
    return cursor;
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

function Cursor( image )
{

    this.getDistanceBetweenTwoCheckbox = function()
    {
        var number = ( number_line - 1 ) * number_columns + 1;
        var number_other = ( number_line - 1 ) * number_columns + 2;
        return this.getRectObj(number_other).left - ( this.getRectObj(number).left + this.getRectObj(number).width );
    }

    this.getRectObj = function( number)
    {
        var element = document.getElementById("cb"+getZeros(number));
        //return element.getBoundingClientRect();
        return findPos(element);
    }
    this.moveCursorLeft = function(  )
    {
        if( this.index > 1 )
        {
            this.index -= 1;
            this.updateCursor();
        }
    }

    this.moveCursorRight = function(  )
    {
        if( this.index < this.getMax() )
        {
            this.index += 1;
            this.updateCursor();
        }
    }

    this.createCursor = function(image)
    {
        this.cursor = document.createElement("img");
        this.cursor.src = image;
        this.cursor.style.position = 'absolute';
        document.body.appendChild(this.cursor);
    }

    this.getIndex = function()
    {
        return this.index;
    }

    this.index = 1;
    this.createCursor(image);
}