// forked from https://github.com/marijnh/acorn/tree/cbd8aa8f067a65bc7fb781d8850c7da06e57b072

var util = require('util')

var _ = require('underscore')

;(function() {
"use strict";

var φ; // state

module.exports.parse = function(inpt) {
	φ = {
	ecmaVersion: 5,
	input: String(inpt), //!
	inputLen: inpt.length,
	// The current position of the tokenizer in the input.
	tokPos: undefined,
	// The start and end offsets of the current token.
	tokStart: undefined,
	tokEnd: undefined,
	// When `options.locations` is true, these hold objects containing the tokens start and end line/column pairs.
	tokStartLoc: undefined,
	tokEndLoc: undefined,
	// The type and value of the current token. Token types are objects, named by variables against which they can be compared, and holding properties that describe them (indicating, for example, the precedence of an infix operator, and the original name of a keyword token). The kind of value that's held in `tokVal` depends on the type of the token. For literals, it is the literal value, for operators, the operator name, and so on.
	tokType: undefined,
	tokVal: undefined,
	// Internal state for the tokenizer. To distinguish between division operators and regular expressions, it remembers whether the last token was one that is allowed to be followed by an expression. In some cases, notably after ')' or '}' tokens, the situation depends on the context before the matching opening bracket, so tokContext keeps a stack of information about current bracketed forms.
	tokContext: undefined,
	tokExprAllowed: undefined,
	// When `options.locations` is true, these are used to keep track of the current line, and know when a new line has been entered.
	tokCurLine: undefined,
	tokLineStart: undefined,
	// These store the position of the previous token, which is useful when finishing a node and assigning its `end` position.
	lastStart: undefined,
	lastEnd: undefined,
	lastEndLoc: undefined,
	// This is the parser's state. `inFunction` is used to reject `return` statements outside of functions, `inGenerator` to reject `yield`s outside of generators, `labels` to verify that `break` and `continue` have somewhere to jump to, and `strict` indicates whether strict mode is on.
	inFunction: undefined,
	inGenerator: undefined,
	labels: undefined,
	strict: undefined,
	}
	φ.isKeyword = φ.ecmaVersion >= 6 ? isEcma6Keyword : isEcma5AndLessKeyword;

	var comments = []
	var tokens = []

	φ.onToken = function (token) {
		tokens.push(token);
	};
	φ.onComment = function (block, text, start, end, startLoc, endLoc) {
		var comment = {
			type: block ? 'Block' : 'Line',
			value: text,
			start: start,
			end: end,
		};
		comment.loc = new SourceLocation(); comment.loc.start = startLoc; comment.loc.end = endLoc;
		comments.push(comment);
	};


	;(function initTokenState(pos) {
		if (pos) {
			φ.tokPos = pos;
			φ.tokLineStart = Math.max(0, φ.input.lastIndexOf("\n", pos));
			φ.tokCurLine = φ.input.slice(0, φ.tokLineStart).split(newline).length;
		} else {
			φ.tokCurLine = 1;
			φ.tokPos = φ.tokLineStart = 0;
		}
		φ.tokType = _eof;
		φ.tokContext = [b_stat];
		φ.tokExprAllowed = true;
		φ.strict = false;
		//! does not but should save hashbang-nature of the comment
		if (φ.tokPos === 0 && φ.input.slice(0, 2) === '#!') {
			skipLineComment(2);
		}
	})()
	;(function initParserState() {
		φ.lastStart = φ.lastEnd = φ.tokPos;
		φ.lastEndLoc = curPosition();
		φ.inFunction = φ.inGenerator = false;
		φ.labels = [];
		skipSpace();
		readToken();
	})()
	return {ast: parseTopLevel(startNodeAt([φ.tokPos, curPosition()])), com:comments, tok:tokens};
};

// The `getLineInfo` function is mostly useful when the
// `locations` option is off (for performance reasons) and you
// want to find the line/column position for a given character
// offset. `input` should be the code string that the offset refers
// into.

var getLineInfo = function(input, offset) {
	for (var line = 1, cur = 0;;) {
		lineBreak.lastIndex = cur;
		var match = lineBreak.exec(input);
		if (match && match.index < offset) {
			++line;
			cur = match.index + match[0].length;
		} else break;
	}
	return {line: line, column: offset - cur};
};

// This function is used to raise exceptions on parse errors. It
// takes an offset integer (into the current `input`) to indicate
// the location of the error, attaches the position to the end
// of the error message, and then raises a `SyntaxError` with that
// message.

function raise(pos, message) {
	var loc = getLineInfo(φ.input, pos);
	message += " (" + loc.line + ":" + loc.column + ")";
	var err = new SyntaxError(message);
	err.pos = pos; err.loc = loc; err.raisedAt = φ.tokPos;
	throw err;
}

// Reused empty array added for node fields that are always empty.

var empty = [];

// ## Token types

// The assignment of fine-grained, information-carrying type objects
// allows the tokenizer to store the information it has about a
// token in a way that is very cheap for the parser to look up.

// All token type variables start with an underscore, to make them
// easy to recognize.

// These are the general types. The `type` property is only used to
// make them recognizeable when debugging.

var _num = {type: "num"}, _regexp = {type: "regexp"}, _string = {type: "string"};
var _name = {type: "name"}, _eof = {type: "eof"};

// Keyword tokens. The `keyword` property (also used in keyword-like
// operators) indicates that the token originated from an
// identifier-like word, which is used when parsing property names.
//
// The `beforeExpr` property is used to disambiguate between regular
// expressions and divisions. It is set on all token types that can
// be followed by an expression (thus, a slash after them would be a
// regular expression).
//
// `isLoop` marks a keyword as starting a loop, which is important
// to know when parsing a label, in order to allow or disallow
// continue jumps to that label.

var _break = {keyword: "break"}, _case = {keyword: "case", beforeExpr: true}, _catch = {keyword: "catch"};
var _continue = {keyword: "continue"}, _debugger = {keyword: "debugger"}, _default = {keyword: "default"};
var _do = {keyword: "do", isLoop: true}, _else = {keyword: "else", beforeExpr: true};
var _finally = {keyword: "finally"}, _for = {keyword: "for", isLoop: true}, _function = {keyword: "function"};
var _if = {keyword: "if"}, _return = {keyword: "return", beforeExpr: true}, _switch = {keyword: "switch"};
var _throw = {keyword: "throw", beforeExpr: true}, _try = {keyword: "try"}, _var = {keyword: "var"};
var _let = {keyword: "let"}, _const = {keyword: "const"};
var _while = {keyword: "while", isLoop: true}, _with = {keyword: "with"}, _new = {keyword: "new", beforeExpr: true};
var _this = {keyword: "this"};
var _class = {keyword: "class"}, _extends = {keyword: "extends", beforeExpr: true};
var _export = {keyword: "export"}, _import = {keyword: "import"};
var _yield = {keyword: "yield", beforeExpr: true};

// The keywords that denote values.

var _null = {keyword: "null", atomValue: null}, _true = {keyword: "true", atomValue: true};
var _false = {keyword: "false", atomValue: false};

// Some keywords are treated as regular operators. `in` sometimes
// (when parsing `for`) needs to be tested against specifically, so
// we assign a variable name to it for quick comparing.

var _in = {keyword: "in", binop: 7, beforeExpr: true};

// Map keyword names to token types.

var keywordTypes = {
	"break": _break, "case": _case, "catch": _catch,
	"continue": _continue, "debugger": _debugger, "default": _default,
	"do": _do, "else": _else, "finally": _finally, "for": _for,
	"function": _function, "if": _if, "return": _return, "switch": _switch,
	"throw": _throw, "try": _try, "var": _var, "let": _let, "const": _const,
	"while": _while, "with": _with,
	"null": _null, "true": _true, "false": _false, "new": _new, "in": _in,
	"instanceof": {keyword: "instanceof", binop: 7, beforeExpr: true}, "this": _this,
	"typeof": {keyword: "typeof", prefix: true, beforeExpr: true},
	"void": {keyword: "void", prefix: true, beforeExpr: true},
	"delete": {keyword: "delete", prefix: true, beforeExpr: true},
	"class": _class, "extends": _extends,
	"export": _export, "import": _import, "yield": _yield};

// Punctuation token types. Again, the `type` property is purely for debugging.

var _bracketL = {type: "[", beforeExpr: true}, _bracketR = {type: "]"}, _braceL = {type: "{", beforeExpr: true};
var _braceR = {type: "}"}, _parenL = {type: "(", beforeExpr: true}, _parenR = {type: ")"};
var _comma = {type: ",", beforeExpr: true}, _semi = {type: ";", beforeExpr: true};
var _colon = {type: ":", beforeExpr: true}, _dot = {type: "."}, _question = {type: "?", beforeExpr: true};
var _arrow = {type: "=>", beforeExpr: true}, _template = {type: "template"};
var _ellipsis = {type: "...", beforeExpr: true};
var _backQuote = {type: "`"}, _dollarBraceL = {type: "${", beforeExpr: true};

// Operators. These carry several kinds of properties to help the
// parser use them properly (the presence of these properties is
// what categorizes them as operators).
//
// `binop`, when present, specifies that this operator is a binary
// operator, and will refer to its precedence.
//
// `prefix` and `postfix` mark the operator as a prefix or postfix
// unary operator. `isUpdate` specifies that the node produced by
// the operator should be of type UpdateExpression rather than
// simply UnaryExpression (`++` and `--`).
//
// `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
// binary operators with a very low precedence, that should result
// in AssignmentExpression nodes.

var _slash = {binop: 10, beforeExpr: true}, _eq = {isAssign: true, beforeExpr: true};
var _assign = {isAssign: true, beforeExpr: true};
var _incDec = {postfix: true, prefix: true, isUpdate: true}, _prefix = {prefix: true, beforeExpr: true};
var _logicalOR = {binop: 1, beforeExpr: true};
var _logicalAND = {binop: 2, beforeExpr: true};
var _bitwiseOR = {binop: 3, beforeExpr: true};
var _bitwiseXOR = {binop: 4, beforeExpr: true};
var _bitwiseAND = {binop: 5, beforeExpr: true};
var _equality = {binop: 6, beforeExpr: true};
var _relational = {binop: 7, beforeExpr: true};
var _bitShift = {binop: 8, beforeExpr: true};
var _plusMin = {binop: 9, prefix: true, beforeExpr: true};
var _modulo = {binop: 10, beforeExpr: true};

// '*' may be multiply or have special meaning in ES6
var _star = {binop: 10, beforeExpr: true};

// Provide access to the token types for external users of the
// tokenizer.

var tokTypes = {
	bracketL: _bracketL, bracketR: _bracketR, braceL: _braceL, braceR: _braceR,
	parenL: _parenL, parenR: _parenR, comma: _comma, semi: _semi, colon: _colon,
	dot: _dot, ellipsis: _ellipsis, question: _question, slash: _slash, eq: _eq,
	name: _name, eof: _eof, num: _num, regexp: _regexp, string: _string,
	arrow: _arrow, template: _template, star: _star, assign: _assign,
	backQuote: _backQuote, dollarBraceL: _dollarBraceL};
for (var kw in keywordTypes) tokTypes["_" + kw] = keywordTypes[kw];

// This is a trick taken from Esprima. It turns out that, on
// non-Chrome browsers, to check whether a string is in a set, a
// predicate containing a big ugly `switch` statement is faster than
// a regular expression, and on Chrome the two are about on par.
// This function uses `eval` (non-lexical) to produce such a
// predicate from a space-separated string of words.
//
// It starts by sorting the words by length.

function makePredicate(words) {
	words = words.split(" ");
	var f = "", cats = [];
	out: for (var i = 0; i < words.length; ++i) {
		for (var j = 0; j < cats.length; ++j)
			if (cats[j][0].length == words[i].length) {
				cats[j].push(words[i]);
				continue out;
			}
		cats.push([words[i]]);
	}
	function compareTo(arr) {
		if (arr.length == 1) return f += "return str === " + JSON.stringify(arr[0]) + ";";
		f += "switch(str){";
		for (var i = 0; i < arr.length; ++i) f += "case " + JSON.stringify(arr[i]) + ":";
		f += "return true}return false;";
	}

	// When there are more than three length categories, an outer
	// switch first dispatches on the lengths, to save on comparisons.

	if (cats.length > 3) {
		cats.sort(function(a, b) {return b.length - a.length;});
		f += "switch(str.length){";
		for (var i = 0; i < cats.length; ++i) {
			var cat = cats[i];
			f += "case " + cat[0].length + ":";
			compareTo(cat);
		}
		f += "}";

	// Otherwise, simply generate a flat `switch` statement.

	} else {
		compareTo(words);
	}
	return new Function("str", f);
}

// ECMAScript 5 reserved words.

var isReservedWord5 = makePredicate("class enum extends super const export import");

// The additional reserved words in strict mode.

var isStrictReservedWord = makePredicate("implements interface let package private protected public static yield");

// The forbidden variable names in strict mode.

var isStrictBadIdWord = makePredicate("eval arguments");

// And the keywords.

var __t2 = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";

var isEcma5AndLessKeyword = makePredicate(__t2);

var isEcma6Keyword = makePredicate(__t2 + " let const class extends export import yield");

// ## Character categories

// Big ugly regular expressions that match characters in the
// whitespace, identifier, and identifier-start categories. These
// are only applied when a character is found to actually have a
// code point above 128.

var __t = (function(){
	var regenerate = require('regenerate')
	var get = _.memoize(function(v){return require('unicode-7.0.0/categories/'+v+'/code-points')})

	var unencode = function(v){return v.replace(/\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}/g, function(v){return String.fromCharCode(parseInt(v.slice(2), 16))})}
	//! incorrect bad. probably should be JSON.parse

	var start = regenerate('$', '_', get('Lu'), get('Ll'), get('Lt'), get('Lm'), get('Lo'), get('Nl'))
		.removeRange(0x010000, 0x10FFFF) // remove astral symbols
		.removeRange(0x0, 0x7F) // remove ASCII symbols (Acorn-specific)
	var part = regenerate('\u200C', '\u200D', get('Mn'), get('Mc'), get('Nd'), get('Pc'))
		.removeRange(0x010000, 0x10FFFF) // remove astral symbols
		.remove(start) // (Acorn-specific)
		.removeRange(0x0, 0x7F) // remove ASCII symbols (Acorn-specific)
	return [new RegExp(unencode(start.toString())), new RegExp(unencode(part.add(start).toString()))]
	})()

var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/
var nonASCIIidentifierStart = __t[0]
var nonASCIIidentifier = __t[1]

// Whether a single character denotes a newline.

var newline = /[\n\r\u2028\u2029]/;

function isNewLine(code) {
	return code === 10 || code === 13 || code === 0x2028 || code == 0x2029;
}

// Matches a whole line break (where CRLF is considered a single
// line break). Used to count lines.

var lineBreak = /\r\n|[\n\r\u2028\u2029]/g;

// Test whether a given character code starts an identifier.

var isIdentifierStart = function(code) {
	if (code < 65) return code === 36;
	if (code < 91) return true;
	if (code < 97) return code === 95;
	if (code < 123)return true;
	return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
};

// Test whether a given character is part of an identifier.

var isIdentifierChar = function(code) {
	if (code < 48) return code === 36;
	if (code < 58) return true;
	if (code < 65) return false;
	if (code < 91) return true;
	if (code < 97) return code === 95;
	if (code < 123)return true;
	return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
};

// ## Tokenizer

// These are used when `options.locations` is on, for the
// `tokStartLoc` and `tokEndLoc` properties.

function curPosition() {return {line: φ.tokCurLine, column: φ.tokPos - φ.tokLineStart}}

// The algorithm used to determine whether a regexp can appear at a
// given point in the program is loosely based on sweet.js' approach.
// See https://github.com/mozilla/sweet.js/wiki/design

var b_stat = {token: "{", isExpr: false}, b_expr = {token: "{", isExpr: true}, b_tmpl = {token: "${", isExpr: true};
var p_stat = {token: "(", isExpr: false}, p_expr = {token: "(", isExpr: true};
var q_tmpl = {token: "`", isExpr: true}, f_expr = {token: "function", isExpr: true};

function curTokContext() {return φ.tokContext[φ.tokContext.length - 1]}

function braceIsBlock(prevType) {
	var parent;
	if (prevType === _colon && (parent = curTokContext()).token == "{")
		return !parent.isExpr;
	if (prevType === _return)
		return newline.test(φ.input.slice(φ.lastEnd, φ.tokStart));
	if (prevType === _else || prevType === _semi || prevType === _eof)
		return true;
	if (prevType == _braceL)
		return curTokContext() === b_stat;
	return !φ.tokExprAllowed;
}

// Called at the end of every token. Sets `tokEnd`, `tokVal`, and
// maintains `tokContext` and `tokExprAllowed`, and skips the space
// after the token, so that the next one's `tokStart` will point at
// the right position.

function finishToken(type, val) {
	φ.tokEnd = φ.tokPos;
	φ.tokEndLoc = curPosition();
	var prevType = φ.tokType, preserveSpace = false;
	φ.tokType = type;
	φ.tokVal = val;

	// Update context info
	if (type === _parenR || type === _braceR) {
		var out = φ.tokContext.pop();
		if (out === b_tmpl) {
			preserveSpace = true;
		} else if (out === b_stat && curTokContext() === f_expr) {
			φ.tokContext.pop();
			φ.tokExprAllowed = false;
		} else {
			φ.tokExprAllowed = !(out && out.isExpr);
		}
	} else if (type === _braceL) {
		φ.tokContext.push(braceIsBlock(prevType) ? b_stat : b_expr);
		φ.tokExprAllowed = true;
	} else if (type === _dollarBraceL) {
		φ.tokContext.push(b_tmpl);
		φ.tokExprAllowed = true;
	} else if (type == _parenL) {
		var statementParens = prevType === _if || prevType === _for || prevType === _with || prevType === _while;
		φ.tokContext.push(statementParens ? p_stat : p_expr);
		φ.tokExprAllowed = true;
	} else if (type == _incDec) {
		// tokExprAllowed stays unchanged
	} else if (type.keyword && prevType == _dot) {
		φ.tokExprAllowed = false;
	} else if (type == _function) {
		if (curTokContext() !== b_stat) {
			φ.tokContext.push(f_expr);
		}
		φ.tokExprAllowed = false;
	} else if (type === _backQuote) {
		if (curTokContext() === q_tmpl) {
			φ.tokContext.pop();
		} else {
			φ.tokContext.push(q_tmpl);
			preserveSpace = true;
		}
		φ.tokExprAllowed = false;
	} else {
		φ.tokExprAllowed = type.beforeExpr;
	}

	if (!preserveSpace) skipSpace();
}

function skipBlockComment() {
	var startLoc = curPosition();
	var start = φ.tokPos, end = φ.input.indexOf("*/", φ.tokPos += 2);
	if (end === -1) raise(φ.tokPos - 2, "Unterminated comment");
	φ.tokPos = end + 2;
	lineBreak.lastIndex = start;
	var match;
	while ((match = lineBreak.exec(φ.input)) && match.index < φ.tokPos) {
		++φ.tokCurLine;
		φ.tokLineStart = match.index + match[0].length;
	}
	φ.onComment(true, φ.input.slice(start + 2, end), start, φ.tokPos, startLoc, curPosition());
}

function skipLineComment(startSkip) {
	var start = φ.tokPos;
	var startLoc = curPosition();
	var ch = φ.input.charCodeAt(φ.tokPos+=startSkip);
	while (φ.tokPos < φ.inputLen && ch !== 10 && ch !== 13 && ch !== 8232 && ch !== 8233) {
		++φ.tokPos;
		ch = φ.input.charCodeAt(φ.tokPos);
	}
	φ.onComment(false, φ.input.slice(start + startSkip, φ.tokPos), start, φ.tokPos, startLoc, curPosition());
}

// Called at the start of the parse and after every token. Skips
// whitespace and comments, and.

function skipSpace() {
	while (φ.tokPos < φ.inputLen) {
		var ch = φ.input.charCodeAt(φ.tokPos);
		if (ch === 32) { // ' '
			++φ.tokPos;
		} else if (ch === 13) {
			++φ.tokPos;
			var next = φ.input.charCodeAt(φ.tokPos);
			if (next === 10) {
				++φ.tokPos;
			}
			++φ.tokCurLine;
			φ.tokLineStart = φ.tokPos;
		} else if (ch === 10 || ch === 8232 || ch === 8233) {
			++φ.tokPos;
			++φ.tokCurLine;
			φ.tokLineStart = φ.tokPos;
		} else if (ch > 8 && ch < 14) {
			++φ.tokPos;
		} else if (ch === 47) { // '/'
			var next = φ.input.charCodeAt(φ.tokPos + 1);
			if (next === 42) { // '*'
				skipBlockComment();
			} else if (next === 47) { // '/'
				skipLineComment(2);
			} else break;
		} else if (ch === 160) { // '\xa0'
			++φ.tokPos;
		} else if (ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
			++φ.tokPos;
		} else {
			break;
		}
	}
}

// ### Token reading

// This is the function that is called to fetch the next token. It
// is somewhat obscure, because it works in character codes rather
// than characters, and because operator parsing has been inlined
// into it.
//
// All in the name of speed.

function readToken_dot() {
	var next = φ.input.charCodeAt(φ.tokPos + 1);
	if (next >= 48 && next <= 57) return readNumber(true);
	var next2 = φ.input.charCodeAt(φ.tokPos + 2);
	if (φ.ecmaVersion >= 6 && next === 46 && next2 === 46) { // 46 = dot '.'
		φ.tokPos += 3;
		return finishToken(_ellipsis);
	} else {
		++φ.tokPos;
		return finishToken(_dot);
	}
}

function readToken_slash() { // '/'
	var next = φ.input.charCodeAt(φ.tokPos + 1);
	if (φ.tokExprAllowed) {++φ.tokPos; return readRegexp();}
	if (next === 61) return finishOp(_assign, 2);
	return finishOp(_slash, 1);
}

function readToken_mult_modulo(code) { // '%*'
	var next = φ.input.charCodeAt(φ.tokPos + 1);
	if (next === 61) return finishOp(_assign, 2);
	return finishOp(code === 42 ? _star : _modulo, 1);
}

function readToken_pipe_amp(code) { // '|&'
	var next = φ.input.charCodeAt(φ.tokPos + 1);
	if (next === code) return finishOp(code === 124 ? _logicalOR : _logicalAND, 2);
	if (next === 61) return finishOp(_assign, 2);
	return finishOp(code === 124 ? _bitwiseOR : _bitwiseAND, 1);
}

function readToken_caret() { // '^'
	var next = φ.input.charCodeAt(φ.tokPos + 1);
	if (next === 61) return finishOp(_assign, 2);
	return finishOp(_bitwiseXOR, 1);
}

function readToken_plus_min(code) { // '+-'
	var next = φ.input.charCodeAt(φ.tokPos + 1);
	if (next === code) {
		if (next == 45 && φ.input.charCodeAt(φ.tokPos + 2) == 62 &&
				newline.test(φ.input.slice(φ.lastEnd, φ.tokPos))) {
			// A `-->` line comment
			skipLineComment(3);
			skipSpace();
			return readToken();
		}
		return finishOp(_incDec, 2);
	}
	if (next === 61) return finishOp(_assign, 2);
	return finishOp(_plusMin, 1);
}

function readToken_lt_gt(code) { // '<>'
	var next = φ.input.charCodeAt(φ.tokPos + 1);
	var size = 1;
	if (next === code) {
		size = code === 62 && φ.input.charCodeAt(φ.tokPos + 2) === 62 ? 3 : 2;
		if (φ.input.charCodeAt(φ.tokPos + size) === 61) return finishOp(_assign, size + 1);
		return finishOp(_bitShift, size);
	}
	if (next == 33 && code == 60 && φ.input.charCodeAt(φ.tokPos + 2) == 45 &&
			φ.input.charCodeAt(φ.tokPos + 3) == 45) {
		// `<!--`, an XML-style comment that should be interpreted as a line comment
		skipLineComment(4);
		skipSpace();
		return readToken();
	}
	if (next === 61)
		size = φ.input.charCodeAt(φ.tokPos + 2) === 61 ? 3 : 2;
	return finishOp(_relational, size);
}

function readToken_eq_excl(code) { // '=!', '=>'
	var next = φ.input.charCodeAt(φ.tokPos + 1);
	if (next === 61) return finishOp(_equality, φ.input.charCodeAt(φ.tokPos + 2) === 61 ? 3 : 2);
	if (code === 61 && next === 62 && φ.ecmaVersion >= 6) { // '=>'
		φ.tokPos += 2;
		return finishToken(_arrow);
	}
	return finishOp(code === 61 ? _eq : _prefix, 1);
}

function getTokenFromCode(code) {
	switch (code) {
	// The interpretation of a dot depends on whether it is followed
	// by a digit or another two dots.
	case 46: // '.'
		return readToken_dot();

	// Punctuation tokens.
	case 40: ++φ.tokPos; return finishToken(_parenL);
	case 41: ++φ.tokPos; return finishToken(_parenR);
	case 59: ++φ.tokPos; return finishToken(_semi);
	case 44: ++φ.tokPos; return finishToken(_comma);
	case 91: ++φ.tokPos; return finishToken(_bracketL);
	case 93: ++φ.tokPos; return finishToken(_bracketR);
	case 123: ++φ.tokPos; return finishToken(_braceL);
	case 125: ++φ.tokPos; return finishToken(_braceR);
	case 58: ++φ.tokPos; return finishToken(_colon);
	case 63: ++φ.tokPos; return finishToken(_question);

	case 96: // '`'
		if (φ.ecmaVersion >= 6) {
			++φ.tokPos;
			return finishToken(_backQuote);
		} else {
			return false;
		}

	case 48: // '0'
		var next = φ.input.charCodeAt(φ.tokPos + 1);
		if (next === 120 || next === 88) return readRadixNumber(16); // '0x', '0X' - hex number
		if (φ.ecmaVersion >= 6) {
			if (next === 111 || next === 79) return readRadixNumber(8); // '0o', '0O' - octal number
			if (next === 98 || next === 66) return readRadixNumber(2); // '0b', '0B' - binary number
		}
	// Anything else beginning with a digit is an integer, octal
	// number, or float.
	case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: // 1-9
		return readNumber(false);

	// Quotes produce strings.
	case 34: case 39: // '"', "'"
		return readString(code);

	// Operators are parsed inline in tiny state machines. '=' (61) is
	// often referred to. `finishOp` simply skips the amount of
	// characters it is given as second argument, and returns a token
	// of the type given by its first argument.

	case 47: // '/'
		return readToken_slash();

	case 37: case 42: // '%*'
		return readToken_mult_modulo(code);

	case 124: case 38: // '|&'
		return readToken_pipe_amp(code);

	case 94: // '^'
		return readToken_caret();

	case 43: case 45: // '+-'
		return readToken_plus_min(code);

	case 60: case 62: // '<>'
		return readToken_lt_gt(code);

	case 61: case 33: // '=!'
		return readToken_eq_excl(code);

	case 126: // '~'
		return finishOp(_prefix, 1);
	}

	return false;
}

function readToken() {
	φ.tokStart = φ.tokPos;
	φ.tokStartLoc = curPosition();
	if (φ.tokPos >= φ.inputLen) return finishToken(_eof);

	if (curTokContext() === q_tmpl) {
		return readTmplToken();
	}

	var code = φ.input.charCodeAt(φ.tokPos);

	// Identifier or keyword. '\uXXXX' sequences are allowed in
	// identifiers, so '\' also dispatches to that.
	if (isIdentifierStart(code) || code === 92 /* '\' */) return readWord();

	var tok = getTokenFromCode(code);

	if (tok === false) {
		// If we are here, we either found a non-ASCII identifier
		// character, or something that's entirely disallowed.
		var ch = String.fromCharCode(code);
		if (ch === "\\" || nonASCIIidentifierStart.test(ch)) return readWord();
		raise(φ.tokPos, "Unexpected character '" + ch + "'");
	}
	return tok;
}

function finishOp(type, size) {
	var str = φ.input.slice(φ.tokPos, φ.tokPos + size);
	φ.tokPos += size;
	finishToken(type, str);
}

var regexpUnicodeSupport = false; try {new RegExp("\uffff", "u"); regexpUnicodeSupport = true} catch (e) {}

// Parse a regular expression. Some context-awareness is necessary,
// since a '/' inside a '[]' set does not end the expression.

function readRegexp() {
	var content = "", escaped, inClass, start = φ.tokPos;
	for (;;) {
		if (φ.tokPos >= φ.inputLen) raise(start, "Unterminated regular expression");
		var ch = φ.input.charAt(φ.tokPos);
		if (newline.test(ch)) raise(start, "Unterminated regular expression");
		if (!escaped) {
			if (ch === "[") inClass = true;
			else if (ch === "]" && inClass) inClass = false;
			else if (ch === "/" && !inClass) break;
			escaped = ch === "\\";
		} else escaped = false;
		++φ.tokPos;
	}
	var content = φ.input.slice(start, φ.tokPos);
	++φ.tokPos;
	// Need to use `readWord1` because '\uXXXX' sequences are allowed
	// here (don't ask).
	var mods = readWord1();
	var tmp = content;
	if (mods) {
		var validFlags = /^[gmsiy]*$/;
		if (φ.ecmaVersion >= 6) validFlags = /^[gmsiyu]*$/;
		if (!validFlags.test(mods)) raise(start, "Invalid regular expression flag");
		if (mods.indexOf('u') >= 0 && !regexpUnicodeSupport) {
			// Replace each astral symbol and every Unicode code point
			// escape sequence that represents such a symbol with a single
			// ASCII symbol to avoid throwing on regular expressions that
			// are only valid in combination with the `/u` flag.
			tmp = tmp
				.replace(/\\u\{([0-9a-fA-F]{5,6})\}/g, "x")
				.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "x");
		}
	}
	// Detect invalid regular expressions.
	try {
		new RegExp(tmp);
	} catch (e) {
		if (e instanceof SyntaxError) raise(start, "Error parsing regular expression: " + e.message);
		raise(e);
	}
	// Get a regular expression object for this pattern-flag pair, or `null` in
	// case the current environment doesn't support the flags it uses.
	try {var value = new RegExp(content, mods)} catch (e) {value = null}
	return finishToken(_regexp, {pattern: content, flags: mods, value: value});
}

