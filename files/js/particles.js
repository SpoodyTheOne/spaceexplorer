var particles = new Array();

class Particle {
    constructor(options)
    {
        this.type = options.type || "rect";
        if (this.type === "img")
        {
            this.img = options.img;
        }
        this.size = options.size || 15;
        this.vel = options.vel || {x:0,y:0};
        this.drag = options.drag || 1;
        this.pos = options.pos || {x:0,y:0};
        this.color = options.color || "#000000";
        this.life = options.life || 60;

        this.draw = function() {

            var cpos = Camera.toCamPos(this.pos)

            if (this.type === "rect")
            {
                ctx.fillStyle = this.color;
                ctx.fillRect(cpos.x-this.size/2,cpos.y-this.size/2,this.size,this.size);
            } else if (this.type === "img")
            {
                ctx.drawImage(this.img,cpos.x-this.size/2,cpos.y-this.size/2,this.size,this.size);
            } else if (this.type === "circle")
            {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.ellipse(cpos.x,cpos.y,this.size,this.size,0,0,Math.PI*2,false);
                ctx.closePath();
                ctx.fill();
            }

            this.pos = Vector.add(this.pos,this.vel);
            this.vel = Vector.div(this.vel,{x:this.drag,y:this.drag});

            this.life--;

            if (this.life <= 0)
            {
                for(let i=0;i<particles.length;i++)
                {
                    if (particles[i] == this)
                    {
                        particles.splice(i,1);
                        break;
                    }
                }
            }
        }
    }
}

function particle(options) {
    if (!options.type)
        console.error("The function particle() options must contain a type");


        particles.push(new Particle(options));

}

