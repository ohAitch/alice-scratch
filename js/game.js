// Create the canvas
var canvas = document.createElement("canvas")
var ctx = canvas.getContext("2d")
canvas.width = 1000
canvas.height = 700
document.body.appendChild(canvas)

var image = function(src){
	var r = new Image()
	r.ready = false
	r.onload = function(){r.ready = true}
	r.src = src
	r.draw = function(ctx,x,y){if (r.ready) ctx.drawImage(r,x,y);}
	return r}

var entity = function(pos,img){
	this.pos = pos
	this.image = image(img)
	this.draw = function(ctx){this.image.draw(ctx,this.pos[0],this.pos[1])}
	entities.push(this)
	}

var entities = []
var draw_entities = function(ctx){entities = entities.filter(function(v){if (v.pos) v.draw(ctx); return !!v.pos})}
var agents = []
var update_agents = function(delta){agents.slice(0).map(function(v){v.update(delta)}); agents = agents.filter(function(v){return !!v.pos})}

var bg = new entity([0,0],"images/background.png")

var hero = new entity([canvas.width / 2, canvas.height / 2],"images/hero.png")
hero.speed = 1
hero.hp = 100
hero.hurt = function(i){hero.hp -= i; if (hero.hp < 0) hero = null}
hero.update = function(delta){
	var vel = [(keysDown[37]?-1:0)+(keysDown[39]?1:0), (keysDown[38]?-1:0)+(keysDown[40]?1:0)]
	hero.pos[0] += vel[0] * hero.speed * delta
	hero.pos[1] += vel[1] * hero.speed * delta
	}
agents.push(hero)

var monster = function(){
	var r = new entity([
		Math.random() * (canvas.width  - 64),
		Math.random() * (canvas.height - 64)
		],"images/monster.png")
	r.vel = [0,0]
	r.update = function(delta){
		r.vel[0] += (Math.random()-0.5) * 0.001 * delta
		r.vel[1] += (Math.random()-0.5) * 0.001 * delta
		r.pos[0] += r.vel[0] * delta
		r.pos[1] += r.vel[1] * delta
		if (r.pos[0] - 64 <= hero.pos[0] && hero.pos[0] <= r.pos[0] + 64 &&
			r.pos[1] - 64 <= hero.pos[1] && hero.pos[1] <= r.pos[1] + 64) {
				r.pos = null; agents.push(monster()); if (Math.random() < 0.1) agents.push(monster())
				hero.hurt(1)
			}
		}
	return r}

// Handle keyboard controls
var keysDown = {}
addEventListener("keydown", function(e){keysDown[e.keyCode] = true}, false)
addEventListener("keyup"  , function(e){delete keysDown[e.keyCode]}, false)

// Draw everything
var render = function(){
	draw_entities(ctx)

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)"
	ctx.font = "24px Helvetica"
	ctx.textAlign = "left"
	ctx.textBaseline = "top"
	ctx.fillText("entities: "+entities.length, 32, 32)
	ctx.fillText("hp: "+hero.hp, 32, 64)
	}

// Let's play this game!
for (var i = 0; i < 100; i++) agents.push(monster())
var then = Date.now()
setInterval(function(){
	var now = Date.now()
	update_agents(now - then)
	render()
	then = now
	}, 1) // Execute as fast as possible