// Read an integer in the given radix. Return null if zero digits
// were read, the integer value otherwise. When `len` is given, this
// will return `null` unless the integer has exactly `len` digits.

function readInt(radix, len) {
	var start = φ.tokPos, total = 0;
	for (var i = 0, e = len == null ? Infinity : len; i < e; ++i) {
		var code = φ.input.charCodeAt(φ.tokPos), val;
		if (code >= 97) val = code - 97 + 10; // a
		else if (code >= 65) val = code - 65 + 10; // A
		else if (code >= 48 && code <= 57) val = code - 48; // 0-9
		else val = Infinity;
		if (val >= radix) break;
		++φ.tokPos;
		total = total * radix + val;
	}
	if (φ.tokPos === start || len != null && φ.tokPos - start !== len) return null;

	return total;
}

function readRadixNumber(radix) {
	φ.tokPos += 2; // 0x
	var val = readInt(radix);
	if (val == null) raise(φ.tokStart + 2, "Expected number in radix " + radix);
	if (isIdentifierStart(φ.input.charCodeAt(φ.tokPos))) raise(φ.tokPos, "Identifier directly after number");
	return finishToken(_num, val);
}

// Read an integer, octal integer, or floating-point number.

function readNumber(startsWithDot) {
	var start = φ.tokPos, isFloat = false, octal = φ.input.charCodeAt(φ.tokPos) === 48;
	if (!startsWithDot && readInt(10) === null) raise(start, "Invalid number");
	if (φ.input.charCodeAt(φ.tokPos) === 46) {
		++φ.tokPos;
		readInt(10);
		isFloat = true;
	}
	var next = φ.input.charCodeAt(φ.tokPos);
	if (next === 69 || next === 101) { // 'eE'
		next = φ.input.charCodeAt(++φ.tokPos);
		if (next === 43 || next === 45) ++φ.tokPos; // '+-'
		if (readInt(10) === null) raise(start, "Invalid number");
		isFloat = true;
	}
	if (isIdentifierStart(φ.input.charCodeAt(φ.tokPos))) raise(φ.tokPos, "Identifier directly after number");

	var str = φ.input.slice(start, φ.tokPos), val;
	if (isFloat) val = parseFloat(str);
	else if (!octal || str.length === 1) val = parseInt(str, 10);
	else if (/[89]/.test(str) || φ.strict) raise(start, "Invalid number");
	else val = parseInt(str, 8);
	return finishToken(_num, val);
}

