//===--------------------------------------------===// greenspuns //===--------------------------------------------===//

function overload(){var fns = dict_by(m('length'),arguments); return function(){return fns[arguments.length].apply(this,arguments)}}
function bind(root,member){return root[member].bind(root)}
function argslice(args,i){return Array.prototype.slice.apply(args).slice(i)}
function m(m){var args = argslice(arguments,1); // m('member') is like .member
	return args.length == 0? function(v){var r = v[m]; return r instanceof Function? r.call(v) : r}
	:      args.length == 1? function(v){var r = v[m]; return r instanceof Function? r.call(v,args[0]) : (v[m]=args[0])}
	:                        function(v){return v[m].apply(v,args)}}
Function.prototype.cmp = function(f){var t = this; return function(){return t.call(this,f.apply(this,arguments))}}
function not(v){return !v}
function is(a,b){return a === b}
var def = function(f){this[f.name] = f}.bind(this)
function dict_by(f,sq){var r = {}; for(var i=0;i<sq.length;i++) r[f(sq[i])] = sq[i]; return r}

function isa(clas){return function(v){return v instanceof clas}}

function sub(v,i){return v[i<0? i+v.length : i]}

//===--------------------------------------------===// misc utils //===--------------------------------------------===//

var print = bind(console,'log')
var rand = Math.random
function sum(v){var r = 0; for (var i=0;i<v.length;i++) r += v[i]; return r}
function putE(a,b){for (v in b) a[v]=b[v]; return a} // would be 'put=' if it could be
function sign(v){return v? (v < 0? -1 : 1) : 0}

function any(vs){for (var i=0;i<vs.length;i++) if (vs[i]) return true; return false}
function rand_nth(vs){return vs.length == 0? undefined : vs[Math.floor(rand()*vs.length)]}

//===--------------------------------------------===// misc mathy utils //===--------------------------------------------===//

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
	abs:function(){return Math.sqrt(sum(this.mul(this)))},
	sum:function(){
		if (this.length == 0) return 0
		var r = this[0]
		if (r instanceof Array) for (var i=1;i<this.length;i++) r = r.add(this[i])
		else                    for (var i=1;i<this.length;i++) r += this[i]
		return r},
	sign:function(){return this.map(sign)},
	norm:function(){var t = this.abs(); return t == 0? this : this.div(t)},
	})

var min = Math.min
var max = Math.max

//===--------------------------------------------===// main //===--------------------------------------------===//

function vec2to1(v){return v[0]*1000000+v[1]}
function vec1to2(v){var t = v%1000000; return [Math.round(v/1000000), t>500000? t-1000000 : t<-500000? t+1000000 : t]}

var draw = SVG('canvas')

var width = 8
var spacing = 20
var offset = [300,150]

function my_scale(v){return v.mul(spacing).add(offset)}

function draw_cute_shape(points){
	points = points.map(my_scale)
	if (points.length == 1) {
		points = [points[0].sub([0,width/2]), points[0].add([0,width/2])]
	} else {
		// for [points, reverse(points)]: it[0] += sign(it[0] - it[1]) * width/2
		points[0] = points[0].add(points[0].sub(points[1]).sign().mul(width/2))
		points[points.length-1] = sub(points,-1).add(sub(points,-1).sub(sub(points,-2)).sign().mul(width/2))
	}
	return draw.polyline(points).fill('none').stroke({width: width})}

var bound = [[0,0],[0,0]]
var space = {}
var lines = []
function add_line(v){lines.push(v); v.map(function(v){space[vec2to1(v)]=true
	bound[0][0] = min(bound[0][0],v[0])
	bound[0][1] = min(bound[0][1],v[1])
	bound[1][0] = max(bound[1][0],v[0])
	bound[1][1] = max(bound[1][1],v[1])
	})}

add_line([[0,1],[0,0],[1,0]])
add_line([[1,1],[2,1],[2,2],[2,3]])
add_line([[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[-1,2],[0,2],[1,2],[1,3]])

function rand_in_boundary(){
	var x = Math.floor(rand()*((bound[1][0]+1+1) - (bound[0][0]-1)) + (bound[0][0]-1))
	var y = Math.floor(rand()*((bound[1][1]+1+1) - (bound[0][1]-1)) + (bound[0][1]-1))
	return !space[vec2to1([x,y])] && any([[0,1],[1,0],[0,-1],[-1,0]].map(m('add',[x,y])).map(function(v){return space[vec2to1(v)]}))? [x,y] : rand_in_boundary()}

// currently is bugged in that lines tend to go back over themselves
for (var i=0;i<10;i++) {
	line = [rand_in_boundary()]
	var l=Math.floor(rand()*5); for (var j=0;j<l;j++) {
		var t = rand_nth([[0,1],[1,0],[0,-1],[-1,0]].map(m('add',sub(line,-1))).filter(function(v){return !space[vec2to1(v)]}))
		if (t) line.push(t)
	}
	add_line(line)
}

lines.map(draw_cute_shape)
for (v in space) {var v = my_scale(vec1to2(v)); draw.circle(width*0.5).center(v[0],v[1]).fill('#888')}

// maybe just a simple randomized algorithm? "take point in border, go by these random rules"