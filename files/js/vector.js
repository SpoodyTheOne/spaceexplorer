class Vector
{
    static distance(pos1,pos2)
    {
        return this.magnitude({x:pos1.x-pos2.x,y:pos1.y-pos2.y});
    }

    static magnitude(vec)
    {
        return Math.sqrt(vec.x**2+vec.y**2);
    }

    static add(vec,vec2)
    {
        return {x:vec.x+vec2.x,y:vec.y+vec2.y};
    }

    static sub(vec,vec2)
    {
        return {x:vec.x-vec2.x,y:vec.y-vec2.y};
    }

    static mult(vec,vec2)
    {
        return {x:vec.x*vec2.x,y:vec.y*vec2.y};
    }

    static div(vec,vec2)
    {
        return {x:vec.x/vec2.x,y:vec.y/vec2.y};
    }

    static normalized(vec)
    {
        var mag = this.magnitude(vec);

        return this.div(vec,{x:mag,y:mag});
    }

    static toAngle(vec)
    {
        return Math.atan2(vec.y,vec.y);
    }
}