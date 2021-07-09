ctx.translate(x, y);
ctx.rotate(90 * Math.PI / 180);
ctx.translate(-x, -y);
//draw
ctx.translate(x, y);
ctx.rotate(-(90 * Math.PI / 180));
ctx.translate(-x, -y);