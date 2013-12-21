//===--------------------------------------------===// greenspuns //===--------------------------------------------===//
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
/////  THE FOLLOWING MATERIAL IS DUPLICATED ELSEWHERE  /////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

function overload(){var fns = dict_by(m('length'),arguments); return function(){return fns[arguments.length].apply(this,arguments)}}
function bind(root,member){return root[member].bind(root)}
function argslice(args,i){return Array.prototype.slice.apply(args).slice(i)}
function m(m){var args = argslice(arguments,1); // m('member',args) → function(v){return v.member(args)}
	return args.length === 0? function(v){var r = v[m]; return r instanceof Function? r.call(v) : r}
	:      args.length === 1? function(v){var r = v[m]; return r instanceof Function? r.call(v,args[0]) : (v[m]=args[0])}
	:                        function(v){return v[m].apply(v,args)}}
Function.prototype.cmp = function(f){var t = this; return function(){return t.call(this,f.apply(this,arguments))}}
function not(v){return !v}
function is(a,b){return a === b}
var def = function(f){this[f.name] = f}.bind(this)
function dict_by(f,sq){var r = {}; for(var i=0;i<sq.length;i++) r[f(sq[i])] = sq[i]; return r}

function isa(clas){return function(v){return v instanceof clas}} // should probably just use cmp

var sub = overload(
	function(v,i){return v[i<0? i+v.length : i]},
	function(i){return function(v){return sub(v,i)}})

//===--------------------------------------------===// misc utils //===--------------------------------------------===//

var print = bind(console,'log')
var rand = Math.random
function sum(v){var r = 0; for (var i=0;i<v.length;i++) r += v[i]; return r}
function putE(a,b){for (v in b) a[v]=b[v]; return a} // would be 'put=' if it could be
function sign(v){return v? (v < 0? -1 : 1) : 0}

function any(vs){for (var i=0;i<vs.length;i++) if (vs[i]) return true; return false}

function rand_nth(vs){return vs.length === 0? undefined : vs[Math.floor(rand()*vs.length)]}
var rand_i_i = overload(function(a,b){return Math.floor(rand()*(b+1 - a)) + a}, function(ab){return rand_i_i(ab[0],ab[1])})
var rand_i   = overload(function(a,b){return Math.floor(rand()*(b   - a)) + a}, function(ab){return rand_i  (ab[0],ab[1])})
function rand_weighted(v){
	var total = sum(v.map(sub(0)))
	if (total === 0) return undefined
	var i = rand_i(0,total)
	for (var j=0;j<v.length;j++) {
		i -= v[j][0]
		if (i < 0) return v[j][1]
	}
	throw "wut"}

//===--------------------------------------------===// misc mathy utils //===--------------------------------------------===//

var min = Math.min
var max = Math.max
Math.TAU = Math.PI*2
function polar(r,t){return [r*Math.cos(t), r*Math.sin(t)]}

function coercing_arith_v(f){return function(v){
	if (v instanceof Array) {var r = []; for (var i=0;i<this.length;i++) r.push(f(this[i],v[i])); return r}
	else return this.map(function(w){return f(w,v)})}}
putE(Array.prototype,{
	add:coercing_arith_v(function(a,b){return a+b}),
	sub:coercing_arith_v(function(a,b){return a-b}),
	mul:coercing_arith_v(function(a,b){return a*b}),
	div:coercing_arith_v(function(a,b){return a/b}),
	mod:coercing_arith_v(function(a,b){return a%b}),
	min:coercing_arith_v(function(a,b){return min(a,b)}),
	max:coercing_arith_v(function(a,b){return max(a,b)}),
	abs:function(){return Math.sqrt(sum(this.mul(this)))},
	sum:function(){
		if (this.length === 0) return 0
		var r = this[0]
		if (r instanceof Array) for (var i=1;i<this.length;i++) r = r.add(this[i])
		else                    for (var i=1;i<this.length;i++) r += this[i]
		return r},
	sign:function(){return this.map(sign)},
	norm:function(){var t = this.abs(); return t === 0? this : this.div(t)},
	})

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//////////////////  END DUPLICATE SECTION  /////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//===--------------------------------------------===// main //===--------------------------------------------===//

function sfx(name){new Audio('sfx/'+name+'.wav').play()}
function music(name){
	var music_short = {
		'pope':'bidoof45 - Pope Friction.mp3',
		'dark':'F-777 - Dark Angel.mp3',
		'system':'F-777 - System Split.mp3',
		'tsunami':'OcularNebula - Mega Tsunami.mp3',
		'hourglass':'Parkerman1700 - Hourglass [Final].mp3',
		'piano':'shadow6nothing9 - The Terminal Piano.mp3',
		'ai':'tettix - earth\'s assault on the central ai.mp3'
		}
	return new Audio('music/'+music_short[name])}

var mobs = []

function Bullet(size){
	this.dom = $('<div/>',{id:'bullet'+(Bullet.id++), class:'bullet'})
			.css({height:size, width:size, 'margin-top':-size/2, 'margin-left':-size/2})
			.append($('<div/>',{class:'bullet_outer'}).css({'border-width':size/12}))
			.append($('<div/>',{class:'bullet_inner'}))
	this._pos = [0,0]
	this._vel = [0,0]
	mobs.push(this)
} Bullet.id = 0
Bullet.prototype.pos = function(pos){this._pos = pos; this.dom.css({left:pos[0], top:pos[1]}); return this}
Bullet.prototype.vel = function(vel){this._vel = vel; return this}
Bullet.prototype.show = function(){$('#main').append(this.dom); return this}
Bullet.prototype.hide = function(){this.dom.remove(); return this}

for (var i=0;i<10;i++)
	new Bullet(24+24*rand()).pos([500*rand(),300*rand()]).vel([rand()-0.5,rand()-0.5]).show()

setInterval(function(){
	mobs.map(function(v){
		v.pos(v._pos.add(v._vel))
	})
	},10)