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
    this.color = Math.round(Math.random()*16777215).toString(16);

    this.body.createFixture(planck.Circle(planck.Vec2(0, 0), this.size))

    this.attract = function (other) {
      var force =
        (Constant.G * (this.mass * other.m_mass)) /
        Vector.distance(this.pos, other.getPosition()) ** 2;

      var g = Vector.sub(this.pos, other.getPosition())

      other.applyForceToCenter(planck.Vec2(g.x * force, g.y * force));
    };

    this.draw = function () {

      var color = this.color;
      var decrement = 5;

      var planetLength = this.size / 50;

      for (var i = 0; i < planetLength; i++) {
        if (i > planetLength-4)
          ctx.fillStyle = this.adjust("#ff0000",20*(i-6));
        else
          ctx.fillStyle = this.adjust(color,-decrement * i);

        this.circle(this.size - i * 50);
      }

    };

    this.adjust = function(color, amount) {
      return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }

    this.circle = function (ssd) {
      ctx.beginPath();
      var camPos = Camera.toCamPos(this.pos);
      ctx.ellipse(
        camPos.x,
        camPos.y,
        ssd,
        ssd,
        0,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
    }
  }
}