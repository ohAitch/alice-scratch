#!/usr/bin/env node --harmony

// TODO:
// let's turn everything into continuation passing style!
// requireζ2 is maybe actually quite bad since it doesn't handle changes to the source ??

var compile = module.exports.compile = function(v){
	return v.replace(/(?:λ(?: λ)?(?=(?:[ \t][^\(]*)?\([^\)]*\)[ \t]*\{)|↩ ?|([\w_$αβγδεζηθικλμνξπρστυφχψω]+)(\s*)←(;?)|@)(?!['"])/g,
		function(v,name,s,semi){switch(v){
			case 'λ': return 'function'; case 'λ λ': return 'function λ'
			case '↩': case '↩ ': return 'return '
			case '@': return 'this'
			default: return semi===';'? 'var '+name+s+';' : 'var '+name+s+'='
			}})}
var compile_file = module.exports.compile_file = function(v){return compile(v).replace(/^(#!.*\n)?/,'$1require("zeta-two");')}

var requireζ2 = function(name,path){
	try {return require(name)} catch (e) {if (!(e.code === "MODULE_NOT_FOUND")) throw e
		var fs = require('fs'); fs.writeFileSync(path+'.js',compile_file(fs.readFileSync(path+'.ζ₂')+''))
		return require(name) } }

requireζ2('./builtins',__dirname+'/builtins')
if (!module.parent) requireζ2('./ζ₂',__dirname+'/ζ₂')
