
function Circle (x, y, color)
{
	this.x = x;
	this.y = y;
	this.color = color;
	this.draw = function ()
	{
		ctx.beginPath();
		ctx.arc( this.x, this.y, 40, 0 ,2*Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.stroke();
	}
}
