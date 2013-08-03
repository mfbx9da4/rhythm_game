function Beat( time, color, radius, visible, silent )
{
	this.time = time;
	this.playedPlayBack = 0;
	this.playedPlayer = 0;
	this.radius = radius;
	this.visible = visible;
	this.silent = silent;
	this.circle = new Circle(0, 0, radius, color);

	this.duplicate = function()
	{
		return new Beat( time, color, radius, visible, silent);
	}

	this.draw = function()
	{
		if( this.visible == 1)
			this.circle.draw();
	}

	this.updateRadius = function(radius)
	{
		this.radius = radius;
		this.circle.radius = radius;
	}
}