
function Circle (x, y, radius, color)
{
	this.x = x;
	this.y = y;
	this.color = color;
	this.radius = radius;

	this.draw = function ()
	{
		ctx.beginPath();
		ctx.arc( this.x, this.y, this.radius, 0 ,2*Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.stroke();
	}
}
