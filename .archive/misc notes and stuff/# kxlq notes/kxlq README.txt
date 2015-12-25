[extra notes written during the eating of 2014-09-11]

the purpose of kxlq [or α, or etc] is to make coding not suck, not be frustrating
this may not be possible
but whatever

core unsolved features:
	non-frustrating ways to express cross-cutting concerns
		example: the "expression problem" (clojure solves it with multimethods)
		mixins/traits
	solid collections, good collection operators, incl advanced subscripting, strings and streams are collections
		nested collections are a thing, and "solid collections" applies to them too
			java-style multi-dim arrays are a part of that thing

crucial-but-solved features:
	proper closures
	namespace/package mechanism
	list and map literals
	generators
	varargs

features implied by the core features:
	(solved) param defaults
	(solved) steve yegge says: list comprehensions (? incl haskelloid .. ranges)
	(solved) destructuring
	(solved) keyword params
✓	(unsolved) standard OOP: classes, instances, interfaces, polymorphism, etc

additional valuable features:
✓	(solved) integrated, perl5-compatible regexes (or is it perl6 or what?)
✓	(solved) cross-platform GUI (html & friends)
✓	(unsolved) normalcy: look extremely normal and/or have idiomatic-translators
✓		see javascript, which did normal-looks with extreme success
✓	(unsolved) static typing, and not just that simplistic java crap . but not that complicated scala crap, either
✓	(unsolved) duck typing
✓	(unsolved) strong multi-threading support . clojure does this with traditional tools of immutability and transactions
✓	(unsolved) continuations & call/cc: oh god, these are beautiful . but they can make interoperability a lot harder, i think
✓		see http://zope.stackless.com/spcpaper.htm