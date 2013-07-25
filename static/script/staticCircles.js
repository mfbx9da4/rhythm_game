function StaticCircles(tracks)
{
	this.tracks = new Array(tracks);
	for( i = 0 ; i < tracks; i++)
		this.tracks[i]=0;
	this.times = new Array(tracks);
	for( i = 0 ; i < tracks; i++)
		this.times[i]=0;
	this.nb_tracks = tracks;
	
	// This function draw the circle at the bottom of the page as well as the letters in the circle ( corresponding to key for the track)
	this.drawStatic = function(time) 
	{
		var spacing = c.width / this.nb_tracks
		var padding = c.width % this.nb_tracks + (spacing/2)
		for (i=0; i<this.nb_tracks; i++){
			ctx.beginPath();
			var x_pos = padding + spacing*i
			ctx.arc(x_pos, time_position, 40, 0 , 2 * Math.PI);
			if( this.tracks[i] == 1 )
			{
				ctx.fillStyle="red";
				ctx.fill();
				if( time - this.times[i] > 100 )
					this.tracks[i] = 0;
			}
			ctx.arc(x_pos, time_position, 40, 0 , 2 * Math.PI);
			ctx.stroke();
			var character = String.fromCharCode(map_track_key[i]);
			ctx.font="30px Impact";
			ctx.fillStyle="#000000";
			ctx.fillText(character, x_pos - 8, time_position + 5);
		}
	}

	// Maybe make this a method of a DrawStatic object
	this.playedNote = function(track, time) 
	{
	  this.tracks[track] = 1;
	  this.times[track] = time;
	}
}