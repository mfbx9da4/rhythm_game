function abstractRythm(beats){
	this.tracks = beats.length;
	this.beats = beats;
  	this.xscale = c.width / this.tracks;
  	this.offset = c.width % this.tracks + ( this.xscale / 2 );
}