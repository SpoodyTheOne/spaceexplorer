class Planet {
  constructor(x, y, s, m, r) {
    this.pos = { x: x, y: y };
    this.vel = { x: 0, y: 0 };
    this.size = s;
    this.mass = m;
    this.richness = r;

    this.attract = function(other) {
      if (Vector.distance(this.pos, other.pos) > this.size) {
        var force =
          (Constant.G * (this.mass * other.mass)) /
          Vector.distance(this.pos, other.pos) ** 2;

        other.vel = Vector.add(
          other.vel,
          Vector.mult(Vector.normalized(Vector.sub(this.pos, other.pos)), {
            x: force,
            y: force
          })
        );
      } else {
        /*
        other.pos = Vector.mult(Vector.normalized(Vector.sub(other.pos,this.pos)),{x:this.size,y:this.size});
        */
        other.vel = Vector.div(other.vel,{x:1.15,y:1.15});
      }
    };

    this.draw = function() {
      ctx.beginPath();
      var camPos = Camera.toCamPos(this.pos);
      ctx.ellipse(
        camPos.x,
        camPos.y,
        this.size,
        this.size,
        0,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
    };
  }
}