// Read a string value, interpreting backslash-escapes.

function readCodePoint() {
	var ch = φ.input.charCodeAt(φ.tokPos), code;

	if (ch === 123) {
		if (φ.ecmaVersion < 6) unexpected();
		++φ.tokPos;
		code = readHexChar(φ.input.indexOf('}', φ.tokPos) - φ.tokPos);
		++φ.tokPos;
		if (code > 0x10FFFF) unexpected();
	} else {
		code = readHexChar(4);
	}

	// UTF-16 Encoding
	if (code <= 0xFFFF) {
		return String.fromCharCode(code);
	}
	var cu1 = ((code - 0x10000) >> 10) + 0xD800;
	var cu2 = ((code - 0x10000) & 1023) + 0xDC00;
	return String.fromCharCode(cu1, cu2);
}

function readString(quote) {
	var out = "", chunkStart = ++φ.tokPos;
	for (;;) {
		if (φ.tokPos >= φ.inputLen) raise(φ.tokStart, "Unterminated string constant");
		var ch = φ.input.charCodeAt(φ.tokPos);
		if (ch === quote) break;
		if (ch === 92) { // '\'
			out += φ.input.slice(chunkStart, φ.tokPos);
			out += readEscapedChar();
			chunkStart = φ.tokPos;
		} else {
			if (isNewLine(ch)) raise(φ.tokStart, "Unterminated string constant");
			++φ.tokPos;
		}
	}
	out += φ.input.slice(chunkStart, φ.tokPos++);
	return finishToken(_string, out);
}

