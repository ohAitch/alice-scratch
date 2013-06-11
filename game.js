function bind(root,member) {return root[member].bind(root)}
function argslice(args,i){return Array.prototype.slice.apply(args).slice(i)}
function m(m){var args = argslice(arguments,1);
	return args.length == 0? function(v){var r = v[m]; return r instanceof Function? r.call(v) : r}
	:      args.length == 1? function(v){var r = v[m]; return r instanceof Function? r.call(v,args[0]) : (v[m]=args[0])}
	:                        function(v){return v[m].apply(v,args)}}
function extend(sup,sub){
	sub.prototype.__proto__ = sup.prototype
	//sub.prototype.super_ = function(){this.prototype.__proto__.constructor.apply(this,argslice(arguments,1))}
	//sub.prototype['$'+sup.name] = function(){sup.prototype.constructor.apply(this,arguments)}
	return sub}
function clas(sup,ctor,body){extend(sup,ctor); putE(ctor.prototype,body); return ctor}
function super_(self){self.__proto__.__proto__.constructor.apply(self,argslice(arguments,1))}
//function super_(self){var f = self.__proto__.constructor; print(f,typeof(f),argslice(arguments,1));} //f.apply(self,argslice(arguments,1))}
//function fconsE(self,slot,f){var t = self[slot]; self[slot] = function(){if (t) t.apply(this,arguments); f.apply(this,arguments)}; return self}
function fcat(){var fns = arguments; return function(){for (var i=0;i<fns.length;i++) fns[i].apply(this,arguments)}}
Function.prototype.cmp = function(f){var t = this; return function(){return t.call(this,f.apply(this,arguments))}}
function not(v){return !v}
function is(a,b){return a === b}
// CURRENT: !!
var def = function(f){this[f.name] = f}.bind(this)
function dict_by(f,sq){var r = {}; for(var i=0;i<sq.length;i++) r[f(sq[i])] = sq[i]; return r}
function overload(){var fns = dict_by(m('length'),arguments); return function(){fns[arguments.length].apply(this,arguments)}}

var print = bind(console,'log')
var rand = Math.random
function sum(v){var r = 0; for (var i=0;i<v.length;i++) r += v[i]; return r}
function putE(a,b){for (v in b) a[v]=b[v]; return a}
function sign(v){return v? (v < 0? -1 : 1) : 0}

function polar(r,t){return [r*Math.cos(t), r*Math.sin(t)]}
var TAU = Math.PI*2
putE(Array.prototype,{
	add:function(v){
		if (v instanceof Array) {var r = []; for (var i=0;i<this.length;i++) r.push(this[i]+v[i]); return r}
		else return this.map(function(w){return w+v})},
	sub:function(v){
		if (v instanceof Array) {var r = []; for (var i=0;i<this.length;i++) r.push(this[i]-v[i]); return r}
		else return this.map(function(w){return w-v})},
	mul:function(v){
		if (v instanceof Array) {var r = []; for (var i=0;i<this.length;i++) r.push(this[i]*v[i]); return r}
		else return this.map(function(w){return w*v})},
	div:function(v){
		if (v instanceof Array) {var r = []; for (var i=0;i<this.length;i++) r.push(this[i]/v[i]); return r}
		else return this.map(function(w){return w/v})},
	mod:function(v){
		if (v instanceof Array) {var r = []; for (var i=0;i<this.length;i++) r.push(this[i]%v[i]); return r}
		else return this.map(function(w){return w%v})},
	abs:function(){return Math.sqrt(sum(this.mul(this)))},
	sum:function(){var r = this[0]; for (var i=1;i<this.length;i++) r = r.add(this[i]); return r},
	sign:function(){return this.map(sign)},
	norm:function(){var t = this.abs(); return t == 0? this : this.div(t)},
	})

var canvas = document.getElementById('canvas')
canvas.size = function(){return [canvas.width,canvas.height]}
window.onresize = function(e){
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight}
window.onresize(null)

var keys_down = {}
addEventListener('keydown',function(e){keys_down[e.keyCode] = true},false)
addEventListener('keyup'  ,function(e){delete keys_down[e.keyCode]},false)

function enhance_ctx(c){return putE(c,{
	fill:overload(c.fill,function(style){
		this.fillStyle = style
		this.fill()}),
	stroke:overload(c.stroke,function(style,width){
		this.strokeStyle = style
		this.lineWidth = width
		this.stroke()}),
	draw_line:function(a,b){
		this.beginPath()
		this.moveTo(a[0]+0.5,a[1]+0.5)
		this.lineTo(b[0]+0.5,b[1]+0.5)
		this.stroke()}
	})}

function rand_pos(){return canvas.size().mul([rand(),rand()])}

