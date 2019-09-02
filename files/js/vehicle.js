class Part {

    constructor(img_, health_, mass_, pos_, ang_) {
        this.img = img_ || IMAGES.ROCKET;
        this.health = health_ || 100;
        this.body;

        this.body = world.createBody({
            type: "dynamic",
            position: planck.Vec2(0, 0)
        });

        this.body.createFixture({
            shape: planck.Box(25, 25, planck.Vec2(0, 0), 0)
        });

        this.body.setPosition(planck.Vec2(pos_.x, pos_.y));
        this.body.setAngle(ang_);

        this.body.setMassData({
            mass: mass_,
            center: planck.Vec2(),
            I: 1
        })

        this.body.setAngularDamping(0);

        this.body.m_awakeFlag = true;
        this.body.m_autoSleepFlag = true

        this.body.image = this.img;

        this.connectedBodies = [];
        var activated = false;
        var activateListen = {};
        var deactivateListen = {};
        var activateTick = {};

        this.onActivate = function (id, callback) {
            if (typeof callback != "function") {
                throw new Error("Callback can only be of type 'function'");
            }
            activateListen[id] = callback;
        }

        this.onDeactivate = function (id, callback) {
            if (typeof callback != "function") {
                throw new Error("Callback can only be of type 'function'");
            }
            deactivateListen[id] = callback;
        }

        this.onActivatedTick = function (id, callback) {
            if (typeof callback != "function") {
                throw new Error("Callback can only be of type 'function'");
            }
            activateTick[id] = callback;
        }

        this.offActivate = function (id) {
            delete activateListen[id];
        }

        this.offDeactivate = function (id) {
            delete deactivateListen[id];
        }

        this.offTick = function (id) {
            delete activateTick[id];
        }

        this.setActivated = function (state) {

            if (typeof state != "boolean") {
                throw new Error("State argument must be of type boolean");
            } else if (state == activated) {
                console.warn("This parts activated is already " + state);
            }

            if (state) {
                Object.keys(activateListen).forEach(key => {
                    activateListen[key]();
                })
            } else {
                Object.keys(deactivateListen).forEach(key => {
                    deactivateListen[key]();
                })
            }

            activated = state;

        }

        this.tick = function() {
            Object.keys(activateTick).forEach(key => {
                activateTick[key]();
            })
        }

        this.getConnectedParts = function(out)
        {

        }

        /* 
        ###-- handled by displacement renderer in game.js --###

        this.draw = function()
        {

            //draw stuff
        
        }
        */


    }

}

class Vehicle {

    constructor() {

        this.corePart = new Part(IMAGES.X25TEST, 100, 15, {
            x: 0,
            y: 0
        }, 0)

    }

}