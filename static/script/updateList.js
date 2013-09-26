function loadList()
{
	showList("official_list", "all_official");
	showList("personal_list", "all_personal");
	showList("public_list", "all_publicly_shared");
}

function showList(id, arg)
{
	var rhythms = getRhythmsInfo(arg);
	var list = d.getElementById(id);
	for( var i = 0; i < rhythms.length; i++)
	{
		var node = document.createElement('li');
		var name = document.createElement('a');
		name.innerText = rhythms[i].title;
		node.appendChild(name);
		list.appendChild(node);
		console.log(list)
		console.log(node)
	}
}

function getRhythmsInfo(arg)
{
    var url = 'rhythm_info?arg=' + arg;
    var xhr = getXMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send(null);
    var rhythmsInfos = JSON.parse(xhr.responseText).rhythms;
    for( var i = 0; i < rhythmsInfos.length ; i++)
        rhythmsInfos[i].date = new Date( Date.parse(rhythmsInfos[i].date));
    return rhythmsInfos;
}