// Reads template string tokens.

function readTmplToken() {
	var out = "", chunkStart = φ.tokPos;
	for (;;) {
		if (φ.tokPos >= φ.inputLen) raise(φ.tokStart, "Unterminated template");
		var ch = φ.input.charCodeAt(φ.tokPos);
		if (ch === 96 || ch === 36 && φ.input.charCodeAt(φ.tokPos + 1) === 123) { // '`', '${'
			if (φ.tokPos === φ.tokStart && φ.tokType === _template) {
				if (ch === 36) {
					φ.tokPos += 2;
					return finishToken(_dollarBraceL);
				} else {
					++φ.tokPos;
					return finishToken(_backQuote);
				}
			}
			out += φ.input.slice(chunkStart, φ.tokPos);
			return finishToken(_template, out);
		}
		if (ch === 92) { // '\'
			out += φ.input.slice(chunkStart, φ.tokPos);
			out += readEscapedChar();
			chunkStart = φ.tokPos;
		} else if (isNewLine(ch)) {
			out += φ.input.slice(chunkStart, φ.tokPos);
			++φ.tokPos;
			if (ch === 13 && φ.input.charCodeAt(φ.tokPos) === 10) {
				++φ.tokPos;
				out += "\n";
			} else {
				out += String.fromCharCode(ch);
			}
			++φ.tokCurLine;
			φ.tokLineStart = φ.tokPos;
			chunkStart = φ.tokPos;
		} else {
			++φ.tokPos;
		}
	}
}

// Used to read escaped characters

function readEscapedChar() {
	var ch = φ.input.charCodeAt(++φ.tokPos);
	var octal = /^[0-7]+/.exec(φ.input.slice(φ.tokPos, φ.tokPos + 3));
	if (octal) octal = octal[0];
	while (octal && parseInt(octal, 8) > 255) octal = octal.slice(0, -1);
	if (octal === "0") octal = null;
	++φ.tokPos;
	if (octal) {
		if (φ.strict) raise(φ.tokPos - 2, "Octal literal in strict mode");
		φ.tokPos += octal.length - 1;
		return String.fromCharCode(parseInt(octal, 8));
	} else {
		switch (ch) {
			case 110: return "\n"; // 'n' -> '\n'
			case 114: return "\r"; // 'r' -> '\r'
			case 120: return String.fromCharCode(readHexChar(2)); // 'x'
			case 117: return readCodePoint(); // 'u'
			case 116: return "\t"; // 't' -> '\t'
			case 98: return "\b"; // 'b' -> '\b'
			case 118: return "\u000b"; // 'v' -> '\u000b'
			case 102: return "\f"; // 'f' -> '\f'
			case 48: return "\0"; // 0 -> '\0'
			case 13: if (φ.input.charCodeAt(φ.tokPos) === 10) ++φ.tokPos; // '\r\n'
			case 10: // ' \n'
				φ.tokLineStart = φ.tokPos; ++φ.tokCurLine;
				return "";
			default: return String.fromCharCode(ch);
		}
	}
}

// Used to read character escape sequences ('\x', '\u', '\U').

function readHexChar(len) {
	var n = readInt(16, len);
	if (n === null) raise(φ.tokStart, "Bad character escape sequence");
	return n;
}

// Used to signal to callers of `readWord1` whether the word
// contained any escape sequences. This is needed because words with
// escape sequences must not be interpreted as keywords.

var containsEsc;

// Read an identifier, and return it as a string. Sets `containsEsc`
// to whether the word contained a '\u' escape.
//
// Incrementally adds only escaped chars, adding other chunks as-is
// as a micro-optimization.

function readWord1() {
	containsEsc = false;
	var word = "", first = true, chunkStart = φ.tokPos;
	while (φ.tokPos < φ.inputLen) {
		var ch = φ.input.charCodeAt(φ.tokPos);
		if (isIdentifierChar(ch)) {
			++φ.tokPos;
		} else if (ch === 92) { // "\"
			containsEsc = true;
			word += φ.input.slice(chunkStart, φ.tokPos);
			if (φ.input.charCodeAt(++φ.tokPos) != 117) // "u"
				raise(φ.tokPos, "Expecting Unicode escape sequence \\uXXXX");
			++φ.tokPos;
			var esc = readHexChar(4);
			var escStr = String.fromCharCode(esc);
			if (!escStr) raise(φ.tokPos - 1, "Invalid Unicode escape");
			if (!(first ? isIdentifierStart(esc) : isIdentifierChar(esc)))
				raise(φ.tokPos - 4, "Invalid Unicode escape");
			word += escStr;
			chunkStart = φ.tokPos;
		} else {
			break;
		}
		first = false;
	}
	return word + φ.input.slice(chunkStart, φ.tokPos);
}

// Read an identifier or keyword token. Will check for reserved
// words when necessary.

function readWord() {
	var word = readWord1();
	var type = _name;
	if (!containsEsc && φ.isKeyword(word))
		type = keywordTypes[word];
	return finishToken(type, word);
}

// ## Parser

// A recursive descent parser operates by defining functions for all
// syntactic elements, and recursively calling those, each function
// advancing the input stream and returning an AST node. Precedence
// of constructs (for example, the fact that `!x[1]` means `!(x[1])`
// instead of `(!x)[1]` is handled by the fact that the parser
// function that parses unary prefix operators is called first, and
// in turn calls the function that parses `[]` subscripts — that
// way, it'll receive the node for `x[1]` already parsed, and wraps
// *that* in the unary operator node.
//
// Acorn uses an [operator precedence parser][opp] to handle binary
// operator precedence, because it is much more compact than using
// the technique outlined above, which uses different, nesting
// functions to specify precedence, for all of the ten binary
// precedence levels that JavaScript defines.
//
// [opp]: http://en.wikipedia.org/wiki/Operator-precedence_parser

// ### Parser utilities

// Continue to the next token.

function next() {var t;
	φ.onToken({
		type: φ.tokType,
		value: φ.tokVal,
		start: φ.tokStart,
		end: φ.tokEnd,
		loc: (t = new SourceLocation(), t.end = φ.tokEndLoc, t),
		})

	φ.lastStart = φ.tokStart;
	φ.lastEnd = φ.tokEnd;
	φ.lastEndLoc = φ.tokEndLoc;
	readToken();
}

// Enter strict mode. Re-reads the next number or string to
// please pedantic tests ("use strict"; 010; -- should fail).

function setStrict(strct) {
	φ.strict = strct;
	if (φ.tokType !== _num && φ.tokType !== _string) return;
	φ.tokPos = φ.tokStart;
	while (φ.tokPos < φ.tokLineStart) {
		φ.tokLineStart = φ.input.lastIndexOf("\n", φ.tokLineStart - 2) + 1;
		--φ.tokCurLine;
	}
	skipSpace();
	readToken();
}

// Start an AST node, attaching a start offset.

function Node() {
	this.type = null;
	this.start = φ.tokStart;
	this.end = null;
}

function SourceLocation() {
	this.start = φ.tokStartLoc;
	this.end = null;
}

function startNode() {
	var node = new Node();
	node.loc = new SourceLocation();
	return node;
}

// Sometimes, a node is only started *after* the token stream passed
// its start position. The functions below help storing a position
// and creating a node from a previous position.

function storeCurrentPos() {
	return [φ.tokStart, φ.tokStartLoc];
}

function startNodeAt(pos) {
	var node = new Node();
	node.start = pos[0];
	node.loc = new SourceLocation();
	node.loc.start = pos[1];
	return node;
}

// Finish an AST node, adding `type` and `end` properties.

function finishNode(node, type) {
	node.type = type;
	node.end = φ.lastEnd;
	node.loc.end = φ.lastEndLoc;
	return node;
}

// Finish node at given position

function finishNodeAt(node, type, pos) {
	node.loc.end = pos[1]; pos = pos[0];
	node.type = type;
	node.end = pos;
	return node;
}

// Test whether a statement node is the string literal `"use strict"`.

function isUseStrict(stmt) {
	return φ.ecmaVersion >= 5 && stmt.type === "ExpressionStatement" &&
		stmt.expression.type === "Literal" && stmt.expression.value === "use strict";
}

// Predicate that tests whether the next token is of the given
// type, and if yes, consumes it as a side effect.

function eat(type) {
	if (φ.tokType === type) {
		next();
		return true;
	} else {
		return false;
	}
}

// Tests whether parsed token is a contextual keyword.

function isContextual(name) {
	return φ.tokType === _name && φ.tokVal === name;
}

// Consumes contextual keyword if possible.

function eatContextual(name) {
	return φ.tokVal === name && eat(_name);
}

