function createAdvancedRhythm(beats, diff_time, rhythm_time, trackNumber_to_trackID, track_to_song, nbColumns )
{
	var rhythm = new Rhythm(beats, diff_time, rhythm_time);
	rhythm.track_to_song = track_to_song;
	rhythm.trackNumber_to_trackID = trackNumber_to_trackID;
	rhythm.nbColumns = nbColumns;
	return rhythm; 
}