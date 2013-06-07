var print = console.log.bind(console)
var rand = Math.random

var m = function(m){var t = Array.prototype.slice.apply(arguments); return function(v){return v[m].apply(v,t.slice(1))}}

var addvv = function(v,w){var r = []; for (var i=0;i<v.length;i++) r.push(v[i]+w[i]); return r}
var mulvv = function(v,w){var r = []; for (var i=0;i<v.length;i++) r.push(v[i]*w[i]); return r}
var addvs = function(v,s){return v.map(function(v){return v+s})}
var mulvs = function(v,s){return v.map(function(v){return v*s})}
var divvs = function(v,s){return v.map(function(v){return v/s})}
var modvs = function(v,s){return v.map(function(v){return v%s})}

var canvas = document.getElementById('canvas')
canvas.size = function(){return [canvas.width,canvas.height]}
window.onresize = function(ev){
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight}
window.onresize(null)

var image = function(src){
	var r = new Image()
	r.src = src
	r.onload = function(){this.draw = function(ctx,x,y){ctx.drawImage(r,x,y)}}
	return r}
var entity = function(draw,pos){
	this.pos = pos
	this.draw = draw
	this.alive = function(){return true}
	
	this.x = function(){return this.pos[0]}
	this.y = function(){return this.pos[1]}

	entities.push(this)
	}
var agent = function(img,pos,hp,update,die){
	var r = new entity(img,pos)
	r.hp = hp
	r.die = die
	r.update = function(delta){
		if (!(0 <= this.pos[0] && this.pos[0] < canvas.size()[0] && 0 <= this.pos[1] && this.pos[1] < canvas.size()[1]))
			this.hurt(1)
		if (this.alive()) update.call(this,delta)
		if (this.alive()) {this.vel = addvv(this.vel,mulvs(addvs(modvs(this.pos,64),-32),0.0001))}
		if (this.alive()) {this.pos = addvv(this.pos,mulvs(this.vel,delta))}
		}
	r.hurt = function(i){this.hp -= i; if (this.hp <= 0) {this.alive = function(){return false}; this.die()}}
	r.vel = [0,0]
	agents.push(r)
	return r}

var myDrawImage = function(s){var t = image('images/'+s+'.png'); return function(ctx){if (t.draw) t.draw(ctx,this.x(),this.y())}}

var entities = []
var draw_entities = function(ctx){entities = entities.filter(m('alive')); entities.map(m('draw',ctx))}
var agents = []
var update_agents = function(delta){agents.slice(0).map(m('update',delta)); agents = agents.filter(m('alive'))}

new entity(myDrawImage('background2'),[0,0])

new entity(function(ctx){
	ctx.strokeStyle = 'rgba(0,0,0,.3)'
	ctx.lineWidth = 1
	for (var x = 32; x < canvas.width; x += 64)
		ctx.drawLine([x,0],[x,canvas.height])
	for (var y = 32; y < canvas.height; y += 64)
		ctx.drawLine([0,y],[canvas.width,y])
	},null)
new entity(function(ctx){
	ctx.fillStyle = 'white'
	ctx.font = '24px Consolas'
	ctx.textBaseline = 'top'
	ctx.fillText('entities: '+entities.length,32,32)
	ctx.fillText('hero.hp: '+hero.hp,32,64)
	},null)

var hero = agent(myDrawImage('hero'),divvs(canvas.size(),2),100,
	function(delta){hero.vel = addvv(mulvs(hero.vel,0.96), mulvs([(keys_down[37]?-1:0)+(keys_down[39]?1:0), (keys_down[38]?-1:0)+(keys_down[40]?1:0)], 0.05))},
	function(){})

var monster = function(){
	agent(myDrawImage('monster'),mulvv(canvas.size(),[rand(),rand()]),5,
		function(delta){
			this.vel[0] += (Math.random()-0.5) * 0.005 * delta
			this.vel[1] += (Math.random()-0.5) * 0.005 * delta
			if (hero.alive()) {
				if (this.pos[0] - 64 <= hero.pos[0] && hero.pos[0] <= this.pos[0] + 64 &&
					this.pos[1] - 64 <= hero.pos[1] && hero.pos[1] <= this.pos[1] + 64)
						{this.hurt(1); hero.hurt(1)}
				}
			},
		function(){monster(); if (Math.random() < 0.1) monster()}
		)}

// Handle keyboard controls
var keys_down = {}
addEventListener('keydown',function(e){keys_down[e.keyCode] = true},false)
addEventListener('keyup'  ,function(e){delete keys_down[e.keyCode]},false)

;(function(){
	var ctx = canvas.getContext('2d')
	ctx.drawLine = function(a,b){
		this.beginPath()
		this.moveTo(a[0]+0.5,a[1]+0.5)
		this.lineTo(b[0]+0.5,b[1]+0.5)
		this.stroke()
		this.closePath()}

	for (var i = 0; i < 15; i++) monster()
	var then = Date.now()
	setInterval(function(){
		var now = Date.now()
		update_agents(now - then)
		draw_entities(ctx)
		then = now
		},1) // Execute as fast as possible
	}())