var print = console.log.bind(console)
var rand = Math.random
var sum = function(v){var r = 0; for (var i=0;i<v.length;i++) r += v[i]; return r}
var putE = function(a,b){for (v in b) a[v]=b[v]; return a}
var sign = function(v){return v? (v < 0? -1 : 1) : 0}

var argslice = function(args,i){return Array.prototype.slice.apply(args).slice(i)}
var m = function(m){var args = argslice(arguments,1);
	return args.length == 0? function(v){var r = v[m]; return r instanceof Function? r.call(v) : r}
	:      args.length == 1? function(v){var r = v[m]; return r instanceof Function? r.call(v,args[0]) : (v[m]=args[0])}
	:                        function(v){return v[m].apply(v,args)}}
var extend = function(sup,sub){
	sub.prototype.__proto__ = sup.prototype
	sub.prototype.super_ = function(){sup.prototype.constructor.apply(this,arguments)}
	return sub}
var fconsE = function(self,slot,f){var t = self[slot]; self[slot] = function(){if (t) t.apply(this,arguments); f.apply(this,arguments)}; return self}
Function.prototype.cmp = function(f){var t = this; return function(){return t.call(this,f.apply(this,arguments))}}
var not = function(v){return !v}
var is = function(a,b){return a === b}

var polar = function(r,t){return [r*Math.cos(t), r*Math.sin(t)]}
var TAU = Math.PI*2

var addvv = function(v,w){var r = []; for (var i=0;i<v.length;i++) r.push(v[i]+w[i]); return r}
var subvv = function(v,w){var r = []; for (var i=0;i<v.length;i++) r.push(v[i]-w[i]); return r}
var mulvv = function(v,w){var r = []; for (var i=0;i<v.length;i++) r.push(v[i]*w[i]); return r}
var addvs = function(v,s){return v.map(function(v){return v+s})}
var mulvs = function(v,s){return v.map(function(v){return v*s})}
var divvs = function(v,s){return v.map(function(v){return v/s})}
var modvs = function(v,s){return v.map(function(v){return v%s})}
var absv = function(v){return Math.sqrt(sum(mulvv(v,v)))}
var sumv = function(v){var r = v[0]; for (var i=1;i<v.length;i++) r = addvv(r,v[i]); return r}
var signv = function(v){return v.map(sign)}
var norm = function(v){var t = absv(v); return t == 0? v : divvs(v,t)}

var canvas = document.getElementById('canvas')
canvas.size = function(){return [canvas.width,canvas.height]}
window.onresize = function(e){
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight}
window.onresize(null)

var ctx = canvas.getContext('2d')
ctx.drawLine = function(a,b){
	this.beginPath()
	this.moveTo(a[0]+0.5,a[1]+0.5)
	this.lineTo(b[0]+0.5,b[1]+0.5)
	this.stroke()
	this.closePath()}

var pos = function(pos){this.pos = pos}
pos.prototype.x = function(){return this.pos[0]}
pos.prototype.y = function(){return this.pos[1]}
var agent = extend(pos,function(pos,hp,update,die){
	this.super_(pos)
	this.hp = hp
	this.die = die
	this.update = function(delta){
		if (!(0 <= this.pos[0] && this.pos[0] < canvas.size()[0] && 0 <= this.pos[1] && this.pos[1] < canvas.size()[1]))
			this.hurt(1)
		if (!this.dead) update.call(this,delta)
		if (!this.dead) {
			var t = this.pos
			this.vel = mulvs(this.vel,0.96)
			this.vel = addvv(this.vel,sumv(agents.map(function(v){var dir = subvv(t,v.pos); return absv(dir) < 60? mulvs(norm(dir),0.05) : [0,0]})))
			this.vel = addvv(this.vel,mulvs(signv(addvs(modvs(this.pos,64),-32)),0.005))
			this.pos = addvv(this.pos,mulvs(this.vel,delta))
			}}
	this.hurt = function(i){this.hp -= i; if (this.hp <= 0) {this.dead = true; this.die()}}
	this.vel = [0,0]

	entities.push(this)
	agents.push(this)
	})

