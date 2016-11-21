var _lazy = function(f){ var r = p_wrap((stream,i)=> (r._ = f()._)(stream,i) ); return r}
var _string = ι=> p_wrap(function(stream,i){
  var head = stream.slice(i,i+ι.length)
  return head===ι? make_win(i+ι.length,head) : make_lose(i,ι)
  })
var _regex = function(re,group=0){ T.RegExp(re) || !function(){throw Error("‽")}(); Tnum(group) || !function(){throw Error("‽")}()
  re.flags.re`^[imu]*$` || !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(" "))}('bad regex flag ∈',re)
  var expected = re+''; re = RegExp('^(?:'+re.source+')',re.flags)
  return p_wrap(function(stream,i){ var t = re.exec(stream.slice(i)); return t && !(t[group]===null || t[group]===undefined)? make_win(i+t[0].length, t[group]) : make_lose(i,expected) }) }

var P = (ι,...a)=> Tfun(ι)? _lazy(ι) : Tstr(ι)? _string(ι) : T.RegExp(ι)? _regex(ι,...a) : !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(" "))}('cant make parser from',ι)

var p_wrap = ι=> new Parser(ι)
// The Parser object is a wrapper for a parser function.
var Parser = function(action){ this._ = action }
P.proto = Parser.prototype
P.proto[Symbol.iterator] = function*(){ yield _(p_wrap(this._)).assign({spread:true}) }

var make_win = (index,value)=>0?0: { status:true, index, value, furthest:-1, expected:[], }
var make_lose = (index,expected)=>0?0: { status:false, index:-1, value:null, furthest:index, expected:[expected], }

var merge_replies = function(r,last){
  if (!last) return r
  if (r.furthest > last.furthest) return r
  var expected = r.furthest===last.furthest? unsafe_union(r.expected, last.expected) : last.expected
  return 0?0: { status:r.status, index:r.index, value:r.value, furthest:last.furthest, expected, } }

// Returns the sorted set union of two arrays of strings. Note that if both arrays are empty, it simply returns the first array, and if exactly one array is empty, it returns the other one unsorted. This is safe because expectation arrays always start as [] or [x], so as long as we merge with this function, we know they stay in sorted order.
var unsafe_union = function(xs,ys){
  var xL = xs.length
  var yL = ys.length
  if (xL===0) return ys; else if (yL===0) return xs
  var r = {}
  for (var i = 0; i < xL; i++) r[xs[i]] = true
  for (var i = 0; i < yL; i++) r[ys[i]] = true
  return _.keys(r).sort() }

P.format_error = function(stream,error){
  var t = error.expected; var ex = t.length===1? t[0] : 'one of '+t.join(', ')

  var index = error.index
  var i = index.offset

  if (i===stream.length) return ', got the end of the stream'

  var prefix = (i > 0 ? "'..." : "'")
  var suffix = (stream.length - i > 12 ? "...'" : "'")

  var got = ' at line ' + index.line + ' column ' + index.column +  ', got ' + prefix + stream.slice(i,i+12) + suffix

  return 'expected '+ex+got }

P.proto.parse = function(stream){ Tstr(stream) || !function(){throw Error("‽")}()
  var r = this.skip(eof)._(stream,0)
  r.status || !function(...a){throw Error(a.map(ι=> Tstr(ι)? ι : util_inspect_autodepth(ι)).join(" "))}({ index:make_line_col_index(stream, r.furthest), expected:r.expected, })
  return r.value }

// [Parser a] -> Parser [a]
var seq = P.seq = function(...ps){ ps.map(ι=> ι instanceof Parser || !function(){throw Error("‽")}())
  var r = p_wrap(function(stream,i){
    var r;
    var accum = new Array(ps.length)
    for (var j = 0; j < ps.length; j += 1){
      r = merge_replies(ps[j]._(stream,i), r)
      if (!r.status) return r
      accum[j] = r.value
      i = r.index
      }
    return merge_replies(make_win(i,accum), r) })
  if (ps.some(ι=> ι.spread)){
    var f = eval('ι=>['+ps.map((p,i)=> (p.spread?'...':'')+'ι['+i+']').join(',')+']')
    r = r.map(f) }
  return r}

var seq_map = P.seq_map = function(...a){ var f = a[-1]; a = a.slice(0,-1); Tfun(f) || !function(){throw Error("‽")}(); return seq(...a).map(ι=> f(...ι)) }

// Allows to add custom primitive parsers
P.custom = f=> p_wrap(f(make_win,make_lose))

var alt = P.alt = function(...ps){ ps.map(ι=> ι instanceof Parser || !function(){throw Error("‽")}())
  if (!ps.length) return fail('zero alternates')
  return p_wrap(function(stream,i){
    var r;
    for (var j = 0; j < ps.length; j += 1){
      r = merge_replies(ps[j]._(stream,i), r)
      if (r.status) return r
    }
    return r
  })
}

// P.sep_by_all = (p,sep)=> P.sep_by_1_all(p,sep).or(P.of([]))
// P.sep_by_1_all = λ(p,sep){ p instanceof Parser || ‽; sep instanceof Parser || ‽
//   ↩ P.seq_map( p, P.seq(sep,p).many().map(ι=> ι._.flatten(true)), (a,b)=>[a,…b] ) }

