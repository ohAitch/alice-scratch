#!/usr/bin/env node
var fs = require("fs")
var _ = require("underscore")
var seq = function(v){return(v["split"](""))}
var chr = function(v){return(String["fromCharCode"](v))}
var err = function(v){throw(Error(v))}
var own = function(o,m){return(Object["prototype"]["hasOwnProperty"]["call"](o,m)? o[m] :
		undefined)}
var is = function(v){return(v!==undefined)}
var js_valid_symbol = {is_part:function(v){return(!(!(v["match"](/[\wξηφ\/≠=+->~]/))))}}
var tokenize = function(s){var r = [];
	var any = undefined;
	var first_type = undefined;
	var start_any = function(){any = s[0];
	first_type = js_valid_symbol["is_part"](s[0]);
	s = s["slice"](1)};
	var end_any = function(){r["push"](S(any));
	any = undefined};
	while (s!=="") {var t = reader_macros["map"](function(v){var t = s["match"](v[0]);
	return(t? [t,v[1](t)] :
		undefined)})["filter"](function(v){return(v)})[0];
	if (t) {var m = t[0];
	var v = t[1];
	if (is(any)) end_any()
	else "";
	if (v!==SPACE) r["push"](v)
	else "";
	s = s["slice"](m[0]["length"])}
	else {if (is(any)) {if (js_valid_symbol["is_part"](s[0])===first_type) {any = any+s[0];
	s = s["slice"](1)}
	else {end_any();
	start_any()}}
	else {start_any()}}};
	return(r)}
var subscript_ops = []
var S = function(v){return({s:v})}
var SPACE = {SPACE:1}
var reader_macros = [[/^(\/\/.*|\/\*[^]*?(\*\/|$)|[ \t\n\x0c\x0d])+/,function(){return(SPACE)}],[/^(['"])((\\.|(?!\1).)*?)\1/,function(v){return({v:(v[2]["match"](/\\u....|\\x..|\\.|./g)||[])["map"](function(v){return(v["length"]>2? chr(parseInt(v["slice"](2),16)) :
		v["length"]===2? {"'":"'",
			"\"":"\"",
			"\\":"\\",
			"n":"\n",
			"t":"	"}[v[1]] :
		v)})["join"]("")})}],[/^~\/((?:[^\/\\\[]|(?:\\.)|\[(?:[^\\\]]|(?:\\.))*\])*)\/([a-z]*)/,function(v){return({s:"/"+v[1]+"/"+v[2]})}],[/^([\(\)\?:,;])/,function(v){return(S(v[1]))}],[/^(0[xX][\da-fA-F]+|\d+[rR][\da-zA-Z]+|(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?)/,function(v){return({v:parseFloat(v[0])})}]]
var groups_expand = function(tokens){var groups = {"(":")"};
	var group_expand = function(g,l){var r = [];
	while (true) {if (l[0]["s"]) {if (l[0]["s"]===groups[g["s"]]) return([r,l["slice"](1)])
	else "";
	if (own(groups,l[0]["s"])) {var t = group_expand(l[0],l["slice"](1));
	r["push"](t[0]);
	l = t[1];
	continue}
	else ""}
	else "";
	r["push"](l[0]);
	l = l["slice"](1)}};
	var r = group_expand(S("("),tokens["concat"]([S(")")]));
	if (!(r[1]["length"]===0)) err(r)
	else "";
	return(r[0])}
var φ_f = function(in_,out){fs["writeFileSync"](out+"/"+in_["slice"](0,Number("-2"))+".η",JSON["stringify"](groups_expand(tokenize(fs["readFileSync"](in_)+"//! wth"))[0],null,"	"))}
φ_f(process["argv"][2],process["argv"][3])