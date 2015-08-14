// in a good programmer, code-thoughts are in a fuzzy sloppy half-wrong frame that`s pretty alien to the existing field
// what is that frame?
// well, what code-thoughts would we have if our computer understood them? and what programs would we write?
// ... i don`t know. that`s a really hard question.
// i think there would be absolute technical grace "sometimes things are sufficiently modular and well-written that modifying the behavior *really is* just a matter of changing a couple lines of code"
// http://baconjs.github.io/api.html might be really useful for the implementation of this
// http://worrydream.com/KillMath/ http://worrydream.com/LadderOfAbstraction/ is relevant to the implementation of this
// > i`m refactoring acorn.js. and - i - i want to just _pick up_ the damn graph and _splay it out all over the walls and floor and ceiling and_ MOVE the components DIRECTLY instead of this utter "text editor" bullshit

if we have a model of code-thoughts that allows for expressing

// all of the below
more attempts at generation of beautiful things, like terrain or cities
IAFF
cryptopals
something like "constraint programming", incl genex(/-?\d/)
custom fuzzing http://danluu.com/everything-is-broken/
6.824
real-time text?
> Generate an equation randomly with a large number of variables, and random operators between them. The player gets to select values for each of the variables, and then see the result. Player attempts to maximize score given a time allotment. I think it could teach people a huge amount about exploration/exploitation, complex systems, inference, etc.

then i think we have a good model.