// Asserts that following token is given contextual keyword.

function expectContextual(name) {
	if (!eatContextual(name)) unexpected();
}

// Test whether a semicolon can be inserted at the current position.

function canInsertSemicolon() {
	return φ.tokType === _eof || φ.tokType === _braceR || newline.test(φ.input.slice(φ.lastEnd, φ.tokStart));
}

// Consume a semicolon, or, failing that, see if we are allowed to
// pretend that there is a semicolon at this position.

function semicolon() {
	if (!eat(_semi) && !canInsertSemicolon()) unexpected();
}

// Expect a token of a given type. If found, consume it, otherwise,
// raise an unexpected token error.

function expect(type) {
	eat(type) || unexpected();
}

// Raise an unexpected token error.

function unexpected(pos) {
	raise(pos != null ? pos : φ.tokStart, "Unexpected token");
}

// Checks if hash object has a property.

function has(obj, propName) {
	return Object.prototype.hasOwnProperty.call(obj, propName);
}

// Convert existing expression atom to assignable pattern
// if possible.

function toAssignable(node, isBinding) {
	if (φ.ecmaVersion >= 6 && node) {
		switch (node.type) {
			case "Identifier":
			case "ObjectPattern":
			case "ArrayPattern":
			case "AssignmentPattern":
				break;

			case "ObjectExpression":
				node.type = "ObjectPattern";
				for (var i = 0; i < node.properties.length; i++) {
					var prop = node.properties[i];
					if (prop.kind !== "init") raise(prop.key.start, "Object pattern can't contain getter or setter");
					toAssignable(prop.value, isBinding);
				}
				break;

			case "ArrayExpression":
				node.type = "ArrayPattern";
				toAssignableList(node.elements, isBinding);
				break;

			case "AssignmentExpression":
				if (node.operator === "=") {
					node.type = "AssignmentPattern";
				} else {
					raise(node.left.end, "Only '=' operator can be used for specifying default value.");
				}
				break;

			case "MemberExpression":
				if (!isBinding) break;

			default:
				raise(node.start, "Assigning to rvalue");
		}
	}
	return node;
}

// Convert list of expression atoms to binding list.

function toAssignableList(exprList, isBinding) {
	if (exprList.length) {
		for (var i = 0; i < exprList.length - 1; i++) {
			toAssignable(exprList[i], isBinding);
		}
		var last = exprList[exprList.length - 1];
		switch (last.type) {
			case "RestElement":
				break;
			case "SpreadElement":
				last.type = "RestElement";
				var arg = last.argument;
				toAssignable(arg, isBinding);
				if (arg.type !== "Identifier" && arg.type !== "MemberExpression" && arg.type !== "ArrayPattern")
					unexpected(arg.start);
				break;
			default:
				toAssignable(last, isBinding);
		}
	}
	return exprList;
}

// Parses spread element.

function parseSpread(refShorthandDefaultPos) {
	var node = startNode();
	next();
	node.argument = parseMaybeAssign(refShorthandDefaultPos);
	return finishNode(node, "SpreadElement");
}

function parseRest() {
	var node = startNode();
	next();
	node.argument = φ.tokType === _name || φ.tokType === _bracketL ? parseBindingAtom() : unexpected();
	return finishNode(node, "RestElement");
}

// Parses lvalue (assignable) atom.

function parseBindingAtom() {
	if (φ.ecmaVersion < 6) return parseIdent();
	switch (φ.tokType) {
		case _name:
			return parseIdent();

		case _bracketL:
			var node = startNode();
			next();
			node.elements = parseBindingList(_bracketR, true);
			return finishNode(node, "ArrayPattern");

		case _braceL:
			return parseObj(true);

		default:
			unexpected();
	}
}

function parseBindingList(close, allowEmpty) {
	var elts = [], first = true;
	while (!eat(close)) {
		first ? first = false : expect(_comma);
		if (φ.tokType === _ellipsis) {
			elts.push(parseRest());
			expect(close);
			break;
		}
		elts.push(allowEmpty && φ.tokType === _comma ? null : parseMaybeDefault());
	}
	return elts;
}

// Parses assignment pattern around given atom if possible.

function parseMaybeDefault(startPos, left) {
	startPos = startPos || storeCurrentPos();
	left = left || parseBindingAtom();
	if (!eat(_eq)) return left;
	var node = startNodeAt(startPos);
	node.operator = "=";
	node.left = left;
	node.right = parseMaybeAssign();
	return finishNode(node, "AssignmentPattern");
}

// Verify that argument names are not repeated, and it does not
// try to bind the words `eval` or `arguments`.

function checkFunctionParam(param, nameHash) {
	switch (param.type) {
		case "Identifier":
			if (isStrictReservedWord(param.name) || isStrictBadIdWord(param.name))
				raise(param.start, "Defining '" + param.name + "' in strict mode");
			if (has(nameHash, param.name))
				raise(param.start, "Argument name clash in strict mode");
			nameHash[param.name] = true;
			break;

		case "ObjectPattern":
			for (var i = 0; i < param.properties.length; i++)
				checkFunctionParam(param.properties[i].value, nameHash);
			break;

		case "ArrayPattern":
			for (var i = 0; i < param.elements.length; i++) {
				var elem = param.elements[i];
				if (elem) checkFunctionParam(elem, nameHash);
			}
			break;

		case "RestElement":
			return checkFunctionParam(param.argument, nameHash);
	}
}

// Check if property name clashes with already added.
// Object/class getters and setters are not allowed to clash —
// either with each other or with an init property — and in
// strict mode, init properties are also not allowed to be repeated.

function checkPropClash(prop, propHash) {
	if (φ.ecmaVersion >= 6) return;
	var key = prop.key, name;
	switch (key.type) {
		case "Identifier": name = key.name; break;
		case "Literal": name = String(key.value); break;
		default: return;
	}
	var kind = prop.kind || "init", other;
	if (has(propHash, name)) {
		other = propHash[name];
		var isGetSet = kind !== "init";
		if ((φ.strict || isGetSet) && other[kind] || !(isGetSet ^ other.init))
			raise(key.start, "Redefinition of property");
	} else {
		other = propHash[name] = {
			init: false,
			get: false,
			set: false
		};
	}
	other[kind] = true;
}

// Verify that a node is an lval — something that can be assigned
// to.