var imagef = function(v){ // (v[,X,Y])
	var ready = null
	var t = putE(new Image(),{src:'images/'+v+'.png', onload:function(){ready = true}})
	var XY = argslice(arguments,1)
	return function(ctx){if (ready) {
		if (XY[0]) ctx.drawImage(t,this.x(),this.y(),XY[0],XY[1])
		else ctx.drawImage(t,this.x(),this.y())
		}}}

var entities = []
var draw_entities = function(ctx){(entities = entities.filter(not.cmp(m('dead')))).map(m('draw',ctx))}
var agents = []
var update_agents = function(delta){agents.slice(0).map(m('update',delta)); agents = agents.filter(not.cmp(m('dead')))}

entities.push(fconsE(new pos([0,0]),'draw',imagef('background2')))
entities.push(fconsE({},'draw',function(ctx){
	ctx.strokeStyle = 'rgba(0,0,0,.3)'
	ctx.lineWidth = 1
	for (var x = 32; x < canvas.width; x += 64)
		ctx.drawLine([x,0],[x,canvas.height])
	for (var y = 32; y < canvas.height; y += 64)
		ctx.drawLine([0,y],[canvas.width,y])
	}))
entities.push(fconsE({},'draw',function(ctx){
	ctx.fillStyle = 'white'
	ctx.font = '24px Consolas'
	ctx.textBaseline = 'top'
	ctx.fillText('entities: '+entities.length,32,32)
	ctx.fillText('hero.hp: '+hero.hp,32,64)
	}))

var make_food     = function(){return fconsE(new agent(mulvv(canvas.size(),[rand(),rand()]),1,function(delta){},function(){}),'draw',imagef('food'   ,64,64))}
var make_weapon   = function(){return fconsE(new agent(mulvv(canvas.size(),[rand(),rand()]),1,function(delta){},function(){}),'draw',imagef('weapon' ,64,64))}
var make_station  = function(){return fconsE(new agent(mulvv(canvas.size(),[rand(),rand()]),1,function(delta){},function(){}),'draw',imagef('station',64,64))}

for (var i=0;i<10;i++) {
	make_food()
	make_weapon()
	fconsE(make_station(),'draw',function(ctx){
		ctx.beginPath()
		ctx.arc(this.x()+32,this.y()+32,200,0,TAU)
		ctx.fillStyle = 'rgba(255,170,0,.2)'
		ctx.fill()
		ctx.lineWidth = 1
		ctx.strokeStyle = 'rgba(0,0,0,.5)'
		ctx.stroke()
		ctx.closePath()
		})
	}

var hero = fconsE(new agent(divvs(canvas.size(),2),100,
	function(delta){this.vel = addvv(this.vel,mulvs([(keys_down[37]?-1:0)+(keys_down[39]?1:0), (keys_down[38]?-1:0)+(keys_down[40]?1:0)], 0.03))},
	function(){}),'draw',imagef('hero'))

var make_monster = function(){putE(new agent(mulvv(canvas.size(),[rand(),rand()]),5,
	function(delta){
		this.facing += (rand()-.5)*0.01*delta
		this.vel = addvv(this.vel,polar(0.01,this.facing))
		//this.vel = addvv(this.vel,mulvs(addvs([rand(),rand()],-0.5),0.01*delta))
		if (!hero.dead) {
			this.vel = addvv(this.vel,mulvs(norm(subvv(this.pos,hero.pos)),-0.005))
			if (this.pos[0] - 64 <= hero.pos[0] && hero.pos[0] <= this.pos[0] + 64 &&
				this.pos[1] - 64 <= hero.pos[1] && hero.pos[1] <= this.pos[1] + 64)
					{this.hurt(1); hero.hurt(1)}
			}
		},
	function(){make_monster()}
	),{facing:rand()*TAU, draw:imagef('monster')})}

// Handle keyboard controls
var keys_down = {}
addEventListener('keydown',function(e){keys_down[e.keyCode] = true},false)
addEventListener('keyup'  ,function(e){delete keys_down[e.keyCode]},false)

for (var i=0;i<4;i++) make_monster()
var then = Date.now()
setInterval(function(){
	var now = Date.now()
	update_agents(now - then)
	draw_entities(ctx)
	then = now
	},10)