... what about logging? we`ve never interacted with logging, but it might be important.

http://fb.com/strohl89/posts/10153433406284598 ?


// ------------------- thing generation #fail #unfinished ------------------- //
	// so i tried generating some cities. but i failed. i will try again later!

	i wanna generate some cities

	so let`s declare a voxel landscape
	for z=0, |x,y| ≤ 512: bedrock
	for 0<z≤32, |x,y| ≤ 512: dirt
	(voxels at z<0 are immediately removed)

	and let`s drop 20000 trees on that
	where a tree is a 1×1×3 wood object
	(don`t drop trees on top of trees.)
	every 1day, trees should grow 1 block taller if there is null above them

	and let`s drop 1 meeple on that
	meeple can (1s) move to adjacent voxels if their destination is null (and meeple are always sticky)
	meeple can (1s) turn the topmost voxel of a tree into a voxel of wood if they are adjacent to it
	meeple can (1s) bring 1 wood voxel they`re sticking to with them if the destinations of both of them are null
	meeple can (1s) make a wood voxel they`re adjacent to and a wood voxel it`s adjacent to sticky with each other

	meeple really like spending time in the middle of cubes (especially big ones), and meeple like interacting with wood. but meeple don`t like doing one thing for too long.
	the center of a cube is a real-valued point such that the diagonal distance to the nearest non-null voxel in all directions is constant
		all voxels can be scored by how much they are like the center of a cube.

	unsupported voxels fall down. a voxel is supported if it is bedrock or above a supported voxel or sticky with a supported voxel.

	distance,type of nearest voxel in the six cardinal directions
	cube score

	> Hmm...you might want to look at planning algorithms like a*
	> Maybe you want to have high level actions like "move this cube here"
	> And you can use planning to assign costs to actions
	⋈ but i don`t wanna hardcode them
	> Hmm.  Perhaps you want to use reinforcement learning?
	> You learn a policy mapping features about current situation to action
	> You would have to select features strategically
	> Q learning is the basic reinforcement learning algorithm, but it won`t work here because too many configurations
	> I think there`s a variant with features but I have not found it
	> Perhaps you could look at what deepmind is doing
	> It`s like neural net reinforcement learning
	⋈ what if i do the eurisko thing and make a really good space of algorithms that could be useful to run here and then do simple genetic programming on that?
	⋈ but uh, i do not know how to do that

// ---------------------------- IAFF #unfinished ---------------------------- //

	// so there`s the boring way where we slowly nom this file and make it smaller and prettier
	// and then eventually there`s no more easy nomming and we can do other stuff

	// but ...
	// i don`t think this is a very healthy approach
	// really, i`d like us to take the *website* and try to build a clone, like we did with timer-tab.com

	// http://agentfoundations.org/
	// http://blog.codinghorror.com/the-god-login/

	i want a webapp
	serving static cacheable pages, plus a login mechanism and some simple controls for logged-in users

	a normal page has a frame w/ a
		topbar______________________
		content              sidebar

	the topbar is
		namelogo tablinks      login

	body { bg: #eaeaea; }
	frame { width: 85%; centered; bg: #fff; non-top border: 1px solid #d2d2d2; }
	topbar { bg: #254e7d; }

// --------------------------------- tagtime -------------------------------- //

	"special_dependencies": {"atom_shell": "0.19.1"},

	people who don`t use tagtime all the time want a "only run during certain hours" mode

	handle being pinged while you`re typing

	i think it should be super explicit like "your computer seems to be bogged down". usually that will have been painfully obvious to you which is actually reassuring for tagtime to notice and warn you and tell you exactly why. and if it ever happens for no apparent reason then it would probably be good to get a bug report about that - how about "This ping is $x seconds late! If this doesn`t seem like your computer`s fault you can _submit a bug report_ [link]."

	ooh, we maybe need to handle dropbox-style logfile syncing? that means killing ping windows if the log file updates with those pings - that is, always pinging just those pings which the log file is missing.

	verify we`ve got a valid auth token for the user we`re trying to interact with (this especially handles the case in which the username is mistyped)

	‽ implement "In the future this should show a cool pie chart that lets you click on the appropriate pie slice, making that slice grow slightly. And the slice boundaries could be fuzzy to indicate the confidence intervals! Ooh, and you can drag the slices around to change the order so similar things are next to each other and it remembers that order for next time! That`s gonna rock."
		so, when i took five minutes to consider "what would be a *good* interface for tagging?", i thought of "what about a field of 2-dimensional tag-cells, with size proportional to frequency, that can be persistently dragged around?"
		* Figure out the confidence intervals based on the samples (pie slices could have fuzzy boundaries to indicate confidence intervals).
		* Thoughts on visualization: http://stackoverflow.com/questions/3224494/data-visualization-bubble-charts-venn

	maybe prepare the gui beforehand so that we can make it come up on exactly the right instant?

	people want this: annoying person https://mail.google.com/mail/u/0/#all/1475525cc89fff4f happy malo https://mail.google.com/mail/u/0/#all/1486610d171b5c4b sms would make money https://mail.google.com/mail/u/0/#all/14b1dcb399f77201 query about commissioning a TagTime iOS app https://mail.google.com/mail/u/0/#all/149c0690dc6ce24c misc https://www.facebook.com/mqrius/posts/10152823173381168

	add an interface to export an existing graph as a pingfile and/or to your existing pingfile

	expand the datapoint comment so the (subset which is being tracked of) the pingfile can be fully recovered from the beeminder graphs

	* We can of course reimplement rescuetime. We can also poll for other kinds of data, like specific-computer, is-network-connected, wifi-SSID, external devices interacting, microphone loud-quiet, camera bright-dark, typing, gps, computer sleeping and waking up

	window 'prompt' should mirror actual ping_file, even if it changes from outside this program

	show one ping higher than needed to show that you can scroll up and to show the ditto text

	the interesting platforms are: web windows linux osx android ios watch

	tagtime should beep, like
	beep ← λ(){/*if (shown) */new Audio((@rc).ping_sound as file .realpath()).play()}

	handle:
	open_window('prompt').show_mock([{time:time-2000, period:45, tags:last_tags}, {time:time, period:45}])

	// ------------------------ //

	require app

	--- run.sh script ---

	bash cli. shebang. cd dir of self.

	TAGTIME_V=$(jq .version package.json -r)
	ATOMSH_V=$(jq .special_dependencies.atom_shell package.json -r)
	ATOMSH_ROOT="https://github.com/atom/atom-shell/releases/download/v$ATOMSH_V"

	install() {
		expect x ← type "$x" &>/dev/null || echo "expected $x to be on path"
		expect npm
		expect jq
		expect github-release
		expect xz
		expect ditto
		if any printed, ↩

		[ -d node_modules ] || npm install

		in bin:
			t="atom-shell-v$ATOMSH_V-darwin-x64.zip"; [ -f "$t" ] || { curl -LO "$ATOMSH_ROOT/$t"; rm Atom.app; }
			[ -d Atom.app ] || { unarchive 'Atom.app/*' ∈ "$t"; }
			t="atom-shell-v$ATOMSH_V-linux-x64.zip";  [ -f "$t" ] || { curl -LO "$ATOMSH_ROOT/$t"; }
			t="atom-shell-v$ATOMSH_V-win32-ia32.zip"; [ -f "$t" ] || { curl -LO "$ATOMSH_ROOT/$t"; }
		}
	build() { install || ↩ 1; rm bin/app; cp package.json resources node_modules *.html -> bin/app; ζ₂ -c *.ζ₂ bin/app; }
	build_release() { rm node_modules; build || ↩ 1
		unarchive 'Atom.app/*' ∈ "bin/atom-shell-v$ATOMSH_V-darwin-x64.zip" as TagTime.app
		cp resources/tagtime.icns TagTime.app/Contents/Resources/atom.icns
		cp -r bin/app TagTime.app/Contents/Resources/
		archive TagTime.app bin/TagTime-osx.zip; rm TagTime.app

		unarchive "bin/atom-shell-v$ATOMSH_V-linux-x64.zip" -d TagTime
		mv TagTime/atom TagTime/tagtime
		cp -r bin/app TagTime/resources/
		archive TagTime bin/TagTime-linux.tar.xz; rm TagTime

		unarchive "bin/atom-shell-v$ATOMSH_V-win32-ia32.zip" -d TagTime
		mv TagTime/atom.exe TagTime/tagtime.exe
		cp -r bin/app TagTime/resources/
		archive TagTime bin/TagTime-windows.zip; rm TagTime
		}
	publish() { build_release || ↩ 1
		github-release release -u alice0meta -r TagTime -t "v$TAGTIME_V" -d "ℕ"
		echo "uploading..."; github-release upload -u alice0meta -r TagTime -t "v$TAGTIME_V" -n TagTime-osx.zip -f bin/TagTime-osx.zip
		echo "uploading..."; github-release upload -u alice0meta -r TagTime -t "v$TAGTIME_V" -n TagTime-linux.tar.xz -f bin/TagTime-linux.tar.xz
		echo "uploading..."; github-release upload -u alice0meta -r TagTime -t "v$TAGTIME_V" -n TagTime-windows.zip -f bin/TagTime-windows.zip
		}

	run() { bin/Atom.app/Contents/MacOS/Atom bin/app "$@"; }

	CLI commands are
	dev_install -> install
	build -> build_release
	publish -> publish
	[...] -> build && run $...

	# standard commands:
	# start -> if running, echo "already started", else start
	# stop -> if running, stop, else echo "not running"
	# status -> echo "tagtime is" $(if running, running, else, not running)

	--- main module ---

	require ping_file, ping_seq, sync from aux

	@rc || @rc ← {period:45, ping_sound:'loud-ding.wav', auth:{}}

	show app in dock iff there are >0 windows open. use icon = resources/tagtime.png.
	show a tray menu. icon: resources/tray.png, tooltip: 'TagTime', menu:
		'Preferences' -> open_window('preferences')
		'Edit Pings' -> open_window('prompt')
		⎋|⌘w|⌘q 'Quit' -> app.quit()

	let open_window x ← run file x as an html window

	CLI commands are
		start
			log 'BEGIN','last ping was', t ← (ping_seq -! <=now) max .time, '(', now - t, 'ago )'
			log 'SORRY','update checks not implemented!'
			for(;;):
				let next ← (ping_seq -! >(ping_file[-1].time || now)) min
				at next.time:
				log 'PING','for',next.time
				ping_file ~= [next]
				open_window('prompt')
		prompt <time>? <last_tags>?
			open_window('prompt').show_mock([{time:time-2000, period:45, tags:last_tags}, {time:time, period:45}])
		repl -> start a repl
		pref -> open_window('preferences')
		sync -> sync() and don`t gui

	--- window prompt.js ---
	// this is too complicated. i think i need an implementation to discover how i would really write this.
	// let's do a timer-tab.com treatment of this

	$ ← require jquery
	require rc, sync, ping_file from aux

	⋈⋈ oh, um, we should call sync after closing the window

	dirty.setWindowOptions({
		title:'tagtime prompt',
		'always-on-top':true,
		'auto-hide-menu-bar':true, 'skip-taskbar':true,
		frame:false,
		unique:true,
		})

	let pings = @ping_file
	somehow we must watch ping_file for changes, as hard as this problem is
	including changes from main.js of this program
	but not including our own changes

	i want an html app, single page no scroll

	body:
		"It's tag times! What were you doing RIGHT AT these times?"
		<ol id="tag_editor">
			i want to display a view of a slice of @ping_file
			i want the slice to start at the first ping with .tags==null and go until the end or max length
				if there are no pings with .tags==null, start at -1
			the max slice length should be as much as will comfortably fit on the screen
			each displayed ping is
				$('<li>').html([$('<span class="time">').html(moment(.time).format('HH:mm:ss')),$('<div class="tags_in_li">').html($('<input class="tg">').make_equal_to({it:},'.tags', 'text'))])
		[done]

	mark the first ping-display as '.focused'
		now and if '.focused' is moved, “return focus” by $('.focused input.tg, button.focused').focus()

	all ping-displays and #done are focusable

	keybindings
		↩|⇥|↓ [dynamic] input.tg, ⇥|↓ #done -> move '.focused' to next focusable element; ↩ false
		// ↑ [dynamic] input.tg, #done -> $('.focused input.tg').is($('input.tg').first())? ping_unshift_if(c_up) : c_up(); ↩ false
		↑ [dynamic] input.tg, #done -> move '.focused' to previous focusable element; ↩ false
		☝ #done -> dirty.close_window()
		'' [dynamic] input.tg -> .preventDefault()
			if t←recent_tags(@): $(@).val(tags_union($(@).val(), t)).trigger('input')
			move '.focused' to next focusable element
		☝ window -> return_focus()
		☝ [dynamic] li -> .stopPropagation(); move '.focused' to @
		mouseenter window -> dirty.show()

	dirty.size_and_center()

	however! if there is only one ping to display, instead simplify the interface:
		use it = pings[-1]
		"It's tag time! What are you doing RIGHT NOW $.time ?"
			if abs(now-.time)>25s: s/are/<em>are<\/em>/; s/NOW/AT/
			if .time<now-0.5s: s/are/were/
		if recent_tags(it): '<span class="key">\'</span> to repeat previous tags: <span class="tg">'+recent_tags(it)+'</span>'
		$('<div id="tag_editor">').html($('<input class="tg">').make_equal_to({it:},'.tags', 'text'))

	and use these keybindings:
		↩ input.tg -> $('input.tg').val() ≠ ''? dirty.close_window(); ↩ false
		⇥|☝ input.tg -> ↩ false
		// ↑ input.tg -> ping_unshift_if(); ↩ false
		'' input.tg -> <same>
		☝ window -> $('input.tg').focus()
	
	and call:	
		$('input.tg').focus()

	where
	recent_tags ping ← pings[:(index of ping in pings)][::-1].dropWhile(.tags == null)[0]?.tags
	tags_union &rest ← rest * .trim().split(/[ \t]+/) $ union .join(' ')

	dirty.html.css(css'
		// behavior
		body {margin:8px; white-space:nowrap;}
		body {-webkit-app-region:drag;} input, button {-webkit-app-region:no-drag;}
		#body {display:inline-block;}

		// general style
		* {outline:none;}
		p {margin:0;}
		button, input {color:inherit; font:inherit; background-color:inherit;}
		input {margin:0; padding:0; border:none;}

		// specific style
		body {background-color:#222; color:#fff; font-family:Monaco,monospace; font-size:12px;}
		button {background-color:#333; border:1px solid #666; cursor:pointer; padding:2px 4px;}
		#tag_editor {margin:5px;} ol#tag_editor {padding:0; list-style:none;}
		.tg {color:#ffd700;} input.tg {width:100%;}
		.tags_in_li {width:85%; display:inline-block; vertical-align:bottom; margin:0 0 0 1ch;}
		.key {background-color:#333; border:1px solid #666; padding:0 0.5ch 0 0.4ch; border-radius:0.5ch;}
		.focused {background-color:#444;} li.focused {margin:0 -13px; padding:0 13px;}
		.time {color:#08f;}
		em {background-color:#800; margin:0 -0.5ch; padding:0 0.5ch; font-style:normal;}
		')

	--- window preferences.js ---

	$ ← require jquery
	require rc from aux

	let external_link url text ←
		// oops, this won't work - the element doesn't exist yet
		id ← url s,/\W//g
		$('#'+id).click(λ(){dirty.openExternal(url); ↩ false})
		↩ '<a id="'+id+'" class="external" href="'+url+'">'+text+'</a>'

	dirty.setWindowOptions({
		title:'tagtime preferences',
		width:400, height:200,
		'always-on-top':true,
		'auto-hide-menu-bar':true, 'skip-taskbar':true,
		unique:true,
		})

	dirty.html.css(css/*
		// font and color style
		body {background-color:#222; color:#fff; font-family:"Helvetica Neue",sans-serif; font-size:14px;}

		// layout style
		.setting {display:flex; margin:1ex 0;}
		.setting > label:first-child {min-width:150px; margin:0 5px 0 0; text-align:right;}
		.setting input + * {display:block; margin:3px 0 0 0;}
		*/)

	dirty.html.body([ // these rows are .setting s. um, i dunno how to do this, gosh
		[$('<button>export pings to clipboard'), $('<button>import pings from clipboard')],
			// clipboard.readText() -> string ... and then eventually: ping_file.events.emit('=')
			// clipboard.writeText(<string>)
			// import should put a backup in your tmp folder?
		[$('<label>ping period in minutes').for(), $('<input>').make_equal_to({rc:},'rc.period', 'number')],
		[$('<label>ping file').for(), $('<input>'), $('<label>put me in Dropbox to sync pings between multiple machines!').for()],
		// [$('<label>ping sound').for(), $('<input>').make_equal_to({rc:},'rc.ping_sound', 'text')],
		[$('<label>beeminder '+external_link('https://www.beeminder.com/api/v1/auth_token.json','auth token')).for(), $('<input>').make_equal_to({rc:},'rc.auth.beeminder', 'text')],
		// '<hr>',
		// '<div>if this tagtime then that beeminder</div>',
		// CHANGEME by adding entries for each beeminder graph you want to auto-update
		// "bob/job": "job", // send "job" pings to bmndr.com/bob/job:
		// "bob/job_success": "job fun", // send "job fun" pings to bmndr.com/bob/job_success (also "fun job" - order is ignored):
		// "bob/work": ["job", "study"], // send "job" pings and "study" pings to bmndr.com/bob/work:
		// "bob/agency": "! akrasia", // send pings that are not "akrasia" pings to bmndr.com/bob/agency:
		// $('<button>sync now')
		])

	- impl -

	$.prototype.make_equal_to o path type ←
		// oops, this won't work - the element doesn't exist yet
		id ← path s/\W/_/g
		@.attr('id',id)
		@.attr('type',type)
		$('#'+id).val(eval('o.'+path))
		$('#'+id).on('input',λ(){t ← $('#'+id).val(); eval('o.'+path+' = t')})
		↩ @
	$.prototype.for ← ⋈⋈ stuff ⋈⋈; ↩ @

	--- aux module ---

	export rc ← file dirty.getDataPath()+'/settings.json'

	export ping_file ← file dirty.getDataPath()+'/pings.log'

	ping_file is an array of {time :: unix time, period :: float, tags :: str}, parsed out of its lines:
		// 2014-03-26/19:51:56-07:00(p22.5)? a b c \(a: comment\)
		read:
			≈/^(\d+)([^\[]+)/ -> {time:it[1], period:(@rc).period, tags:it[2].trim()}
			≈/^(?=....-)([^\sp]+)⟨p(\S+)⟩? (.*)$/ -> {time:it[1], period:it[2] || 45, tags:it[3].trim() unless ='<unanswered>'}
		show: (.time as 'YYYY-MM-DD/HH:mm:ssZ')+('p'+.period unless .period=45)+' '+(.tags || '<unanswered>')

	export ping_seq ←
		let epoch = {seed:666, time:1184083200} // the birth of timepie/tagtime!
		let next_s it = t ← seqs * .time; do ping_next it while ! keep it; while it.time ∈ t: it.time += 1; ↩ it
			where ping_next it = .seed *= 7^5 mod= 2^31-1; .time += max(1,round(-45*60*ln(.seed / 2^31-1))) // see p37 of Simulation by Ross & ran0 from Numerical Recipes
			where keep it = .seed as int31 as bits reverse as int31 / 2^31-1 <= .fraction
		let period = (@rc).period*60
		let time = seqs*.time *min
		let get = {time:←, period:←} .period/= 60
		let next = next_s(seqs *min .time)
		let ensure = cache period. if !seqs || period changed || x < time:
			set seqs ← 0..ceil(n) * (clone(epoch) .seed+= it) * next_s $ [-1].fraction= 1 - ceil(n)-n
				where n = 45*60 / period
		↩
		(this -! <=x) max -> ensure(); do next() until time > x; undo last next(); get // ping_seq.le
		(this -! >x) min  -> ensure(); do next() until time > x; get // ping_seq.gt

	export sync({dry:}) ←
		log 'SYNC'
		run in parallel×10: (@rc).beeminder *
			name, tagdsl ← it
			beeminder GET "/users/"+(name ≈ '/'->'/goals/')+"/datapoints.json".
			↩ generate_actions(name, @ping_file -! tagdsl_read.P(tagdsl)(.tags), datapoints_read(it))
		/ ~ // this comment is spurious
		→ actions
		actions *cat .msgs * log
		if !dry: run in parallel×10: actions * .cmd()

		--- aux ---

		beeminder api:
			no library, just http requests (which uses node-callback)
			root is 'https://www.beeminder.com/api/v1/'
			append {auth_token: (@rc).auth.beeminder} to querystring
			after a call:
				it ← .json
				.error -> throw .error
				.errors.length > 0 -> throw .errors
			cache calls to (GET "/users/[^\/]+/goals/[^\/]+/datapoints.json"). the cache is valid iff (GET "/users/"+(name ≈ '/'->'/goals/')+".json").updated_at is the same as last time.

		datapoints_read it ← it - (.value = 0) *cat λ sort(.time)
			where λ it ←
				if .comment !≈ (/pings?:/): ↩ [{type:'BAD', comment:.comment+' (was '+.value+'; zeroed by tagtime syncing)', time:.timestamp, id:.id, msg:.id}]
				let pings ← .comment s(/.*?pings?://) .trim() s/\[..:..:..\]$// .trim() .split(', ')
				↩ pings * {time:^.timestamp, period:^.value*60/pings.length, tags:it, id:^.id}
		tagdsl_read f tags ←
			tags λ= s/\(.*?\)/ /g .trim() .split(/ +/)
			f isa Array? f.every(∈ tags) : f[0:2]=='! '? f[2:] ∉ tags : f.split(' ').some(∈ tags)

		generate_actions name ours theirs ←
			bad ← (theirs -= .type=='BAD')

			(ours ~ theirs) * (.group_time = round .time to 86400*2/3 mod 86400)
			if t←(theirs -! .group_time ≠ .time) ≠ []: throw 'so confused', t

			in order of .time, match [ours, theirs] up by [.group_time, .tags, .period] (should run in O(n))
			ours -= .matched; ours * (.add = true); theirs - .matched * (.rem = true)

			group_array(ours ~ theirs, [.group_time, .period]) *cat
				!.some(.add || .rem) -> [] // no change
				.every(.add) -> add it // log and ¬bee: CREATE
				.every(.rem) -> rem it // ¬log and bee: DELETE
				else -> (add it-.rem) ~ (rem it-.add) // log and bee: UPDATE?
				where add it ← {
					timestamp: it[0].group_time,
					value: it.length * it[0].period/60,
					comment: it.length+' ping'+(it.length==1?'':'s')+': '+(it * .tags join(', ')),
					}; [{type:'+', msg:.comment, time:.timestamp; data:it}]
				where rem ← * {type:'-', msg:.id, time:.time, id:.id}
			-> group by .type → acts

			msg it ← 'BEE_SYNC',.type,name,(.time utc date),.msg .join(' ')
			↩ acts['+'] = []? [] : [{msgs: acts['+'] * msg, cmd: λ(){ beeminder POST /users/$(name ≈ '/'->'/goals/')/datapoints/create_all.json {datapoints:JSON.stringify(acts['+'] * .data)} }}] ~
				acts['-'] * uniq(.id) * {msgs: [msg it], cmd: λ(){ beeminder DELETE /users/$(name ≈ '/'->'/goals/')/datapoints/$(.id).json }} ~
				bad * {msgs: [msg it], cmd: λ(){ beeminder PUT /users/$(name ≈ '/'->'/goals/')/datapoints/$(.id).json {timestamp:.time, value:0, comment:.comment} }}

	--- ./resources/ ---

	this is a directory with these files:
	https://github.com/alice0meta/TagTime/raw/master/resources/loud-ding.wav
	https://github.com/alice0meta/TagTime/raw/master/resources/tagtime.png
	https://github.com/alice0meta/TagTime/raw/master/resources/tagtime_05.png
	https://github.com/alice0meta/TagTime/raw/master/resources/tray%402x.png
	https://github.com/alice0meta/TagTime/raw/master/resources/whoosh.wav

################################################################################
##################################### ready ####################################
################################################################################

// --------------------------------- fb-sdk --------------------------------- //
	// tiny shim to access the fb sdk from arc

	require npm::fb@^0.7.0

	fb.api uses value-callback. and after a call, null, .error, .data.error -> error

	on error, also: print 'ERROR' sans newline

	read auth from ./arc/fb_auth.json   or error        (note: should be lazy)

	CLI:

		verify <token> <user_id>
			fb.api('/debug_token', {access_token: auth.id+'|'+auth.secret, input_token: token})
			error unless .data match {is_valid: true, app_id: auth.id, user_id:}

		get-name <token>
			fb.api('/me', {access_token: token})
			print .name sans newline

// ----------------------------- perfect-history ---------------------------- //

	CLI: <root>
		within root:
		watch files ∈ (. - ./.history/) *:
			log (event, now, file) tabularly
			(event = "unlink"? touch : copy file to) "./.history/$now $(event = "unlink"? "-" : "+") $(file.encode("fspath"))"

// ------------------------------ sublime/build ----------------------------- //
	// translate sane stuff into weird sublime formats and put it in the sublime places
	// then, delete files in the sublime places that we didn't write to (except for specialized exceptions)

	in ← ./Packages
	out ← ~/Library/Application\ Support/Sublime\ Text\ 3/Packages

	replace $in with $out in all writes/deletions.

	for files ∈ in *:
		≈/\.json$/ -> write (@file as plist) to file without extension
		≈/\.snippet-magic$/ -> λ(file). write to distinct .sublime-snippet files in same dir as file
			where λ = split on '\n\n', * xml <snippet> <content>$(lines[1:])</> <tabTrigger>$(lines[0])</> </>
		else -> write @file to file
	for paths ∈ (in > *): delete unless (we wrote to it earlier  ||  within in and ≈/Package Control\./)

// ---------------------------------- dance --------------------------------- //
	// "sure" is a 183-line toy I made in late 2013. This is a sequel, not a direct translation. I expect writing this in the style of the original would take rather more than 183 lines.

	define: rectangular grid of nodes w/ adjacency north/east/west/south, plus for each of those a node connected below it
		the first nodes each have a slot for an agent
		the second nodes each have a well of “soul” (numeric)

	wells regenerate at 0.01/tick
	a well with soul ≥ 100 will spend all its soul on the action of sending an agent with code well_code_gen() to the node above it

	an agent has a container of soul and a code that is executed to return the chosen action

	each tick, each agent may choose an action to attempt
		send X soul or fire to adjacent node
		send X soul from adjacent node with well to own node
		send new agent with X soul and code φ to adjacent node with an agent-slot
	it`s first given a description of its node and adjacent nodes, plus any adjacent nodes with wells
	if it chooses an action costing more than its soul, nothing happens

	each tick, soul in a node with no agents sends itself at the cost of itself to the node below

	all actions happen simultaneously: first, they move to their destinations, then each node resolves the actions it received

		fire is negative soul.
		soul and soul the same cell immediately combine. if the soul is not directed towards a particular agent, it combines with all agents in the cell in proportion to their existing amounts of soul

		any agent with zero soul is immediately removed

		agents in the same node fight. they`re given a description of the node and may choose to send fire to each agent in the node.
			all¹ agents that send no fire send all of their soul to the node
				[1] if no agent sends fire, all except the agent with the most soul
		this iterates until there are no longer multiple agents in the same node

	sending X fire costs ⌈ X*1.1 ⌉ soul, + 0.05 if it`s to another node
	sending X soul costs X soul, + 0.05 if it`s to another node
	sending a new agent with X soul and code φ costs X + 0.1 soul
	sending X soul from adjacent node to own node costs 0.1 soul

	the code is a javascript function(situation, info).

	let well_code_gen = λ():
		θ ← λ(situation, node):
			if situation ≠ 'tick': ↩ null

			θsoul ← node.agent.soul
			if (t ← node.adjacent * .agent - null - (.code.name == θ.name))≠[] && t*.soul/+ < cost_fire⁻¹(θsoul/2):
				↩ 'send '+(t ← t max .soul)+' fire '+node.dir(t)
			if node.down.well.soul > min(max(1, θsoul*0.3), 10):
				↩ 'send '+node.down.well.soul+' from down up'
			if θsoul < 0.1: ↩ null
			if (t ← node.adjacent - .agent max .down.well.soul).down.well.soul > 10
				↩ 'send a new agent with '+(θsoul/2)+' soul and code '+Buffer(JSON.stringify(_(_.clone(θ)).extend({λ:θ+''}))).toString('base64')+' '+node.dir(t)
		
		θ.name = rand()+''
		// (t←_.range(5)*rand) * (% t/+)
		θ

	can i have a grid and controls for running the ticks? as a static javascript app, in a browser tab. i want the grid to be the biggest size that fits in the given window with the given display method.
	display the top grid nodes as 12×12px squares
	if empty, a solid square of the soul-color of the well in the node below it
	else, the empty version plus a centered 9×9px square of the agent`s soul-color, plus 2 ascii chars to represent the agent`s code
	on mouseover grid square, display its node`s contents in an html tooltip

	soul color: {0: #000, 10: #f00, 100: #ff0, 1000: #08f, 10000: #00f} with linear interpolation

// --------------------------------- weather -------------------------------- //

	2d`~`
	(merge weather images @ hour 0, index 0 2 3     ) (″ @ hour 48)
	(merge weather images @ hour 0, index 9 10 11 12) (″ @ hour 48)
	→ @test.png

	where
		weather_image(hour, index) = GET "http://forecast.weather.gov/meteograms/Plotter.php?lat=37.872&lon=-122.265&wfo=MTR&zcode=CAZ508&gset=18&gdiff=3&unit=0&tinfo=PY8&ahour="+hour+"&pcmd="+("000000000000000000000000000000000000000000000000000000000" [index]= "1")+"&lg=en&indu=1!1!1!&dd=&bw=&hrspan=48&pqpfhr=6&psnwhr=6"
		merge a set of weather images = average(it s/\grey/black/g) + average(it s/[^\grey]/black/g)

// --------------------------------- lackey --------------------------------- //

	make ~/Library/Keyboard\ Layouts/lackey.icns equal ./lackey.icns
	make ~/Library/Keyboard\ Layouts/lackey.keylayout equal make_keylayout()
		if any write happened: print '
		!! system keyboard layout changed !!
		you may need to manually set the new layout in System Preferences → Keyboard → Input Sources and then reboot your computer
		new id: ${.id}'
	make ~/Library/Application\ Support/Karabiner/private.xml equal make_karabiner()
		if any write happened:
		/Applications/Karabiner.app/Contents/Library/bin/karabiner reloadxml
		/Applications/Karabiner.app/Contents/Library/bin/karabiner enable lackey

	make_keylayout:
		read lackey.keylayout
		$('keyMapSet').@ = [
			'asdfhgzxcv\xa7bqweryt123465=97-80]ou[ip\x0dlj\'k;\\,/nm.\x09 `\x08\x03\x1b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00.\x1d*\x00+\x1c\x1b\x1f\x00\x00/\x03\x1e-\x00\x00=01234567\x0089\x00\x00\x00\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x05\x01\x0b\x7f\x10\x04\x10\x0c\x10\x1c\x1d\x1f\x1e\x00'
			'ASDFHGZXCV\xb1BQWERYT!@#$^%+(&_*)}OU{IP\x0dLJ"K:|<?NM>\x09 ~\x08\x03\x1b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00.**\x00++\x1b=\x00\x00/\x03/-\x00\x00=01234567\x0089\x00\x00\x00\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x05\x01\x0b\x7f\x10\x04\x10\x0c\x10\x1c\x1d\x1f\x1e\x00'
			'ASDFHGZXCV\xa7BQWERYT123465=97-80]OU[IP\x0dLJ\'K;\\,/NM.\x09 `\x08\x03\x1b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00.\x1d*\x00+\x1c\x1b\x1f\x00\x00/\x03\x1e-\x00\x00=01234567\x0089\x00\x00\x00\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x05\x01\x0b\x7f\x10\x04\x10\x0c\x10\x1c\x1d\x1f\x1e\x00'
			[[10],,[13],[15],,,,,[12],,,[11],,,[14],,,,[1],[2],[3],[4],[6],[5],,[9],[7],,[8],[0],,,,,,,,,,,,,,,,,,,,,,0x08,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,[0],[1],[2],[3],[4],[5],[6],[7],,[8],[9],,,,,,,,,,,,,,,,,,,,,,0x05,0x01,0x0b,0x7f,0x10,0x04,0x10,0x0c,0x10,0x1c,0x1d,0x1f,0x1e,]
			'\x01\x13\x04\x06\x08\x07\x1a\x18\x03\x160\x02\x11\x17\x05\x12\x19\x14123465=97\x1f80\x1d\x0f\x15\x1b\x09\x10\x0d\x0c\x0a\'\x0b;\x1c,/\x0e\x0d.\x09 `\x08\x03\x1b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00.\x1d*\x00+\x1c\x1b\x1f\x00\x00/\x03\x1e-\x00\x00=01234567\x0089\x00\x00\x00\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x05\x01\x0b\x7f\x10\x04\x10\x0c\x10\x1c\x1d\x1f\x1e\x00'
			] * <keyMap index="$i"> $(* <key code="$i" $(isa Array? action="$₀" : output="&#x$(as char to hex);")/>) </>
		$('keyboard').id = hash it into -100..-30000-100..-30000

	make_karabiner:
		//! right command is maybe problematic
		//! need to enable multi-modifier chords. maybe do this by changing the keylayout so that the hex codes are hidden away?

		.lackey files are formatted like
			/^(\S+) : (\S+)$/ -> chord
			interrupted (labeled) ascii box ->
				should have 4 or 6 lines
				transform each line by /\S\S?/g
				if 4 lines: interpret as a [1:-1] view of (box 'homoiconic' with all atoms = '_'), and de-view
				flatten lines.					
			/#.*$/ -> null
			/\s/ -> null

		read default.lackey → boxes, chords
		discard boxes '','⇧' //! todo
		prepend-zip boxes with boxes pop 'homoiconic'. discard pairs ≈ [,'_'].
		let keycodes ← boxes pop 'keycode' as dict
		chords ~= (remove boxes) ** {keys:[0], out:[1]} ** (.keys= ^.label+.keys) / ~

		let KeyCode x = 'KeyCode::'+(x≈/\d/? 'KEY_'+x : x≈/[a-z]/? uppercase x : 'RawValue::0x'+keycodes[x])
		let kc_hex x = x * (it as char to hex * (KeyCode it)+',ModifierFlag::OPTION_L,'). flatten. as string.
		let shells ← []
		let gen_shell x = (shells ~= [[kc,x]]; kc) where kc ← 'KeyCode::VK_OPEN_URL_'+(random ∈ ≈/\w{8}/)
		gen_shell 'echo dummy'
		let autogens ←
			['__KeyToKey__ KeyCode::PC_APPLICATION, VK_CONTROL, KeyCode::TAB,ModifierFlag::CONTROL_L|ModifierFlag::SHIFT_L'] ~
			['__KeyToKey__ KeyCode::PC_APPLICATION, ModifierFlag::NONE, KeyCode::RawValue::0x82'] ~
			(chords -= .keys.length ≠ 2); chords *
				.keys[0] = '⌥'? '__KeyToKey__ '+(KeyCode .keys[1])+', VK_OPTION|ModifierFlag::NONE,' :
					'__SimultaneousKeyPresses__ '+(KeyCode .keys[0])+', '+(KeyCode .keys[1])+','
				//.keys[0] = 'R⌘'? '__KeyToKey__ '+KeyCode(.keys[1])+', ModifierFlag::COMMAND_R,' :
				+
				out isa string? kc_hex out : (gen_shell out[0])+','
		↩ xml <root>
			$(shells * <vkopenurldef> <name>$(it[0])</> <url type="shell">$(it[1])</> </>)
			<item> <name>lackey</> <identifier>lackey</> $(autogens * <autogen>$it</>) </>
			</>

// -------------------------------- timer-tab ------------------------------- //
	// this is a first-pass sketch of a clone of timer-tab.com. the intent is to experiment with it more *after* it's been first rendered.
	// major implementation requirement: auto-kerning or at least separation-of-concerns kerning
	// implentation: i expect the stripe cut out will be aligned to pixels

	// desired feature: can edit and stuff to help account for distraction/failure
	// desired feature: should help user think in kiloseconds and such

	webapp. single page no scroll. offlined fully.

	as the central element, a 900×150px box made of these controls:
		|     [h]:[m] [s]     |      [h]:[m] [s]      |                     |
		| [> start countdown] | [> start alarm clock] | [> start stopwatch] |

	start buttons set current control and display action
		action has a value :: duration
		action appears below control

	countdown action: count time down from control fields as .value / [|| pause]
	alarm action: count time down from (control fields - now) as .value / until (control fields as hh:mm)
		control fields represent the next datetime matching them
	stopwatch action: count time up from 0 as .value / [|| pause]

	if counting time down reaches 0, stop counting, and append to control action
		|         [# stop] button             (removing any existing button)
		| embed http://youtu.be/PS5KAEgrtMA

	pause button pauses or resumes count and toggles self with [> resume]
	stop button stops&removes a video embed and [greys out self (if replacing a button) or removes self (if there was no button to start with)]
		☝ video embed -> same action

	--- style ---

	plain white background is default. background images are centered and fill-sized.
	font is Lato

	button,field:
		color is #666 or #333 on hover
		bg #fff.7 or bg #fff.95 on hover
		ease-in-out these over 0.3s
	button text is 13px uppercase. '>' = play glyph, '||' = pause glyph, '#' = stop glyph
	buttons are 4px rounded

	glyphs are #ccc 32×32px. round visual corners 1.5px.
	play glyph: filled 1,1,1× triangle w/ one edge flush left
	pause glyph: filled w/ 0.19× centered vertical stripe cut out
	stop glyph: filled

	':' in fields adds nothing to layout size
	field font is 35px
	fields have space for /\d\d/
	's' fields are 0.7× size
	start buttons are kept same width

	counter font is 105px or reduced to keep width comfortable
	counter font is #444, plus α=.3 when paused (ease-in-out over 0.3s)
	alarm "until" font is 15px

	two stripes project from the current control to edges of window, overlapping on the control
		stripes have bg #d0d0d0.58
		stripes move smoothly when their position changes

	action.value shows in page title w/ seconds truncated if hours>0
		and in page icon, similarly

// ---------------------- cute point redemption webapp ---------------------- //

	webapp. public db.

	db is a single table:
		humans         cute points
		matt reyes     1

	first, ask who you are (dropdown of humans ∈ db)
	then, display "you have $n cute points. [redeem?]"
		☝ redeem -> the cute points ←! 0. send an email to [alice0meta@gmail.com, the user`s email] saying "cute point redemption request: $n"

	if need and don`t know the user`s email, ask for it with a modal dialog

// --------------------------------- <impl> --------------------------------- //

	you can watch descendants ∈ path by
		require npm::chokidar
		chokidar.watch(path, {persistent:true, ignoreInitial:true}). subscribe to 'all': event, path ->
			change event by ('addDir': 'add', 'unlinkDir': 'unlink')        (note: path is dir iff event was changed)

	read plist: npm::plist.parse(it)
	show plist: npm::plist.build(it)

	// this is my first attempt at stringifying json nicely. i do not think it will be my last.
	let pretty-print 'json' = λ λ(it):
		let wrap_width = 150
		let TAB = '  '
		let indent it = .replace(/\n/g,'\n'+TAB)

		if it is in the callstack of this recursive function:
			throw TypeError('Converting circular structure to JSON')

		if .toJSON isa function: .toJSON()
		elif it isa ∈ null undefined function boolean number string: JSON.stringify(it)
		else:
			if it isa array, ensure all indexes of it have elements
			let ts ←
				it isa array -> it * λ * indent
				it isa object -> (k,v in pairs(it) if v!==undefined && typeof(v)!=='function') * indent(λ(k)+': '+λ(v))
			let a,b ← it isa array? '[]' : '{}'
			a+ts.join(', ')+b, unless its .length > wrap_width, then a+'\n'+TAB+ts.join(',\n'+TAB)+'\n'+b

// -------------------------------------------------------------------------- //
// ----------------- let`s categorize all the language used ----------------- //
// -------------------------------------------------------------------------- //

i notice that (say) timer-tab is much more declarative than (say) lackey
but when reading them they both feel perfectly excellent
but if i take this and try to make lackey more like timer-tab it`s very hard but seems to improve it a great deal
something Funky is up here

a bug i noticed: in an interactive environment, we would start sketching out something like dance, and -
oh
right
i was taking the text of dance as canon and dutifully transcribing it
that was silly
the goal here is to write down each individual concept required
right
okay
let`s do this differently.
:D

require <library>
	require npm::fb@^0.7.0
declare that a function uses a particular callback style
	fb.api uses value-callback
declare rule for how we`re using a particular function - i.e., modify it
	after a fb.api call, null, .error, .data.error -> error
after declaring a function, reference it implicitly
	and after a /*fb.api*/ call ⟨...⟩
add global error hook
	on error, also: ⟨code⟩
print things
	print 5, 'foo'
	print 'ERROR' sans newline
log things
	log (event, now, file) tabularly
read files
	read auth from ./arc/fb_auth.json
write files
	write @file to file
copy files
	copy file to
have bareword filenames
	read auth from ./arc/fb_auth.json
remove file extension
	write (@file as plist) to file without extension
implicitly view .json files as json
	read auth from ./arc/fb_auth.json
implicitly, the compiler/runtime should choose sensible places to force evaluation / do reduction / have strictness points
declare name
	out ← ~/Library/Application\ Support/Sublime\ Text\ 3/Packages
declare fact about equality which is also kinda a declaration of a name ???
	let out = ~/Library/Application\ Support/Sublime\ Text\ 3/Packages
unordered declaration
	(x * 5 where x = 8) = (let x = 8. x * 5) = 40
lazy `and`, `or`, `and` and `or` in the other direction
	read auth from ./arc/fb_auth.json   or error
	error unless <condition>
intuitive specification of precedence
	read auth from ./arc/fb_auth.json   or error
	we wrote to it earlier  ||  within in and ≈/Package Control\./
implicitly, top-level errors are automatically printed sanely with text filled in from surrounding code and the program name
assertion (compiler or runtime should verify)
	(note: should be lazy)
statement (compiler and runtime can take as true)
	(note: path is dir iff event was changed)
assert that a file will only be read into a variable the first time the program does something with that var or that file
	read auth from ./arc/fb_auth.json    (note: should be lazy)
specify a CLI - implicitly with all the nice things, e.g. --version and --help
	CLI:

		verify <token> <user_id>
			⟨code⟩

		get-name <token>
			⟨code⟩
bare javascript code
	fb.api('/me', {access_token: token})
implicit rewriting of code that we know uses callbacks
	fb.api('/me', {access_token: token})
	print .name sans newline
	->
	fb.api('/me', {access_token: token}, λ(it){
		print .name sans newline
		})
implicit use of the standard pronoun
	fb.api('/me', {tok:}). print .name
	(7. it + 8) = 15
dictionaries/objects
	{a:5, b:9}
	('a':'b', 'c':'d')
	a ← 5. {a:}
arrays/lists
	log (event, now, file) tabularly
	[5, 6]
string building
	auth.id+'|'+auth.secret
	in+'.json'
	a ← 5. y ← 2; "$a $(a = 5? "y" : "n")" = "5 y"
cwd changing
	within root: // ?? somehow `root` is inferred as a filename expression ??
common verbs
	error // might look like `throw Error()`
	now // might look like `moment()`
	touch // might look like `write "" to`
	lines // might look like `it as lines`
	delete // as in "delete file"
common operators
	a = b
	a? b : c
encode things in other things
	file.encode('fspath')
filesystem selectors
	files ∈ (. - ./.history/)
	files ∈ *
filter filesystem selector by name of variable that we`re defining as an element of it (e.g. file,dir,path)
	files ∈ (. - ./.history/)
watch files in a filesystem selector. this is an event with a callback. it probably uses implicit vars like event,path,file
	watch files ∈ (. - ./.history/):
loop over files in a filesystem selector
	for files ∈ in *:
	for paths ∈ (in > *):
hook into things, locally
	replace $in with $out in all writes/deletions.
pretty-print things
	pretty-print @in to in+'.json'
unboxing semantic
	write (@file as plist) to file without extension
xml literals
	a ← 5. b ← 2. (xml <foo>a <bar baz="$a"></> $(b + 7)</>) as str = '<foo>a<bar baz="5"></bar>9</foo>'
object matching
	.data match {is_valid: true, app_id: auth.id, user_id:}
syntactically brief matching for strings
	≈/\.json$/ -> write (@file as plist) to file without extension
case statements
	≈/\.json$/ -> write (@file as plist) to file without extension
view data as another type or convert/cast data to another type
	@file as plist
	it as lines
	boxes pop 'keycode' as dict
	it as char to hex
	control fields as hh:mm
	.time as "YYYY-MM-DD/HH:mm:ssZ"
pick nice solutions to constraints
	write /*it::seq*/ to distinct .sublime-snippet files in same dir as file
split
	split /*it*/ on '\n\n'
lines
	('a\nb\nc' as lines)[0] as str = 'a'
	('a\nb\nc' as lines)[1:] as str = 'b\nc'
implicit application of map
	split on '\n\n', * xml <snippet> <content>$(lines[1:])</> <tabTrigger>$(lines[0])</> </>
conditions about what the entire program did
	we wrote to it earlier
englishy and regexy filesystem selectors
	within in and ≈/Package Control\./


define custom data structures declaratively
	define: rectangular grid of nodes w/ adjacency north/east/west/south, plus for each of those a node connected below it
		the first nodes each have a slot for an agent
		the second nodes each have a well of “soul” (numeric)

... but what are the pieces?


rectangular grid of nodes w/ adjacency north/east/west/south
<grid of nodes>, plus for each of those /*nodes*/ a node connected <direction preposition> it
define: <thing of nodes, plus ... a node> \n (the /first|second/ nodes = /* the first or second set of nodes */)
<set of nodes> each have <property>
a slot for an agent
a well of “soul” (numeric)
<type>s regenerate at <rate>
(<number>/tick) :: rate
a <type> with <condition> will /* execute */ <code>
inside above, where type has an attribute <name>, <name> is valid to occur inside <condition>

------------------------------------- dance ------------------------------------
// "sure" is a 183-line toy I made in late 2013. This is a sequel, not a direct translation. I expect writing this in the style of the original would take rather more than 183 lines.

define: rectangular grid of nodes w/ adjacency north/east/west/south, plus for each of those a node connected below it
	the first nodes each have a slot for an agent
	the second nodes each have a well of “soul” (numeric)

wells regenerate at 0.01/tick
a well with soul ≥ 100 will spend all its soul on the action of sending an agent with code well_code_gen() to the node above it

an agent has a container of soul and a code that is executed to return the chosen action

each tick, each agent may choose an action to attempt
	send X soul or fire to adjacent node
	send X soul from adjacent node with well to own node
	send new agent with X soul and code φ to adjacent node with an agent-slot
it`s first given a description of its node and adjacent nodes, plus any adjacent nodes with wells
if it chooses an action costing more than its soul, nothing happens

each tick, soul in a node with no agents sends itself at the cost of itself to the node below

all actions happen simultaneously: first, they move to their destinations, then each node resolves the actions it received

	fire is negative soul.
	soul and soul the same cell immediately combine. if the soul is not directed towards a particular agent, it combines with all agents in the cell in proportion to their existing amounts of soul

	any agent with zero soul is immediately removed

	agents in the same node fight. they`re given a description of the node and may choose to send fire to each agent in the node.
		all¹ agents that send no fire send all of their soul to the node
			[1] if no agent sends fire, all except the agent with the most soul
	this iterates until there are no longer multiple agents in the same node

sending X fire costs ⌈ X*1.1 ⌉ soul, + 0.05 if it`s to another node
sending X soul costs X soul, + 0.05 if it`s to another node
sending a new agent with X soul and code φ costs X + 0.1 soul
sending X soul from adjacent node to own node costs 0.1 soul

the code is a javascript function(situation, info).

let well_code_gen = λ():
	θ ← λ(situation, node):
		if situation ≠ 'tick': ↩ null

		θsoul ← node.agent.soul
		if (t ← node.adjacent * .agent - null - (.code.name == θ.name))≠[] && t*.soul/+ < cost_fire⁻¹(θsoul/2):
			↩ 'send '+(t ← t max .soul)+' fire '+node.dir(t)
		if node.down.well.soul > min(max(1, θsoul*0.3), 10):
			↩ 'send '+node.down.well.soul+' from down up'
		if θsoul < 0.1: ↩ null
		if (t ← node.adjacent - .agent max .down.well.soul).down.well.soul > 10
			↩ 'send a new agent with '+(θsoul/2)+' soul and code '+Buffer(JSON.stringify(_(_.clone(θ)).extend({λ:θ+''}))).toString('base64')+' '+node.dir(t)
	
	θ.name = rand()+''
	// (t←_.range(5)*rand) * (% t/+)
	θ

can i have a grid and controls for running the ticks? as a static javascript app, in a browser tab. i want the grid to be the biggest size that fits in the given window with the given display method.
display the top grid nodes as 12×12px squares
if empty, a solid square of the soul-color of the well in the node below it
else, the empty version plus a centered 9×9px square of the agent`s soul-color, plus 2 ascii chars to represent the agent`s code
on mouseover grid square, display its node`s contents in an html tooltip

soul color: {0: #000, 10: #f00, 100: #ff0, 1000: #08f, 10000: #00f} with linear interpolation

// --------------------------------- weather -------------------------------- //

2d`~`
(merge weather images @ hour 0, index 0 2 3     ) (″ @ hour 48)
(merge weather images @ hour 0, index 9 10 11 12) (″ @ hour 48)
→ @test.png

where
	weather_image(hour, index) = GET "http://forecast.weather.gov/meteograms/Plotter.php?lat=37.872&lon=-122.265&wfo=MTR&zcode=CAZ508&gset=18&gdiff=3&unit=0&tinfo=PY8&ahour="+hour+"&pcmd="+("000000000000000000000000000000000000000000000000000000000" [index]= "1")+"&lg=en&indu=1!1!1!&dd=&bw=&hrspan=48&pqpfhr=6&psnwhr=6"
	merge a set of weather images = average(it s/\grey/black/g) + average(it s/[^\grey]/black/g)

// --------------------------------- lackey --------------------------------- //

make ~/Library/Keyboard\ Layouts/lackey.icns equal ./lackey.icns
make ~/Library/Keyboard\ Layouts/lackey.keylayout equal make_keylayout()
	if any write happened: print '
	!! system keyboard layout changed !!
	you may need to manually set the new layout in System Preferences → Keyboard → Input Sources and then reboot your computer
	new id: ${.id}'
make ~/Library/Application\ Support/Karabiner/private.xml equal make_karabiner()
	if any write happened:
	/Applications/Karabiner.app/Contents/Library/bin/karabiner reloadxml
	/Applications/Karabiner.app/Contents/Library/bin/karabiner enable lackey

make_keylayout:
	read lackey.keylayout
	$('keyMapSet').@ = [
		'asdfhgzxcv\xa7bqweryt123465=97-80]ou[ip\x0dlj\'k;\\,/nm.\x09 `\x08\x03\x1b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00.\x1d*\x00+\x1c\x1b\x1f\x00\x00/\x03\x1e-\x00\x00=01234567\x0089\x00\x00\x00\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x05\x01\x0b\x7f\x10\x04\x10\x0c\x10\x1c\x1d\x1f\x1e\x00'
		'ASDFHGZXCV\xb1BQWERYT!@#$^%+(&_*)}OU{IP\x0dLJ"K:|<?NM>\x09 ~\x08\x03\x1b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00.**\x00++\x1b=\x00\x00/\x03/-\x00\x00=01234567\x0089\x00\x00\x00\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x05\x01\x0b\x7f\x10\x04\x10\x0c\x10\x1c\x1d\x1f\x1e\x00'
		'ASDFHGZXCV\xa7BQWERYT123465=97-80]OU[IP\x0dLJ\'K;\\,/NM.\x09 `\x08\x03\x1b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00.\x1d*\x00+\x1c\x1b\x1f\x00\x00/\x03\x1e-\x00\x00=01234567\x0089\x00\x00\x00\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x05\x01\x0b\x7f\x10\x04\x10\x0c\x10\x1c\x1d\x1f\x1e\x00'
		[[10],,[13],[15],,,,,[12],,,[11],,,[14],,,,[1],[2],[3],[4],[6],[5],,[9],[7],,[8],[0],,,,,,,,,,,,,,,,,,,,,,0x08,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,[0],[1],[2],[3],[4],[5],[6],[7],,[8],[9],,,,,,,,,,,,,,,,,,,,,,0x05,0x01,0x0b,0x7f,0x10,0x04,0x10,0x0c,0x10,0x1c,0x1d,0x1f,0x1e,]
		'\x01\x13\x04\x06\x08\x07\x1a\x18\x03\x160\x02\x11\x17\x05\x12\x19\x14123465=97\x1f80\x1d\x0f\x15\x1b\x09\x10\x0d\x0c\x0a\'\x0b;\x1c,/\x0e\x0d.\x09 `\x08\x03\x1b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00.\x1d*\x00+\x1c\x1b\x1f\x00\x00/\x03\x1e-\x00\x00=01234567\x0089\x00\x00\x00\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x10\x05\x01\x0b\x7f\x10\x04\x10\x0c\x10\x1c\x1d\x1f\x1e\x00'
		] * <keyMap index="$i"> $(* <key code="$i" $(isa Array? action="$₀" : output="&#x$(as char to hex);")/>) </>
	$('keyboard').id = hash it into -100..-30000-100..-30000

make_karabiner:
	//! right command is maybe problematic
	//! need to enable multi-modifier chords. maybe do this by changing the keylayout so that the hex codes are hidden away?

	.lackey files are formatted like
		/^(\S+) : (\S+)$/ -> chord
		interrupted (labeled) ascii box ->
			should have 4 or 6 lines
			transform each line by /\S\S?/g
			if 4 lines: interpret as a [1:-1] view of (box 'homoiconic' with all atoms = '_'), and de-view
			flatten lines.					
		/#.*$/ -> null
		/\s/ -> null

	read default.lackey → boxes, chords
	discard boxes '','⇧' //! todo
	prepend-zip boxes with boxes pop 'homoiconic'. discard pairs ≈ [,'_'].
	let keycodes ← boxes pop 'keycode' as dict
	chords ~= (remove boxes) ** {keys:[0], out:[1]} ** (.keys= ^.label+.keys) / ~

	let KeyCode x = 'KeyCode::'+(x≈/\d/? 'KEY_'+x : x≈/[a-z]/? uppercase x : 'RawValue::0x'+keycodes[x])
	let kc_hex x = x * (it as char to hex * (KeyCode it)+',ModifierFlag::OPTION_L,'). flatten. as string.
	let shells ← []
	let gen_shell x = (shells ~= [[kc,x]]; kc) where kc ← 'KeyCode::VK_OPEN_URL_'+(random ∈ ≈/\w{8}/)
	gen_shell 'echo dummy'
	let autogens ←
		['__KeyToKey__ KeyCode::PC_APPLICATION, VK_CONTROL, KeyCode::TAB,ModifierFlag::CONTROL_L|ModifierFlag::SHIFT_L'] ~
		['__KeyToKey__ KeyCode::PC_APPLICATION, ModifierFlag::NONE, KeyCode::RawValue::0x82'] ~
		(chords -= .keys.length ≠ 2); chords *
			.keys[0] = '⌥'? '__KeyToKey__ '+(KeyCode .keys[1])+', VK_OPTION|ModifierFlag::NONE,' :
				'__SimultaneousKeyPresses__ '+(KeyCode .keys[0])+', '+(KeyCode .keys[1])+','
			//.keys[0] = 'R⌘'? '__KeyToKey__ '+KeyCode(.keys[1])+', ModifierFlag::COMMAND_R,' :
			+
			out isa string? kc_hex out : (gen_shell out[0])+','
	↩ xml <root>
		$(shells * <vkopenurldef> <name>$(it[0])</> <url type="shell">$(it[1])</> </>)
		<item> <name>lackey</> <identifier>lackey</> $(autogens * <autogen>$it</>) </>
		</>

// -------------------------------- timer-tab ------------------------------- //
// this is a first-pass sketch of a clone of timer-tab.com. the intent is to experiment with it more *after* it's been first rendered.
// major implementation requirement: auto-kerning or at least separation-of-concerns kerning
// implentation: i expect the stripe cut out will be aligned to pixels

// desired feature: can edit and stuff to help account for distraction/failure
// desired feature: should help user think in kiloseconds and such

webapp. single page no scroll. offlined fully.

as the central element, a 900×150px box made of these controls:
	|     [h]:[m] [s]     |      [h]:[m] [s]      |                     |
	| [> start countdown] | [> start alarm clock] | [> start stopwatch] |

start buttons set current control and display action
	action has a value :: duration
	action appears below control

countdown action: count time down from control fields as .value / [|| pause]
alarm action: count time down from (control fields - now) as .value / until (control fields as hh:mm)
	control fields represent the next datetime matching them
stopwatch action: count time up from 0 as .value / [|| pause]

if counting time down reaches 0, stop counting, and append to control action
	|         [# stop] button             (removing any existing button)
	| embed http://youtu.be/PS5KAEgrtMA

pause button pauses or resumes count and toggles self with [> resume]
stop button stops&removes a video embed and [greys out self (if replacing a button) or removes self (if there was no button to start with)]
	☝ video embed -> same action

--- style ---

plain white background is default. background images are centered and fill-sized.
font is Lato

button,field:
	color is #666 or #333 on hover
	bg #fff.7 or bg #fff.95 on hover
	ease-in-out these over 0.3s
button text is 13px uppercase. '>' = play glyph, '||' = pause glyph, '#' = stop glyph
buttons are 4px rounded

glyphs are #ccc 32×32px. round visual corners 1.5px.
play glyph: filled 1,1,1× triangle w/ one edge flush left
pause glyph: filled w/ 0.19× centered vertical stripe cut out
stop glyph: filled

':' in fields adds nothing to layout size
field font is 35px
fields have space for /\d\d/
's' fields are 0.7× size
start buttons are kept same width

counter font is 105px or reduced to keep width comfortable
counter font is #444, plus α=.3 when paused (ease-in-out over 0.3s)
alarm "until" font is 15px

two stripes project from the current control to edges of window, overlapping on the control
	stripes have bg #d0d0d0.58
	stripes move smoothly when their position changes

action.value shows in page title w/ seconds truncated if hours>0
	and in page icon, similarly

// ---------------------- cute point redemption webapp ---------------------- //

webapp. public db.

db is a single table:
	humans         cute points
	matt reyes     1

first, ask who you are (dropdown of humans ∈ db)
then, display "you have $n cute points. [redeem?]"
	☝ redeem -> the cute points ←! 0. send an email to [alice0meta@gmail.com, the user`s email] saying "cute point redemption request: $n"

if need and don`t know the user`s email, ask for it with a modal dialog

// --------------------------------- <impl> --------------------------------- //

// <noteified>
// you can watch descendants ∈ path by /* explains how to implement watch from above */
// subscribe to <event name>: <function> /* implicitly on `it` */
// /* should guess that when told how to do a thing that takes a callback and there's a single subscription in the explanation, the callback is called at the end of it */
// change <var> by <dict>
// (change <var> by <expr>. <var> was changed) should be true iff the change statement altered <var>
// (a, b -> a += 5) isa function

you can watch descendants ∈ path by
	require npm::chokidar
	chokidar.watch(path, {persistent:true, ignoreInitial:true}). subscribe to 'all': event, path ->
		change event by ('addDir': 'add', 'unlinkDir': 'unlink')        (note: path is dir iff event was changed)

read plist: npm::plist.parse(it)
show plist: npm::plist.build(it)

// this is my first attempt at stringifying json nicely. i do not think it will be my last.
let pretty-print 'json' = λ λ(it):
	let wrap_width = 150
	let TAB = '  '
	let indent it = .replace(/\n/g,'\n'+TAB)

	if it is in the callstack of this recursive function:
		throw TypeError('Converting circular structure to JSON')

	if .toJSON isa function: .toJSON()
	elif it isa ∈ null undefined function boolean number string: JSON.stringify(it)
	else:
		if it isa array, ensure all indexes of it have elements
		let ts ←
			it isa array -> it * λ * indent
			it isa object -> (k,v in pairs(it) if v!==undefined && typeof(v)!=='function') * indent(λ(k)+': '+λ(v))
		let a,b ← it isa array? '[]' : '{}'
		a+ts.join(', ')+b, unless its .length > wrap_width, then a+'\n'+TAB+ts.join(',\n'+TAB)+'\n'+b
