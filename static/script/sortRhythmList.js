
function compareByName(a,b)
{
    if( a.title < b.title)
        return -1;
    else if( a.title > b.title)
        return 1;
    else
        return 0;
}

function sortListByName()
{
    if( sortedTitle == 0)
        rhythmsInfo.sort(compareByName);
    else
        rhythmsInfo.reverse();
    sortedTitle = 1;
    sortedOwner = 0;
    sortedDate = 0;
    sortedType = 0;
    displayRhythmsInList();
}

function compareByDate(a,b)
{
    if( a.date > b.date)
        return -1;
    else if( a.date < b.date)
        return 1;
    else
        return 0;
}

function sortListByDate()
{
    if( sortedDate == 0)
        rhythmsInfo.sort(compareByDate);
    else
        rhythmsInfo.reverse();
    sortedTitle = 0;
    sortedOwner = 0;
    sortedDate = 1;
    sortedType = 0;
    displayRhythmsInList();
}

function compareByOwner(a,b)
{
    if( a.owner < b.owner)
        return -1;
    else if( a.owner > b.owner)
        return 1;
    else
        return 0;
}

function sortListByOwner()
{
    if( sortedOwner == 0)
        rhythmsInfo.sort(compareByOwner);
    else
        rhythmsInfo.reverse();
    sortedTitle = 0;
    sortedOwner = 1;
    sortedDate = 0;
    sortedType = 0;
    displayRhythmsInList();
}

function compareByType(a,b)
{
    if( a.type < b.type)
        return -1;
    else if( a.type > b.type)
        return 1;
    else
        return 0;
}

function sortListByType()
{
    if( sortedType == 0)
        rhythmsInfo.sort(compareByType);
    else
        rhythmsInfo.reverse();
    sortedTitle = 0;
    sortedOwner = 0;
    sortedDate = 0;
    sortedType = 1;
    displayRhythmsInList();
}