P.sep_by = (p,sep)=> P.sep_by1(p,sep).or(P.of([]))
P.sep_by1 = function(p,sep){ p instanceof Parser || !function(){throw Error("‽")}(); sep instanceof Parser || !function(){throw Error("‽")}()
  var pairs = sep.then(p).many()
  return p.chain(r=> pairs.map(rs=> [r].concat(rs) ) ) }

// -*- primitive combinators -*- //
P.proto.or = function(ι){return alt(this,ι) }
P.proto.then = function(next){ next instanceof Parser || !function(){throw Error("‽")}(); return seq(this,next).map(ι=> ι[1]) }

// -*- optimized iterative combinators -*- //
// equivalent to:
// P.proto.many = λ(){↩ @.times(0,Infinity) }
P.proto.many = function(){
  var self = this
  return p_wrap(function(stream,i){
    var accum = []
    var r;
    for (;;){
      r = merge_replies(self._(stream,i), r)
      if (r.status){ i = r.index; accum.push(r.value) }
      else return merge_replies(make_win(i,accum), r)
    }
  })
}

// equivalent to:
// P.proto.times = λ(min,max){
//   if (arguments.length < 2) max = min
//   self ← @
//   if (min > 0){
//     ↩ self.then(λ(x){
//       ↩ self.times(min-1, max-1).then(λ(xs){
//         ↩ [x].concat(xs)
//       })
//     })
//   }
//   else if (max > 0){
//     ↩ self.then(λ(x){
//       ↩ self.times(0, max-1).then(λ(xs){
//         ↩ [x].concat(xs)
//       })
//     }).or(P.of([]))
//   }
//   else ↩ P.of([])
// }
P.proto.times = function(min,max){
  var self = this
  if (arguments.length < 2) max = min
  Tnum(min) || !function(){throw Error("‽")}(); Tnum(max) || !function(){throw Error("‽")}()

  return p_wrap(function(stream,i){
    var accum = []
    var r;
    var prev_r;

    for (var times = 0; times < min; times += 1){
      r = self._(stream,i)
      prev_r = merge_replies(r,prev_r)
      if (r.status){ i = r.index; accum.push(r.value) }
      else return prev_r
      }
    for (; times < max; times += 1){
      r = self._(stream,i)
      prev_r = merge_replies(r,prev_r)
      if (r.status){ i = r.index; accum.push(r.value) }
      else break
      }
    return merge_replies(make_win(i,accum), prev_r)
  })
}

// -*- higher-level combinators -*- //
P.proto.result = function(ι){return this.map(()=> ι) }
P.proto.at_most = function(n){return this.times(0,n) }
P.proto.at_least = function(n){return seq_map(this.times(n), this.many(), (init,r)=> init.concat(r) ) }
P.proto.map = function(f){ Tfun(f) || !function(){throw Error("‽")}(); var self = this; return p_wrap(function(stream,i){ var r = self._(stream,i); return !r.status? r : merge_replies(make_win(r.index, f(r.value)), r) }) }
P.proto.skip = function(next){return seq(this,next).map(ι=> ι[0]) }
P.proto.mark = function(){return seq_map(index,this,index,(start,value,end)=>0?0: { start, value, end } ) }
P.proto.desc = function(expected){ var self = this; return p_wrap(function(stream,i){ var r = self._(stream,i); if (!r.status) r.expected = [expected]; return r }) }

// -*- primitive parsers -*- //
P.of = (value)=> p_wrap((stream,i)=> make_win(i,value) )
var fail = P.fail = (expected)=> p_wrap((stream,i)=> make_lose(i,expected) )
P.any = p_wrap((stream,i)=> i >= stream.length? make_lose(i,'any character') : make_win(i+1, stream[i]) )
P.all = p_wrap((stream,i)=> make_win(stream.length, stream.slice(i)) )
var eof = P.eof = p_wrap((stream,i)=> i < stream.length? make_lose(i,'EOF') : make_win(i,null) )
var test = P.test = test=>( Tfun(test) || !function(){throw Error("‽")}(), 
  p_wrap((stream,i)=> i < stream.length && test(stream[i])? make_win(i+1,stream[i]) : make_lose(i,'a character matching '+test) )
  )
P.one_of = s=> test(ch=> s.indexOf(ch) >= 0 )
P.none_of = s=> test(ch=> s.indexOf(ch) < 0 )
P.take_while = test=>( Tfun(test) || !function(){throw Error("‽")}(),
  p_wrap(function(stream,i){ var j = i; while (j < stream.length && test(stream[j])) j++; return make_win(j,stream.slice(i,j)) })
  )

var make_line_col_index = function(stream,i){ var lines = stream.slice(0,i).split('\n'); return { offset:i, line:lines.length, column:lines[-1].length+1, } }

var index = P.index = p_wrap((stream,i)=> make_win(i,make_line_col_index(stream,i)) )

//- fantasyland compat
//- Monad
P.proto.chain = function(f){ var self = this; return p_wrap(function(stream,i){ var r = self._(stream,i); return !r.status? r : merge_replies(f(r.value)._(stream,r.index), r) }) }

// --------- misc --------- //
P.proto.flat = function(){return this.map(ι=> _(ι).flatten(true)) }

var Pretty_Typed = function(ι){ this._.assign(ι) }; Pretty_Typed.prototype.inspect = function(d,opt){return (this.T==='ident'?'i':this.T)+util.inspect(this.ι,opt) }
P.proto.type = function(T){return this.map(ι=> new Pretty_Typed({T,ι}) ) }

module.exports = P
