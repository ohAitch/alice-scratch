var print = console.log.bind(console)

var addvv = function(v,w) {var r = []; for (var i=0;i<v.length;i++) r.push(v[i]+w[i]); return r}
var mulvs = function(v,s) {return v.map(function(v){return v*s})}

var canvas = document.getElementById("canvas")
window.onresize = function(ev) {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight}
window.onresize(null)

var ctx = canvas.getContext("2d")

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

var agent = function(img,pos,hp,update,die){
	var r = new entity(pos,img)
	r.vel = [0,0]
	r.hp = hp
	r.update = function(delta){
		if (r.pos[0] < 0 || canvas.width <= r.pos[0] || r.pos[1] < 0 || canvas.height <= r.pos[1])
			r.hurt(1)
		if (r.alive()) update(delta)
		if (r.alive()) {
			// TODO mulvs
			r.pos[0] += r.vel[0] * delta
			r.pos[1] += r.vel[1] * delta
			}}
	r.hurt = function(i){r.hp -= i; if (r.hp <= 0) {r.pos = null; r.die()}}
	r.die = die
	r.alive = function(){return !!r.pos}
	agents.push(r)
	return r}

var entities = []
var draw_entities = function(ctx){entities = entities.filter(function(v){if (v.pos) v.draw(ctx); return !!v.pos})}
var agents = []
var update_agents = function(delta){agents.slice(0).map(function(v){v.update(delta)}); agents = agents.filter(function(v){return !!v.pos})}

new entity([0,0],"images/background2.png")

var hero = agent("images/hero.png",[canvas.width / 2, canvas.height / 2],100,
	function(delta){hero.vel = addvv(mulvs(hero.vel, 0.96), mulvs([(keysDown[37]?-1:0)+(keysDown[39]?1:0), (keysDown[38]?-1:0)+(keysDown[40]?1:0)], 0.05))},
	function(){})

var monster = function(){
	var r = agent("images/monster.png",[
		Math.random() * (canvas.width  - 64),
		Math.random() * (canvas.height - 64)
		],1,
		function(delta){
			r.vel[0] += (Math.random()-0.5) * 0.01 * delta
			r.vel[1] += (Math.random()-0.5) * 0.01 * delta
			if (hero.alive()) {
				if (r.pos[0] - 64 <= hero.pos[0] && hero.pos[0] <= r.pos[0] + 64 &&
					r.pos[1] - 64 <= hero.pos[1] && hero.pos[1] <= r.pos[1] + 64)
						{r.hurt(1); hero.hurt(1)}
				}
			},
		function(){monster(); if (Math.random() < 0.1) monster()}
		)
	return r}

// Handle keyboard controls
var keysDown = {}
addEventListener("keydown", function(e){keysDown[e.keyCode] = true}, false)
addEventListener("keyup"  , function(e){delete keysDown[e.keyCode]}, false)

// Draw everything
var render = function(){
	draw_entities(ctx)

	ctx.fillStyle = "white"
	ctx.font = "24px Consolas"
	ctx.textBaseline = "top"
	ctx.fillText("entities: "+entities.length, 32, 32)
	ctx.fillText("hero.hp: "+hero.hp, 32, 64)
	}

for (var i = 0; i < 100; i++) monster()
var then = Date.now()
setInterval(function(){
	var now = Date.now()
	update_agents(now - then)
	render()
	then = now
	}, 1) // Execute as fast as possible