function checkLVal(expr, isBinding) {
	switch (expr.type) {
		case "Identifier":
			if (φ.strict && (isStrictBadIdWord(expr.name) || isStrictReservedWord(expr.name)))
				raise(expr.start, (isBinding ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
			break;

		case "MemberExpression":
			if (isBinding) raise(expr.start, "Binding to member expression");
			break;

		case "ObjectPattern":
			for (var i = 0; i < expr.properties.length; i++)
				checkLVal(expr.properties[i].value, isBinding);
			break;

		case "ArrayPattern":
			for (var i = 0; i < expr.elements.length; i++) {
				var elem = expr.elements[i];
				if (elem) checkLVal(elem, isBinding);
			}
			break;

		case "AssignmentPattern":
			checkLVal(expr.left);
			break;

		case "RestElement":
			checkLVal(expr.argument);
			break;

		default:
			raise(expr.start, "Assigning to rvalue");
	}
}

// ### Statement parsing

// Parse a program. Initializes the parser, reads any number of
// statements, and wraps them in a Program node.  Optionally takes a
// `program` argument.  If present, the statements will be appended
// to its body instead of creating a new node.

function parseTopLevel(node) {
	var first = true;
	if (!node.body) node.body = [];
	while (φ.tokType !== _eof) {
		var stmt = parseStatement(true, true);
		node.body.push(stmt);
		if (first && isUseStrict(stmt)) setStrict(true);
		first = false;
	}

	next();
	return finishNode(node, "Program");
}

var loopLabel = {kind: "loop"}, switchLabel = {kind: "switch"};

// Parse a single statement.
//
// If expecting a statement and finding a slash operator, parse a
// regular expression literal. This is to handle cases like
// `if (foo) /blah/.exec(foo);`, where looking at the previous token
// does not help.

function parseStatement(declaration, topLevel) {
	var starttype = φ.tokType, node = startNode();

	// Most types of statements are recognized by the keyword they
	// start with. Many are trivial to parse, some require a bit of
	// complexity.

	switch (starttype) {
	case _break: case _continue: return parseBreakContinueStatement(node, starttype.keyword);
	case _debugger: return parseDebuggerStatement(node);
	case _do: return parseDoStatement(node);
	case _for: return parseForStatement(node);
	case _function:
		if (!declaration && options.ecmaVersion >= 6) unexpected();
		return parseFunctionStatement(node);
	case _class:
		if (!declaration) unexpected();
		return parseClass(node, true);
	case _if: return parseIfStatement(node);
	case _return: return parseReturnStatement(node);
	case _switch: return parseSwitchStatement(node);
	case _throw: return parseThrowStatement(node);
	case _try: return parseTryStatement(node);
	case _let: case _const: if (!declaration) unexpected(); // NOTE: falls through to _var
	case _var: return parseVarStatement(node, starttype.keyword);
	case _while: return parseWhileStatement(node);
	case _with: return parseWithStatement(node);
	case _braceL: return parseBlock(); // no point creating a function for this
	case _semi: return parseEmptyStatement(node);
	case _export:
	case _import:
		if (!topLevel)
			raise(φ.tokStart, "'import' and 'export' may only appear at the top level");
		return starttype === _import ? parseImport(node) : parseExport(node);

		// If the statement does not start with a statement keyword or a
		// brace, it's an ExpressionStatement or LabeledStatement. We
		// simply start parsing an expression, and afterwards, if the
		// next token is a colon and the expression was a simple
		// Identifier node, we switch to interpreting it as a label.
	default:
		var maybeName = φ.tokVal, expr = parseExpression();
		if (starttype === _name && expr.type === "Identifier" && eat(_colon))
			return parseLabeledStatement(node, maybeName, expr);
		else return parseExpressionStatement(node, expr);
	}
}

function parseBreakContinueStatement(node, keyword) {
	var isBreak = keyword == "break";
	next();
	if (eat(_semi) || canInsertSemicolon()) node.label = null;
	else if (φ.tokType !== _name) unexpected();
	else {
		node.label = parseIdent();
		semicolon();
	}

	// Verify that there is an actual destination to break or
	// continue to.
	for (var i = 0; i < φ.labels.length; ++i) {
		var lab = φ.labels[i];
		if (node.label == null || lab.name === node.label.name) {
			if (lab.kind != null && (isBreak || lab.kind === "loop")) break;
			if (node.label && isBreak) break;
		}
	}
	if (i === φ.labels.length) raise(node.start, "Unsyntactic " + keyword);
	return finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
}

function parseDebuggerStatement(node) {
	next();
	semicolon();
	return finishNode(node, "DebuggerStatement");
}

function parseDoStatement(node) {
	next();
	φ.labels.push(loopLabel);
	node.body = parseStatement(false);
	φ.labels.pop();
	expect(_while);
	node.test = parseParenExpression();
	if (φ.ecmaVersion >= 6)
		eat(_semi);
	else
		semicolon();
	return finishNode(node, "DoWhileStatement");
}

// Disambiguating between a `for` and a `for`/`in` or `for`/`of`
// loop is non-trivial. Basically, we have to parse the init `var`
// statement or expression, disallowing the `in` operator (see
// the second parameter to `parseExpression`), and then check
// whether the next token is `in` or `of`. When there is no init
// part (semicolon immediately after the opening parenthesis), it
// is a regular `for` loop.

function parseForStatement(node) {
	next();
	φ.labels.push(loopLabel);
	expect(_parenL);
	if (φ.tokType === _semi) return parseFor(node, null);
	if (φ.tokType === _var || φ.tokType === _let) {
		var init = startNode(), varKind = φ.tokType.keyword, isLet = φ.tokType === _let;
		next();
		parseVar(init, true, varKind);
		finishNode(init, "VariableDeclaration");
		if ((φ.tokType === _in || (φ.ecmaVersion >= 6 && isContextual("of"))) && init.declarations.length === 1 &&
				!(isLet && init.declarations[0].init))
			return parseForIn(node, init);
		return parseFor(node, init);
	}
	var refShorthandDefaultPos = {start: 0};
	var init = parseExpression(true, refShorthandDefaultPos);
	if (φ.tokType === _in || (φ.ecmaVersion >= 6 && isContextual("of"))) {
		toAssignable(init);
		checkLVal(init);
		return parseForIn(node, init);
	} else if (refShorthandDefaultPos.start) {
		unexpected(refShorthandDefaultPos.start);
	}
	return parseFor(node, init);
}

function parseFunctionStatement(node) {
	next();
	return parseFunction(node, true);
}

function parseIfStatement(node) {
	next();
	node.test = parseParenExpression();
	node.consequent = parseStatement(false);
	node.alternate = eat(_else) ? parseStatement(false) : null;
	return finishNode(node, "IfStatement");
}

function parseReturnStatement(node) {
	if (!φ.inFunction)
		raise(φ.tokStart, "'return' outside of function");
	next();

	// In `return` (and `break`/`continue`), the keywords with
	// optional arguments, we eagerly look for a semicolon or the
	// possibility to insert one.

	if (eat(_semi) || canInsertSemicolon()) node.argument = null;
	else { node.argument = parseExpression(); semicolon(); }
	return finishNode(node, "ReturnStatement");
}

function parseSwitchStatement(node) {
	next();
	node.discriminant = parseParenExpression();
	node.cases = [];
	expect(_braceL);
	φ.labels.push(switchLabel);

	// Statements under must be grouped (by label) in SwitchCase
	// nodes. `cur` is used to keep the node that we are currently
	// adding statements to.

	var cur; var sawDefault;
	for (; φ.tokType != _braceR;) {
		if (φ.tokType === _case || φ.tokType === _default) {
			var isCase = φ.tokType === _case;
			if (cur) finishNode(cur, "SwitchCase");
			node.cases.push(cur = startNode());
			cur.consequent = [];
			next();
			if (isCase) cur.test = parseExpression();
			else {
				if (sawDefault) raise(φ.lastStart, "Multiple default clauses"); sawDefault = true;
				cur.test = null;
			}
			expect(_colon);
		} else {
			if (!cur) unexpected();
			cur.consequent.push(parseStatement(true));
		}
	}
	if (cur) finishNode(cur, "SwitchCase");
	next(); // Closing brace
	φ.labels.pop();
	return finishNode(node, "SwitchStatement");
}

function parseThrowStatement(node) {
	next();
	if (newline.test(φ.input.slice(φ.lastEnd, φ.tokStart)))
		raise(φ.lastEnd, "Illegal newline after throw");
	node.argument = parseExpression();
	semicolon();
	return finishNode(node, "ThrowStatement");
}

function parseTryStatement(node) {
	next();
	node.block = parseBlock();
	node.handler = null;
	if (φ.tokType === _catch) {
		var clause = startNode();
		next();
		expect(_parenL);
		clause.param = parseBindingAtom();
		checkLVal(clause.param, true);
		expect(_parenR);
		clause.guard = null;
		clause.body = parseBlock();
		node.handler = finishNode(clause, "CatchClause");
	}
	node.guardedHandlers = empty;
	node.finalizer = eat(_finally) ? parseBlock() : null;
	if (!node.handler && !node.finalizer)
		raise(node.start, "Missing catch or finally clause");
	return finishNode(node, "TryStatement");
}

function parseVarStatement(node, kind) {
	next();
	parseVar(node, false, kind);
	semicolon();
	return finishNode(node, "VariableDeclaration");
}

function parseWhileStatement(node) {
	next();
	node.test = parseParenExpression();
	φ.labels.push(loopLabel);
	node.body = parseStatement(false);
	φ.labels.pop();
	return finishNode(node, "WhileStatement");
}

function parseWithStatement(node) {
	if (φ.strict) raise(φ.tokStart, "'with' in strict mode");
	next();
	node.object = parseParenExpression();
	node.body = parseStatement(false);
	return finishNode(node, "WithStatement");
}

function parseEmptyStatement(node) {
	next();
	return finishNode(node, "EmptyStatement");
}

function parseLabeledStatement(node, maybeName, expr) {
	for (var i = 0; i < φ.labels.length; ++i)
		if (φ.labels[i].name === maybeName) raise(expr.start, "Label '" + maybeName + "' is already declared");
	var kind = φ.tokType.isLoop ? "loop" : φ.tokType === _switch ? "switch" : null;
	φ.labels.push({name: maybeName, kind: kind});
	node.body = parseStatement(true);
	φ.labels.pop();
	node.label = expr;
	return finishNode(node, "LabeledStatement");
}

function parseExpressionStatement(node, expr) {
	node.expression = expr;
	semicolon();
	return finishNode(node, "ExpressionStatement");
}

// Used for constructs like `switch` and `if` that insist on
// parentheses around their expression.

function parseParenExpression() {
	expect(_parenL);
	var val = parseExpression();
	expect(_parenR);
	return val;
}

// Parse a semicolon-enclosed block of statements, handling `"use
// strict"` declarations when `allowStrict` is true (used for
// function bodies).

function parseBlock(allowStrict) {
	var node = startNode(), first = true, oldStrict;
	node.body = [];
	expect(_braceL);
	while (!eat(_braceR)) {
		var stmt = parseStatement(true);
		node.body.push(stmt);
		if (first && allowStrict && isUseStrict(stmt)) {
			oldStrict = φ.strict;
			setStrict(φ.strict = true);
		}
		first = false;
	}
	if (oldStrict === false) setStrict(false);
	return finishNode(node, "BlockStatement");
}

// Parse a regular `for` loop. The disambiguation code in
// `parseStatement` will already have parsed the init statement or
// expression.

function parseFor(node, init) {
	node.init = init;
	expect(_semi);
	node.test = φ.tokType === _semi ? null : parseExpression();
	expect(_semi);
	node.update = φ.tokType === _parenR ? null : parseExpression();
	expect(_parenR);
	node.body = parseStatement(false);
	φ.labels.pop();
	return finishNode(node, "ForStatement");
}

// Parse a `for`/`in` and `for`/`of` loop, which are almost
// same from parser's perspective.

function parseForIn(node, init) {
	var type = φ.tokType === _in ? "ForInStatement" : "ForOfStatement";
	next();
	node.left = init;
	node.right = parseExpression();
	expect(_parenR);
	node.body = parseStatement(false);
	φ.labels.pop();
	return finishNode(node, type);
}

// Parse a list of variable declarations.

function parseVar(node, noIn, kind) {
	node.declarations = [];
	node.kind = kind;
	for (;;) {
		var decl = startNode();
		decl.id = parseBindingAtom();
		checkLVal(decl.id, true);
		decl.init = eat(_eq) ? parseMaybeAssign(noIn) : (kind === _const.keyword ? unexpected() : null);
		node.declarations.push(finishNode(decl, "VariableDeclarator"));
		if (!eat(_comma)) break;
	}
	return node;
}

// ### Expression parsing

// These nest, from the most general expression type at the top to
// 'atomic', nondivisible expression types at the bottom. Most of
// the functions will simply let the function(s) below them parse,
// and, *if* the syntactic construct they handle is present, wrap
// the AST node that the inner parser gave them in another node.

// Parse a full expression. The optional arguments are used to
// forbid the `in` operator (in for loops initalization expressions)
// and provide reference for storing '=' operator inside shorthand
// property assignment in contexts where both object expression
// and object pattern might appear (so it's possible to raise
// delayed syntax error at correct position).

function parseExpression(noIn, refShorthandDefaultPos) {
	var start = storeCurrentPos();
	var expr = parseMaybeAssign(noIn, refShorthandDefaultPos);
	if (φ.tokType === _comma) {
		var node = startNodeAt(start);
		node.expressions = [expr];
		while (eat(_comma)) node.expressions.push(parseMaybeAssign(noIn, refShorthandDefaultPos));
		return finishNode(node, "SequenceExpression");
	}
	return expr;
}

// Parse an assignment expression. This includes applications of
// operators like `+=`.

function parseMaybeAssign(noIn, refShorthandDefaultPos) {
	var failOnShorthandAssign;
	if (!refShorthandDefaultPos) {
		refShorthandDefaultPos = {start: 0};
		failOnShorthandAssign = true;
	} else {
		failOnShorthandAssign = false;
	}
	var start = storeCurrentPos();
	var left = parseMaybeConditional(noIn, refShorthandDefaultPos);
	if (φ.tokType.isAssign) {
		var node = startNodeAt(start);
		node.operator = φ.tokVal;
		node.left = φ.tokType === _eq ? toAssignable(left) : left;
		refShorthandDefaultPos.start = 0; // reset because shorthand default was used correctly
		checkLVal(left);
		next();
		node.right = parseMaybeAssign(noIn);
		return finishNode(node, "AssignmentExpression");
	} else if (failOnShorthandAssign && refShorthandDefaultPos.start) {
		unexpected(refShorthandDefaultPos.start);
	}
	return left;
}

// Parse a ternary conditional (`?:`) operator.

function parseMaybeConditional(noIn, refShorthandDefaultPos) {
	var start = storeCurrentPos();
	var expr = parseExprOps(noIn, refShorthandDefaultPos);
	if (refShorthandDefaultPos && refShorthandDefaultPos.start) return expr;
	if (eat(_question)) {
		var node = startNodeAt(start);
		node.test = expr;
		node.consequent = parseMaybeAssign();
		expect(_colon);
		node.alternate = parseMaybeAssign(noIn);
		return finishNode(node, "ConditionalExpression");
	}
	return expr;
}

// Start the precedence parser.

function parseExprOps(noIn, refShorthandDefaultPos) {
	var start = storeCurrentPos();
	var expr = parseMaybeUnary(refShorthandDefaultPos);
	if (refShorthandDefaultPos && refShorthandDefaultPos.start) return expr;
	return parseExprOp(expr, start, -1, noIn);
}

// Parse binary operators with the operator precedence parsing
// algorithm. `left` is the left-hand side of the operator.
// `minPrec` provides context that allows the function to stop and
// defer further parser to one of its callers when it encounters an
// operator that has a lower precedence than the set it is parsing.

function parseExprOp(left, leftStart, minPrec, noIn) {
	var prec = φ.tokType.binop;
	if (prec != null && (!noIn || φ.tokType !== _in)) {
		if (prec > minPrec) {
			var node = startNodeAt(leftStart);
			node.left = left;
			node.operator = φ.tokVal;
			var op = φ.tokType;
			next();
			var start = storeCurrentPos();
			node.right = parseExprOp(parseMaybeUnary(), start, prec, noIn);
			finishNode(node, (op === _logicalOR || op === _logicalAND) ? "LogicalExpression" : "BinaryExpression");
			return parseExprOp(node, leftStart, minPrec, noIn);
		}
	}
	return left;
}

// Parse unary operators, both prefix and postfix.

function parseMaybeUnary(refShorthandDefaultPos) {
	if (φ.tokType.prefix) {
		var node = startNode(), update = φ.tokType.isUpdate;
		node.operator = φ.tokVal;
		node.prefix = true;
		next();
		node.argument = parseMaybeUnary();
		if (refShorthandDefaultPos && refShorthandDefaultPos.start) unexpected(refShorthandDefaultPos.start);
		if (update) checkLVal(node.argument);
		else if (φ.strict && node.operator === "delete" &&
						 node.argument.type === "Identifier")
			raise(node.start, "Deleting local variable in strict mode");
		return finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
	}
	var start = storeCurrentPos();
	var expr = parseExprSubscripts(refShorthandDefaultPos);
	if (refShorthandDefaultPos && refShorthandDefaultPos.start) return expr;
	while (φ.tokType.postfix && !canInsertSemicolon()) {
		var node = startNodeAt(start);
		node.operator = φ.tokVal;
		node.prefix = false;
		node.argument = expr;
		checkLVal(expr);
		next();
		expr = finishNode(node, "UpdateExpression");
	}
	return expr;
}

// Parse call, dot, and `[]`-subscript expressions.

function parseExprSubscripts(refShorthandDefaultPos) {
	var start = storeCurrentPos();
	var expr = parseExprAtom(refShorthandDefaultPos);
	if (refShorthandDefaultPos && refShorthandDefaultPos.start) return expr;
	return parseSubscripts(expr, start);
}

function parseSubscripts(base, start, noCalls) {
	if (eat(_dot)) {
		var node = startNodeAt(start);
		node.object = base;
		node.property = parseIdent(true);
		node.computed = false;
		return parseSubscripts(finishNode(node, "MemberExpression"), start, noCalls);
	} else if (eat(_bracketL)) {
		var node = startNodeAt(start);
		node.object = base;
		node.property = parseExpression();
		node.computed = true;
		expect(_bracketR);
		return parseSubscripts(finishNode(node, "MemberExpression"), start, noCalls);
	} else if (!noCalls && eat(_parenL)) {
		var node = startNodeAt(start);
		node.callee = base;
		node.arguments = parseExprList(_parenR, false);
		return parseSubscripts(finishNode(node, "CallExpression"), start, noCalls);
	} else if (φ.tokType === _backQuote) {
		var node = startNodeAt(start);
		node.tag = base;
		node.quasi = parseTemplate();
		return parseSubscripts(finishNode(node, "TaggedTemplateExpression"), start, noCalls);
	} return base;
}

// Parse an atomic expression — either a single token that is an
// expression, an expression started by a keyword like `function` or
// `new`, or an expression wrapped in punctuation like `()`, `[]`,
// or `{}`.

function parseExprAtom(refShorthandDefaultPos) {
	switch (φ.tokType) {
	case _this:
		var node = startNode();
		next();
		return finishNode(node, "ThisExpression");

	case _yield:
		if (φ.inGenerator) return parseYield();

	case _name:
		var start = storeCurrentPos();
		var id = parseIdent(φ.tokType !== _name);
		if (!canInsertSemicolon() && eat(_arrow)) {
			return parseArrowExpression(startNodeAt(start), [id]);
		}
		return id;

	case _regexp:
		var node = startNode();
		node.regex = {pattern: φ.tokVal.pattern, flags: φ.tokVal.flags};
		node.value = φ.tokVal.value;
		node.raw = φ.input.slice(φ.tokStart, φ.tokEnd);
		next();
		return finishNode(node, "Literal");

	case _num: case _string:
		var node = startNode();
		node.value = φ.tokVal;
		node.raw = φ.input.slice(φ.tokStart, φ.tokEnd);
		next();
		return finishNode(node, "Literal");

	case _null: case _true: case _false:
		var node = startNode();
		node.value = φ.tokType.atomValue;
		node.raw = φ.tokType.keyword;
		next();
		return finishNode(node, "Literal");

	case _parenL:
		return parseParenAndDistinguishExpression();

	case _bracketL:
		var node = startNode();
		next();
		// check whether this is array comprehension or regular array
		if (φ.ecmaVersion >= 7 && φ.tokType === _for) {
			return parseComprehension(node, false);
		}
		node.elements = parseExprList(_bracketR, true, true, refShorthandDefaultPos);
		return finishNode(node, "ArrayExpression");

	case _braceL:
		return parseObj(false, refShorthandDefaultPos);

	case _function:
		var node = startNode();
		next();
		return parseFunction(node, false);

	case _class:
		return parseClass(startNode(), false);

	case _new:
		return parseNew();

	case _backQuote:
		return parseTemplate();

	default:
		unexpected();
	}
}

function parseParenAndDistinguishExpression() {
	var start = storeCurrentPos(), val;
	if (φ.ecmaVersion >= 6) {
		next();

		if (φ.ecmaVersion >= 7 && φ.tokType === _for) {
			return parseComprehension(startNodeAt(start), true);
		}

		var innerStart = storeCurrentPos(), exprList = [], first = true;
		var refShorthandDefaultPos = {start: 0}, spreadStart, innerParenStart;
		while (φ.tokType !== _parenR) {
			first ? first = false : expect(_comma);
			if (φ.tokType === _ellipsis) {
				spreadStart = φ.tokStart;
				exprList.push(parseRest());
				break;
			} else {
				if (φ.tokType === _parenL && !innerParenStart) {
					innerParenStart = φ.tokStart;
				}
				exprList.push(parseMaybeAssign(false, refShorthandDefaultPos));
			}
		}
		var innerEnd = storeCurrentPos();
		expect(_parenR);

		if (!canInsertSemicolon() && eat(_arrow)) {
			if (innerParenStart) unexpected(innerParenStart);
			return parseArrowExpression(startNodeAt(start), exprList);
		}

		if (!exprList.length) unexpected(φ.lastStart);
		if (spreadStart) unexpected(spreadStart);
		if (refShorthandDefaultPos.start) unexpected(refShorthandDefaultPos.start);

		if (exprList.length > 1) {
			val = startNodeAt(innerStart);
			val.expressions = exprList;
			finishNodeAt(val, "SequenceExpression", innerEnd);
		} else {
			val = exprList[0];
		}
	} else {
		val = parseParenExpression();
	}

	// if (options.preserveParens) {
		var par = startNodeAt(start);
		par.expression = val;
		return finishNode(par, "ParenthesizedExpression");
	// } else {
	// 	return val;
	// }
}

// New's precedence is slightly tricky. It must allow its argument
// to be a `[]` or dot subscript expression, but not a call — at
// least, not without wrapping it in parentheses. Thus, it uses the

function parseNew() {
	var node = startNode();
	next();
	var start = storeCurrentPos();
	node.callee = parseSubscripts(parseExprAtom(), start, true);
	if (eat(_parenL)) node.arguments = parseExprList(_parenR, false);
	else node.arguments = empty;
	return finishNode(node, "NewExpression")}

// Parse template expression.

function parseTemplateElement() {
	var elem = startNode();
	elem.value = {
		raw: φ.input.slice(φ.tokStart, φ.tokEnd),
		cooked: φ.tokVal
	};
	next();
	elem.tail = φ.tokType === _backQuote;
	return finishNode(elem, "TemplateElement");
}

function parseTemplate() {
	var node = startNode();
	next();
	node.expressions = [];
	var curElt = parseTemplateElement();
	node.quasis = [curElt];
	while (!curElt.tail) {
		expect(_dollarBraceL);
		node.expressions.push(parseExpression());
		expect(_braceR);
		node.quasis.push(curElt = parseTemplateElement());
	}
	next();
	return finishNode(node, "TemplateLiteral");
}

// Parse an object literal or binding pattern.

function parseObj(isPattern, refShorthandDefaultPos) {
	var node = startNode(), first = true, propHash = {};
	node.properties = [];
	next();
	while (!eat(_braceR)) {
		if (!first) {
			expect(_comma);
			if (eat(_braceR)) break;
		} else first = false;

		var prop = startNode(), isGenerator, start;
		if (φ.ecmaVersion >= 6) {
			prop.method = false;
			prop.shorthand = false;
			if (isPattern || refShorthandDefaultPos) {
				start = storeCurrentPos();
			}
			if (!isPattern) {
				isGenerator = eat(_star);
			}
		}
		parsePropertyName(prop);
		if (eat(_colon)) {
			prop.value = isPattern ? parseMaybeDefault() : parseMaybeAssign(false, refShorthandDefaultPos);
			prop.kind = "init";
		} else if (φ.ecmaVersion >= 6 && φ.tokType === _parenL) {
			if (isPattern) unexpected();
			prop.kind = "init";
			prop.method = true;
			prop.value = parseMethod(isGenerator);
		} else if (φ.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" &&
							 (prop.key.name === "get" || prop.key.name === "set") &&
							 (φ.tokType != _comma && φ.tokType != _braceR)) {
			if (isGenerator || isPattern) unexpected();
			prop.kind = prop.key.name;
			parsePropertyName(prop);
			prop.value = parseMethod(false);
		} else if (φ.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
			prop.kind = "init";
			if (isPattern) {
				prop.value = parseMaybeDefault(start, prop.key);
			} else if (φ.tokType === _eq && refShorthandDefaultPos) {
				if (!refShorthandDefaultPos.start)
					refShorthandDefaultPos.start = φ.tokStart;
				prop.value = parseMaybeDefault(start, prop.key);
			} else {
				prop.value = prop.key;
			}
			prop.shorthand = true;
		} else unexpected();

		checkPropClash(prop, propHash);
		node.properties.push(finishNode(prop, "Property"));
	}
	return finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression");
}

function parsePropertyName(prop) {
	if (φ.ecmaVersion >= 6) {
		if (eat(_bracketL)) {
			prop.computed = true;
			prop.key = parseExpression();
			expect(_bracketR);
			return;
		} else {
			prop.computed = false;
		}
	}
	prop.key = (φ.tokType === _num || φ.tokType === _string) ? parseExprAtom() : parseIdent(true);
}

// Initialize empty function node.

function initFunction(node) {
	node.id = null;
	if (φ.ecmaVersion >= 6) {
		node.generator = false;
		node.expression = false;
	}
}

// Parse a function declaration or literal (depending on the
// `isStatement` parameter).

function parseFunction(node, isStatement, allowExpressionBody) {
	initFunction(node);
	if (φ.ecmaVersion >= 6) {
		node.generator = eat(_star);
	}
	if (isStatement || φ.tokType === _name) {
		node.id = parseIdent();
	}
	expect(_parenL);
	node.params = parseBindingList(_parenR, false);
	parseFunctionBody(node, allowExpressionBody);
	return finishNode(node, isStatement ? "FunctionDeclaration" : "FunctionExpression");
}

// Parse object or class method.

function parseMethod(isGenerator) {
	var node = startNode();
	initFunction(node);
	expect(_parenL);
	node.params = parseBindingList(_parenR, false);
	var allowExpressionBody;
	if (φ.ecmaVersion >= 6) {
		node.generator = isGenerator;
		allowExpressionBody = true;
	} else {
		allowExpressionBody = false;
	}
	parseFunctionBody(node, allowExpressionBody);
	return finishNode(node, "FunctionExpression");
}

// Parse arrow function expression with given parameters.

function parseArrowExpression(node, params) {
	initFunction(node);
	node.params = toAssignableList(params, true);
	parseFunctionBody(node, true);
	return finishNode(node, "ArrowFunctionExpression");
}

// Parse function body and check parameters.

function parseFunctionBody(node, allowExpression) {
	var isExpression = allowExpression && φ.tokType !== _braceL;

	if (isExpression) {
		node.body = parseMaybeAssign();
		node.expression = true;
	} else {
		// Start a new scope with regard to labels and the `inFunction`
		// flag (restore them to their old value afterwards).
		var oldInFunc = φ.inFunction, oldInGen = φ.inGenerator, oldLabels = φ.labels;
		φ.inFunction = true; φ.inGenerator = node.generator; φ.labels = [];
		node.body = parseBlock(true);
		node.expression = false;
		φ.inFunction = oldInFunc; φ.inGenerator = oldInGen; φ.labels = oldLabels;
	}

	// If this is a strict mode function, verify that argument names
	// are not repeated, and it does not try to bind the words `eval`
	// or `arguments`.
	if (φ.strict || !isExpression && node.body.body.length && isUseStrict(node.body.body[0])) {
		var nameHash = {};
		if (node.id)
			checkFunctionParam(node.id, {});
		for (var i = 0; i < node.params.length; i++)
			checkFunctionParam(node.params[i], nameHash);
	}
}

// Parse a class declaration or literal (depending on the
// `isStatement` parameter).

function parseClass(node, isStatement) {
	next();
	node.id = φ.tokType === _name ? parseIdent() : isStatement ? unexpected() : null;
	node.superClass = eat(_extends) ? parseExprSubscripts() : null;
	var classBody = startNode();
	classBody.body = [];
	expect(_braceL);
	while (!eat(_braceR)) {
		if (eat(_semi)) continue;
		var method = startNode();
		var isGenerator = eat(_star);
		parsePropertyName(method);
		if (φ.tokType !== _parenL && !method.computed && method.key.type === "Identifier" &&
				method.key.name === "static") {
			if (isGenerator) unexpected();
			method['static'] = true;
			isGenerator = eat(_star);
			parsePropertyName(method);
		} else {
			method['static'] = false;
		}
		if (φ.tokType !== _parenL && !method.computed && method.key.type === "Identifier" &&
				(method.key.name === "get" || method.key.name === "set")) {
			if (isGenerator) unexpected();
			method.kind = method.key.name;
			parsePropertyName(method);
		} else {
			method.kind = "";
		}
		method.value = parseMethod(isGenerator);
		classBody.body.push(finishNode(method, "MethodDefinition"));
	}
	node.body = finishNode(classBody, "ClassBody");
	return finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
}

// Parses a comma-separated list of expressions, and returns them as
// an array. `close` is the token type that ends the list, and
// `allowEmpty` can be turned on to allow subsequent commas with
// nothing in between them to be parsed as `null` (which is needed
// for array literals).

function parseExprList(close, allowTrailingComma, allowEmpty, refShorthandDefaultPos) {
	var elts = [], first = true;
	while (!eat(close)) {
		if (!first) {
			expect(_comma);
			if (allowTrailingComma && eat(close)) break;
		} else first = false;

		if (allowEmpty && φ.tokType === _comma) {
			elts.push(null);
		} else {
			if (φ.tokType === _ellipsis)
				elts.push(parseSpread(refShorthandDefaultPos));
			else
				elts.push(parseMaybeAssign(false, refShorthandDefaultPos));
		}
	}
	return elts;
}

// Parse the next token as an identifier. If `liberal` is true (used
// when parsing properties), it will also convert keywords into
// identifiers.

function parseIdent(liberal) {
	var node = startNode();
	// if (liberal && φ.options.forbidReserved == "everywhere") liberal = false;
	if (φ.tokType === _name) {
		if (!liberal &&
				(/*φ.options.forbidReserved && isReservedWord5(φ.tokVal) ||*/ φ.strict && isStrictReservedWord(φ.tokVal)) &&
				φ.input.slice(φ.tokStart, φ.tokEnd).indexOf("\\") == -1)
			raise(φ.tokStart, "The keyword '" + φ.tokVal + "' is reserved");
		node.name = φ.tokVal;
	} else if (liberal && φ.tokType.keyword) {
		node.name = φ.tokType.keyword;
	} else {
		unexpected();
	}
	next();
	return finishNode(node, "Identifier");
}

// Parses module export declaration.

function parseExport(node) {
	next();
	// export var|const|let|function|class ...;
	if (φ.tokType === _var || φ.tokType === _const || φ.tokType === _let || φ.tokType === _function || φ.tokType === _class) {
		node.declaration = parseStatement(true);
		node['default'] = false;
		node.specifiers = null;
		node.source = null;
	} else
	// export default ...;
	if (eat(_default)) {
		var expr = parseMaybeAssign();
		if (expr.id) {
			switch (expr.type) {
				case "FunctionExpression": expr.type = "FunctionDeclaration"; break;
				case "ClassExpression": expr.type = "ClassDeclaration"; break;
			}
		}
		node.declaration = expr;
		node['default'] = true;
		node.specifiers = null;
		node.source = null;
		semicolon();
	} else {
		// export * from '...';
		// export { x, y as z } [from '...'];
		var isBatch = φ.tokType === _star;
		node.declaration = null;
		node['default'] = false;
		node.specifiers = parseExportSpecifiers();
		if (eatContextual("from")) {
			node.source = φ.tokType === _string ? parseExprAtom() : unexpected();
		} else {
			if (isBatch) unexpected();
			node.source = null;
		}
		semicolon();
	}
	return finishNode(node, "ExportDeclaration");
}

// Parses a comma-separated list of module exports.

function parseExportSpecifiers() {
	var nodes = [], first = true;
	if (φ.tokType === _star) {
		// export * from '...'
		var node = startNode();
		next();
		nodes.push(finishNode(node, "ExportBatchSpecifier"));
	} else {
		// export { x, y as z } [from '...']
		expect(_braceL);
		while (!eat(_braceR)) {
			if (!first) {
				expect(_comma);
				if (eat(_braceR)) break;
			} else first = false;

			var node = startNode();
			node.id = parseIdent(φ.tokType === _default);
			node.name = eatContextual("as") ? parseIdent(true) : null;
			nodes.push(finishNode(node, "ExportSpecifier"));
		}
	}
	return nodes;
}

// Parses import declaration.

function parseImport(node) {
	next();
	// import '...';
	if (φ.tokType === _string) {
		node.specifiers = [];
		node.source = parseExprAtom();
		node.kind = "";
	} else {
		node.specifiers = parseImportSpecifiers();
		expectContextual("from");
		node.source = φ.tokType === _string ? parseExprAtom() : unexpected();
	}
	semicolon();
	return finishNode(node, "ImportDeclaration");
}

// Parses a comma-separated list of module imports.

function parseImportSpecifiers() {
	var nodes = [], first = true;
	if (φ.tokType === _name) {
		// import defaultObj, { x, y as z } from '...'
		var node = startNode();
		node.id = parseIdent();
		checkLVal(node.id, true);
		node.name = null;
		node['default'] = true;
		nodes.push(finishNode(node, "ImportSpecifier"));
		if (!eat(_comma)) return nodes;
	}
	if (φ.tokType === _star) {
		var node = startNode();
		next();
		expectContextual("as");
		node.name = parseIdent();
		checkLVal(node.name, true);
		nodes.push(finishNode(node, "ImportBatchSpecifier"));
		return nodes;
	}
	expect(_braceL);
	while (!eat(_braceR)) {
		if (!first) {
			expect(_comma);
			if (eat(_braceR)) break;
		} else first = false;

		var node = startNode();
		node.id = parseIdent(true);
		node.name = eatContextual("as") ? parseIdent() : null;
		checkLVal(node.name || node.id, true);
		node['default'] = false;
		nodes.push(finishNode(node, "ImportSpecifier"));
	}
	return nodes;
}

// Parses yield expression inside generator.

function parseYield() {
	var node = startNode();
	next();
	if (eat(_semi) || canInsertSemicolon()) {
		node.delegate = false;
		node.argument = null;
	} else {
		node.delegate = eat(_star);
		node.argument = parseMaybeAssign();
	}
	return finishNode(node, "YieldExpression");
}

// Parses array and generator comprehensions.

function parseComprehension(node, isGenerator) {
	node.blocks = [];
	while (φ.tokType === _for) {
		var block = startNode();
		next();
		expect(_parenL);
		block.left = parseBindingAtom();
		checkLVal(block.left, true);
		expectContextual("of");
		block.right = parseExpression();
		expect(_parenR);
		node.blocks.push(finishNode(block, "ComprehensionBlock"));
	}
	node.filter = eat(_if) ? parseParenExpression() : null;
	node.body = parseExpression();
	expect(isGenerator ? _parenR : _bracketR);
	node.generator = isGenerator;
	return finishNode(node, "ComprehensionExpression");
}

})()
