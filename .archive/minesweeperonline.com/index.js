// pasteme in http://minesweeperonline.com/

rand = function(a,b){return arguments.length === 0? Math.random() : arguments.length === 1? Math.floor(rand()*a) : rand(b-a)+a}
click = function(x,y){y=x[1];x=x[0]; $('#'+(y+1)+'_'+(x+1)).trigger($.Event("mouseup",{button:0}))}
S = function(x,y){y=x[1];x=x[0]; if (!(0<=x&&x<X && 0<=y&&y<Y)) return undefined; var t = $('#'+(y+1)+'_'+(x+1)).attr('class').match(/(?:blank|open(\d))$/); return t && t[1]? parseInt(t[1]) : undefined}
_ = {
	range:function(a,b){if (arguments.length === 1) {b = a; a = 0}; var r = []; for (var i=a;i<b;i++) r.push(i); return r},
	shuffle: function(o){for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x); return o},
	}
adj = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]

X = 30; Y = 16
sqs = _.shuffle([].concat.apply([],_.range(X).map(function(x){return _.range(Y).map(function(y){return [x,y]})})))

think = function(){
	var r = _.range(X).map(function(){return _.range(Y).map(function(){})})
	var V = function(x,y){y=x[1];x=x[0]; return 0<=x&&x<X && 0<=y&&y<Y? r[x][y] : false}
	for(;;){
		var change = false
		for (var x=0;x<X;x++) for (var y=0;y<Y;y++) {
			if (S([x,y]) != null) continue;
			if (r[x][y] != null) continue;
			var t = adj.some(function(o){
				var v = [x+o[0],y+o[1]]
				if (S(v) != null && adj.filter(function(o){var u = [v[0]+o[0],v[1]+o[1]]; return S(u) == null}).length === S(v))
					return true })
			if (t) {r[x][y] = true; change = true}

			if (r[x][y] != null) continue;
			var t = adj.some(function(o){
				var v = [x+o[0],y+o[1]]
				if (S(v) != null && adj.filter(function(o){var u = [v[0]+o[0],v[1]+o[1]]; return V(u) == true}).length === S(v))
					return true })
			if (t) {r[x][y] = false; change = true}
		}
		if (!change) break}
	return V}

main_loop = setInterval(function(){var t;
	if (!$('.facedead').length) {
		if (sqs.every(function(v){return S(v) == null})) {click([rand(X),rand(Y)]); return}
		var V = think()
		if (t = sqs.filter(function(v){return V(v) === false && S(v) == null})[0]) {click(t); return}
		// if (t = sqs.filter(function(v){return V(v) == null   && S(v) == null})[0]) {click(t); return}
	}
	console.log('dunno what to do'); return
},0)
