
class Heart {
    constructor(canvas, ctx, image, x, y) {
      this.canvas = canvas;
      this.image = image;
      this.ctx = ctx;
      this.x = x;
      this.y = y;
    }
    draw(alpha) {
      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.translate(this.x * this.canvas.width, this.y * this.canvas.height);
      this.ctx.scale(2,2);
      
      this.ctx.drawImage(this.image, -16, -12, 32, 24);
      this.ctx.restore();
    }
    
  }
  export default Heart;