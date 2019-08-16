class Planet {
  constructor(x, y, s, m, r) {
    this.pos = {
      x: x,
      y: y
    };
    this.vel = {
      x: 0,
      y: 0
    };
    this.size = s;
    this.mass = m;
    this.richness = r;
    this.body = world.createBody({
      type: "static",
      position: planck.Vec2(this.pos.x, this.pos.y)
    })

    this.body.createFixture(planck.Circle(planck.Vec2(0, 0), this.size))

    this.attract = function (other) {
      var force =
        (Constant.G * (this.mass * other.m_mass)) /
        Vector.distance(this.pos, other.getPosition()) ** 2;

      var g = Vector.sub(this.pos, other.getPosition())

      other.applyForceToCenter(planck.Vec2(g.x * force, g.y * force));
    };

    this.draw = function () {
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