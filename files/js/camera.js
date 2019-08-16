class Camera
{
    static position = {x:0,y:0};

    static toCamPos(pos)
    {
        return {x:pos.x-this.position.x+canvas.width/2,y:pos.y-this.position.y+canvas.height/2}
    }

    static moveTo(pos)
    {
        this.position = pos;
    }

    static fromCamPos(pos)
    {
        return {x:pos.x+this.position.x-canvas.width/2,y:pos.y+this.position.y-canvas.height/2}
    }
}