function pos(pos){this.pos = pos}
pos.prototype.x = function(){return this.pos[0]}
pos.prototype.y = function(){return this.pos[1]}
def(extend(pos,function agent(posp,hp,update,die){
	//super_(this,pos)
	pos.call(this,posp)
	// CURRENT: when you're in `new station` and then call this, your super_ impl does not actually work at all
	this.hp = hp
	this.die = die
	this.update = function(delta){
		if (!(0 <= this.pos[0] && this.pos[0] < canvas.size()[0] && 0 <= this.pos[1] && this.pos[1] < canvas.size()[1]))
			this.hurt(1)
		if (!this.dead) update.call(this,delta)
		if (!this.dead) {
			var t = this.pos
			this.vel = this.vel.mul(0.96)
			this.vel = this.vel.add(agents.map(function(v){var dir = t.sub(v.pos); return dir.abs() < 60? dir.norm().mul(0.05) : [0,0]}).sum())
			this.vel = this.vel.add(this.pos.mod(64).add(-32).sign().mul(0.005))
			this.pos = this.pos.add(this.vel.mul(delta))
			}}
	this.hurt = function(i){this.hp -= i; if (this.hp <= 0) {this.dead = true; this.die()}}
	this.vel = [0,0]

	sprites.push(this)
	agents.push(this)
	}))

function imagef(v){ // (v[,X,Y])
	var img; {var t = putE(new Image(),{src:'images/'+v+'.png', onload:function(){img = t}})}
	var XY = argslice(arguments,1)
	return XY.length == 2?
		function(c){if (img) c.drawImage(img,0,0,XY[0],XY[1])} :
		function(c){if (img) c.drawImage(img,0,0)            } }
function pos_trans(f){return function(c){c.save(); c.translate(this.x(),this.y()); f.call(this,c); c.restore()}}

var sprites = []
var agents = []
function draw_sprites (c    ){(sprites = sprites.filter(not.cmp(m('dead'))))         .map(m('draw'  ,c    ))}
function update_agents(delta){(agents  = agents .filter(not.cmp(m('dead')))).slice(0).map(m('update',delta))}

sprites.push({draw:imagef('background2')})
sprites.push({draw:function(c){
	c.strokeStyle = 'rgba(0,0,0,.3)'
	c.lineWidth = 1
	for (var x = 32; x < canvas.width; x += 64)
		c.draw_line([x,0],[x,canvas.height])
	for (var y = 32; y < canvas.height; y += 64)
		c.draw_line([0,y],[canvas.width,y])
	}})
sprites.push({draw:function(c){
	c.fillStyle = 'white'
	c.font = '24px Consolas'
	c.textBaseline = 'top'
	c.fillText('sprites: '+sprites.length,32,32)
	c.fillText('hero.hp: '+hero.hp,32,64)
	}})

function make_food  (pos){return putE(new agent(pos,1,function(delta){},function(){make_food   (rand_pos())}),{draw:pos_trans(imagef('food'   ,64,64))})}
function make_weapon(pos){return putE(new agent(pos,1,function(delta){},function(){make_weapon (rand_pos())}),{draw:pos_trans(imagef('weapon' ,64,64))})}
def(extend(agent,function station(pos){
	super_(this,pos,1,function(delta){},function(){new station(rand_pos())})
	//print(this.__proto__.__proto__,agent.prototype
	//agent.call(this,pos,1,function(delta){},function(){new station(rand_pos())})

	this.draw=pos_trans(fcat(
		function(c){
			c.beginPath()
			c.arc(32,32,200,0,TAU)
			c.fill('rgba(255,170,0,.2)')
			c.stroke('rgba(0,0,0,.5)',1)},
		imagef('station',64,64)))
	}))
function make_monster(pos){return putE(new agent(pos,5,
	function(delta){
		this.facing += (rand()-.5)*0.01*delta
		this.vel = this.vel.add(polar(0.01,this.facing))
		if (!hero.dead) {
			this.vel = this.vel.add(this.pos.sub(hero.pos).norm().mul(-0.005))
			if (this.pos[0] - 64 <= hero.pos[0] && hero.pos[0] <= this.pos[0] + 64 &&
				this.pos[1] - 64 <= hero.pos[1] && hero.pos[1] <= this.pos[1] + 64)
					{this.hurt(1); hero.hurt(1)}
			}
		},
	function(){make_monster(rand_pos())}
	),{facing:rand()*TAU, draw:pos_trans(imagef('monster'))})}
function make_hero   (pos){return putE(new agent(pos,100,
	function(delta){
		this.vel = this.vel.add([(keys_down[37]?-1:0)+(keys_down[39]?1:0), (keys_down[38]?-1:0)+(keys_down[40]?1:0)].mul(0.03))

		},
	function(){make_hero(rand_pos()); hero = make_hero(rand_pos())}),{draw:pos_trans(imagef('hero'))})}
for (var i=0;i<4;i++) make_food(rand_pos())
for (var i=0;i<4;i++) make_weapon(rand_pos())
for (var i=0;i<10;i++) new station(rand_pos())
for (var i=0;i<4;i++) make_monster(rand_pos())
var hero = make_hero(canvas.size().div(2))

{	var then = Date.now()
	var ctx = enhance_ctx(canvas.getContext('2d'))
	setInterval(function(){
		var now = Date.now()
		update_agents(now - then)
		draw_sprites(ctx)
		then = now
		},10)}