#!/usr/bin/env node
var fs = require("fs")
var _ = require("underscore")
"// ~ really should be *"
var macros = {"η/member":function(o,m){return([{"s":"ξ/member_val"},o,m])},
			"η/+":function(a,b){return([{"s":"ξ/JS_+"},a,b])},
			"η/~":function(a,b){return([{"s":"ξ/JS_+"},a,b])}}
var macro_expand = function(v){if (v instanceof Array) {while (macros[v[0]["s"]]) v = macros[v[0]["s"]]["apply"](null,v["slice"](1));
	return(v["map"](macro_expand))}
	else return(v)}
var η_f = function(in_,out){fs["writeFileSync"](out+"/"+in_+"c.ξ",JSON["stringify"](macro_expand(JSON["parse"](fs["readFileSync"](in_)+""))["slice"](1),null,"	"))}
η_f(process["argv"][2],process["argv"][3])