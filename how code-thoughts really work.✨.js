with a _good_ programmer, the code-thoughts are in a fuzzy sloppy half-wrong frame that`s pretty alien to the existing field

how does this tie in with ✨?
-> ✨ is our latest thoughts in programming language design, and has some experimental notes on "language parsing for eighty-twentiers"

how does this tie in with prentice?
-> prentice is an attempt at understanding and reacting to fully generalized fuzzy sloppy half-wrong things people say. (it didn`t work.)

what _is_ that frame?



i think it might be good to try writing the code-thoughts of some program i haven`t written already
i think it might be good to try writing the code-thoughts of weirder and differenter programs

⟨ i tried these, but it felt TOO BIG and then i didn`t know what to try ⟩

------------------------------------ fb-sdk ------------------------------------

node program. shebang.

library FB.api uses node-callback. and after a call, null, .error, .data.error -> error

on error, also: print 'ERROR' without a newline. CLI return 1.

read auth from ./arc/fb_auth.json or error

CLI commands are
	
	verify <token> <user_id>
		call library FB.api('/debug_token', {access_token: auth.id+'|'+auth.secret, input_token: argv.token})
		error if false: .data match {is_valid: true, app_id: auth.id, user_id: argv.user_id}

	get-name <token>
		call library FB.api('/me', {access_token: argv.token})
		print .name without a newline

-------------------------------- perfect-history -------------------------------

node program. shebang.

CLI is just
	<root>

// call library chokidar.watch(root, {persistent:true, ignoreInitial:true}).on('all', cb)
// 	with cb(event,file) filtered by (/add|change|unlink/, ¬/.*\/\.history\/.*/)
call library chokidar.watch(root, {persistent:true, ignoreInitial:true})
	subscribe to 'all'. filter by (event: /add|change|unlink/, file: !/.*\/\.history\/.*/). map by
		within root:
		print (event, current time, file) tabularly
		(if event = 'unlink', copy file to, else touch) '.history/'+current_time+' '+(event = 'unlink'? '-' : '+')+' '+file.replace(/\//g,'::')


------------------------------- sublime-transform ------------------------------

node program. shebang.

CLI commands are

	from <in>
		call library plist.parse on the contents of argv.in.
		pretty-print this and write to argv.in+'.json'.

	to <in> <out>
		optimize file operations and relax in-order-ness.
		for children in argv.in, replace argv.in with argv.out and rmrf, except any contents containing 'Package Control.'
		for files in argv.in, replace argv.in with argv.out and [write to self, unless]
			match /\.json$/ -> write plist.build(@file) to file without extension
			match /\.snippet-magic$/ -> call λ on file, write all results to '.sublime-snippet' files with arbitrary names
			// match /\.snippet-magic$/ -> λ(file) * write to file with extension changed to (index+'.sublime-snippet')
				with λ = split on '\n\n', * '<snippet><content><![CDATA['+(all lines after first)+'\n]]></content><tabTrigger>'+(first line sans newline)+'</tabTrigger></snippet>'

------- auxiliary: how to pretty print json ------

// this is my first attempt at stringifying json nicely.
// i do not think it will be my last.
let json.show = λ(v){
	let wrap_width = 150
	let TAB = '  '
	let indent = .replace(/\n/g,'\n'+TAB)

	if v is in the callstack of this recursive function:
		throw TypeError('Converting circular structure to JSON')

	case type of v:
		'null', 'undefined', 'function' -> 'null'
		'boolean', 'number' -> v+''
		'string' -> JSON.stringify(v)
		else,
			if v is an array, ensure all indexes of v have elements
			let ts =
				v is an array -> v * json.show * indent
				v is an object -> (k,v in pairs(v) if v!==undefined && typeof(v)!=='function') * indent(json.show(k)+': '+json.show(v))
			let a,b = v is an array? '[]' : '{}'
			a+ts.join(', ')+b, unless its .length > wrap_width, then a+'\n'+TAB+ts.join(',\n'+TAB)+'\n'+b
	}

------------------------------------- sure -------------------------------------

// "sure" is a 183-line toy I made in late 2013. This is a sequel, not a direct translation. I expect writing this in the style of the original would take rather more than 183 lines.

let`s define a 2d grid-world with a physics of sequential ticks
it`s got a rectangular grid of cells with adjacency north/east/west/south that are slots for agents, and connect each of those to a cell that`s a well of "soul points"

soul wells regenerate at a fixed rate - say, 0.01/tick. and they fill up at 100 soul points.

an agent, if one is present, may choose an action to attempt for each tick
	send X soul or fire to adjacent cell
	send X soul from well to self
	send new agent with X soul and code φ to adjacent non-well cell
it`s told the contents of it`s cell and all adjacent cells, and for empty adjacent cells it`s told the contents of their wells

an agent _is_ a container of soul and a piece of code that is executed to attempt the actions
	if it chooses an action it doesn`t have enough soul to do, it spends all of its soul and does as much of the action as possible

all actions happen simultaneously: first, they move to their destination, then each destination cell resolves its actions 

fire is negative soul.
soul and soul the same cell immediately combine. if the soul is not directed towards a particular agent, it combines with all agents in the cell in proportion to their existing amounts of soul

any agent with zero soul immediately dies

fire in an empty cell sends itself for free to the cell`s well

agents in the same cell fight. they`re told about the other agents in the fight and given an opportunity to send fire to each of them.
	if nobody sends fire, the agent with the most soul wins and gets the soul of everyone else
	otherwise, all agents that send no fire proportionally send all of their soul to the cell
	this iterates until there are no longer multiple agents in the same cell

sending X fire costs ⌈ X*1.1 ⌉ soul, + 0.05 iff it`s not within a cell
sending X soul costs X soul, + 0.05 iff it`s not within a cell
send new agent with X soul and code φ costs X + 0.1 soul
sending X soul from well to self costs 0.1 soul

a well at its cap will spend all its soul on the action of sending an agent with random code φ to it`s cell

the piece of code is just a javascript function, taking the local region of the grid as input and outputting an action object

can i have a grid and controls for running the ticks? as a static javascript app, in a browser tab. i want the grid to be the biggest size that fits in the given window with the given display method.
and can you display the grid squares as 24×24px squares
when empty, a solid square of its well`s soul-color
when full, the empty version plus a centered 18×18 square of the agent`s soul-color, plus a pair of ascii chars to represent the agent`s code
and when i mouseover a grid square i want it to display all of the contents in a sort of tooltip
