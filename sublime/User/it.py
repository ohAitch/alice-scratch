# make use of the fact that urls can't contain newlines

# restructure link copying and manipulation (in sublime plugins, bashrc, ζ, possibly more (path finder? chrome url bar?)) to have a centralized normalization format and management for labelling text and usage of url formatters
# also to have a consistent way to interact with sublime and the pastebin

# maybe require('wav') and npm`wav@ should be links to http://npmjs.com/package/wav
# `agentyduck.blogspot.com` really ought to be a valid link (both in parsing and in producing)
# `~/code/scratch/sublime/build.ζ` really ought to be a valid link (both in parsing and in producing)

# oberon got this already
# ◍ To launch applications or execute commands, you first type them somewhere (anywhere, it doesn’t matter), and then middle-click them:
# this syntax-colors them and red-underlines them
# ◍ You need a program launcher? Create a new text file with the programs you need.

# the clickable search results are currently implemented in a horrifying way, because we are not properly associating data across multiple contexts that make it hard to share data. with the right builtins, this is easily resolveable.

#################################### prelude ###################################
import sublime, sublime_plugin
from sublime import Region
import os, subprocess, re, urllib, json

t = (os.environ.get('PATH') or '').split(':')
if not '/usr/local/bin' in t: os.environ['PATH'] = ':'.join(t+['/usr/local/bin'])

def ζfresh_async(*a): return subprocess.Popen(['ζ','--fresh']+list(a))
def ζfresh(*a): return subprocess.check_output(['ζ','--fresh']+list(a)).decode('utf-8')
def ζ(*a): return subprocess.check_output(['ζλ']+list(a)).decode('utf-8')
def E(ι): return json.dumps(ι)
def serialize(ι):
	if isinstance(ι,sublime.View): return { "type":'sublime.View', "id":ι.id() }
	else: return 'error_ls1w8idny'

################################################################################
URL = r'\b(?:(https?|chrome|chrome-extension)://|(?:file|mailto):)(?:[^\s“”"<>]*\([^\s“”"<>]*\))?(?:[^\s“”"<>]*[^\s“”"<>)\]}⟩?!,.:;])?'
FIND_RESULT = r'^(?:code|consume|documents|history|notes|pix)/.{1,80}?:\d+:'

def merge_overlapping_regions(ι):
	for i in range(len(ι)-1):
		if ι[i].intersects(ι[i+1]):
			ι[i+1] = ι[i].cover(ι[i+1])
			ι[i] = None
	return [ι for ι in ι if ι]
def expand_empty_region_to_line(view,ι): return view.line(ι) if ι.empty() else ι
def expand_empty_region_to_url(view,ι,mouse_mode=False):
	if not ι.empty(): return ι
	l = expand_empty_region_to_line(view,ι)
	if l.size() > 1000000: return ι
	for REG in [URL, re.compile(FIND_RESULT,re.MULTILINE)]:
		for t in re.finditer(REG,view.substr(l)):
			s = l.a + t.start(); e = l.a + t.end()
			if (s < ι.a < e if mouse_mode else s <= ι.a <= e):
				return Region(s,e)
	return ι
def left_trim_region(view,ι):
	t = len(re.match(r'^\s*',view.substr(ι)).group(0))
	if ι.a <= ι.b: ι.a += t
	else:          ι.b += t
	return ι
def expand_empty_regions_to_urls_or_lines(view,ι): return merge_overlapping_regions([expand_empty_region_to_line(view,expand_empty_region_to_url(view,ι)) for ι in ι])
def expand_empty_regions_to_lines(view,regions): return merge_overlapping_regions([expand_empty_region_to_line(view,ι) for ι in regions])
def left_trim_regions(view,regions): return [left_trim_region(view,ι) for ι in regions]
def expand_empty_region_to_whole_buffer(view,regions): return [Region(0,view.size())] if len(view.sel()) == 1 and view.sel()[0].empty() else view.sel()

class open_context(sublime_plugin.TextCommand):
	def run(self,edit,type,focus=True,mouse=False):
		view = self.view
		if type == "github":
			ζfresh_async('try{ go_to(github_url('+E(serialize(view))+'),{focus:'+E(focus)+'}) }catch(e){ if (e.human) hsᵥ`hs.alert(${e.human},4)`; else throw e }')
		elif type == "terminal":
			ζ(""" here ← """+E(view.file_name())+"""; go_to('path', here? φ(here).φ`..`+'' : process.env.HOME, {focus:"""+E(focus)+""",in_app:'terminal'}) """)
		elif type == "link":
			if mouse: t = view.sel()[0]; ι = [] if not t.empty() else [ι for ι in [expand_empty_region_to_url(view, view.sel()[0], True)] if not ι.empty()]
			else: ι = expand_empty_regions_to_urls_or_lines(view, view.sel())
			if mouse and len(ι): view.sel().clear(); view.sel().add(Region(ι[0].end(),ι[0].end())) # workaround for a bug
			for ι in ι: t = view.substr(ι); ζ('go_to('+E('path' if re.match(FIND_RESULT,t) else None)+','+E(t)+',{focus:'+E(focus)+',sb_view_file_name:'+E(view.file_name() or '')+'})')

class inline_eval_zeta(sublime_plugin.TextCommand):
	def run(self,edit):
		# this is a perfect candidate for a state-saving program like a repl; you can load it with functions and then eval them
		view = self.view; sel = view.sel()
		sel = expand_empty_regions_to_lines(view, sel)
		sel = left_trim_regions(view, sel)
		ι = [view.substr(ι) for ι in sel]
		r = json.loads(ζ("""
			hook_stdouterr ← =>{
				r ← process.stdio.slice(1).map(io=>{
					io = io‘.write
					r ← []; o ← io.ι; io.ι = ι=> r.push(ι); ↩ =>{ io.ι = o; ↩ r.join('') }
					}); ↩ _.once(=> r.map(ι=> ι()) ) }
			γ.i = 0
			JSON.parse(ι).map(ι=>{
				io ← hook_stdouterr()
				r←; e←; try{ γ.code = ι; γ.require = require; r = ζ_eval(ι) }catch(e_){ e = e_ }
				r ← [ ,…io().slice(1) ,sb.encode(r) ,e===∅? '' : e.stack ].join('')
				↩ (r===''? ι : ι.includes(chr(0xa))? ι.replace(re`${chr(0xa)}?$`,chr(0xa)) : '') + r
				}) """,E(ι)))
		for i in range(len(sel))[::-1]:
			view.replace(edit, sel[i], r[i])

class inline_compile_zeta_js(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view; sel = view.sel()
		sel = expand_empty_region_to_whole_buffer(view, sel)
		sel = expand_empty_regions_to_lines(view, sel)
		for reg in list(sel)[::-1]:
			ι = view.substr(reg)
			r = ζfresh('ζ_compile(ι)',ι)
			if r == ι: r = ζfresh('ζ_compile.⁻¹(ι)',ι)
			view.replace(edit, reg, r)

class nice_url(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view
		sel = expand_empty_regions_to_urls_or_lines(view, view.sel())
		for reg in list(sel)[::-1]:
			ι = view.substr(reg)
			t = ζ('nice_url(ι)',ι)
			if t is not ι: view.replace(edit, reg, t)

class _0(sublime_plugin.EventListener):
	def on_post_save(self,view): view.substr(Region(0,2)) == '#!' and ζ('shᵥ`chmod +x ${ι}`',view.file_name())

class goto_last_tab(sublime_plugin.WindowCommand):
	def run(self):
		window = self.window
		t = window.views(); len(t) and window.focus_view(t[-1])
		# sbᵥ t←; ( t=window.views()[-1] )&& window.focus_view(t)

class run_project(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view
		view.run_command("save")
		ζfresh_async('require_new(φ`~/.bashrc.ζ`).run_project('+E(serialize(view))+')')

class toggle_comment_2(sublime_plugin.TextCommand):
	def run(self,edit,style):
		view = self.view
		for ι in merge_overlapping_regions([ ι for ι in view.sel() for ι in view.lines(ι) ])[::-1]:
			view.insert(edit,ι.begin(),style)

class zeta(sublime_plugin.WindowCommand):
	def run(self,x):
		ζ(x)

# class zeta_fresh_async(sublime_plugin.WindowCommand):
# 	def run(self,x):
# 		ζfresh_async(x)

# class _1(sublime_plugin.EventListener):
# 	# def on_pre_save(self,view):
# 	# 	if view is undergoing ✨inline_build
# 	# 		remove ✨inline_build, output
# 	# 		pause ✨inline_build
# 	# def on_post_save(self,view):
# 	# 	if ✨inline_build paused:
# 	# 		return ✨inline_build, output
# 	# 		resume
# 	def on_modified(self,view):
# 		# ζ("""
# 		# 	ι.match(/^✨(.+)$/mg).map(ι=>{
# 		# 		hsᵥ`hs.alert(${ι})`
# 		# 		})
# 		# 	""",view.substr(view.line(Region(0,10000))))
# 		ζ("""
# 			ι = sbᵥ`view.substr(view.line(Region(0,10000)))`
# 			ι.match(/^✨(.+)$/mg).map(ι=>{
# 				hsᵥ`hs.alert(${ι})`
# 				})
# 			""")
# 		# if view can undergo ✨inline_build:
# 		# 	do it

class _2(sublime_plugin.EventListener):
	# maybe this really should do that reverse generation (aka: parsing) we tried having it do
	# like, knowing that `now` returns e.g. `2017-10-09T07:20Z` and thus `2017-10-09T07:20Z` can synonymize `now`
	def on_query_completions(self, view, prefix, locations):
		ι = prefix
		if ι == 'c': return [[ι,'cn.log(']]
		if ι in ['day','now','anon']:
			return (json.loads(ζ('t ← γ[ι]; (Tarr(t)? t : [t]).map(r=> [ι,r])',ι)),sublime.INHIBIT_WORD_COMPLETIONS)

class make_divider(sublime_plugin.TextCommand):
	# i wanna styles of different boldness, like, ===== is bolder than -----, and i wanna switch between them iff i hit the divider key and the length doesn't change
	# and maybe if you hit the command again it should unmake the divider?
	# should probably handle indented dividers
	# if it's already an empty divider, know that, don't do the silly thing
	# maybe work by trimming divider-matchables on both sides first, instead of trying to match an entire possible-divider?
	def run(self,edit,length):
		e_table_ = {
			# 'Packages/JavaScript/JavaScript.sublime-syntax': '#',
			# 'Packages/Python/Python.sublime-syntax': '#',
			# 'Packages/ShellScript/Shell-Unix-Generic.sublime-syntax': '#',
			# 'Packages/Ruby/Ruby.sublime-syntax': '#',
			# 'Packages/Lisp/Lisp.sublime-syntax': ';',
			'Packages/Lua/Lua.sublime-syntax': '-',
			}
		s_table = {
			'#': [r'^#+.*#+$',r'^#+\s*(.+?)\s*#+$','#',''],
			'-': [r'^-+.*-+$',r'^-+\s*(.+?)\s*-+$','-',''],
			# '/': [r'^// ?-+.*-+ ?//$',r'^// ?-+(?://)? *(.+?) *(?://)?-+ ?//$','-','// '],
			# ';': [r'^; ?-+.*-+ ?;$',r'^; ?-+;? *(.+?) *;?-+ ?;$','-','; ']
			}
		def data(): ι = view.settings().get('syntax'); return s_table[e_table_[ι] if ι in e_table_ else '#']

		view = self.view
		test, match, fill, ends = data()
		for region in [ι for ι in view.sel()][::-1]:
			line = view.line(region)
			s = view.substr(line)
			t = re.match(r'^(\t*)(.*)',s); tabs = t.group(1); s = t.group(2)
			if re.match(test,s):
				s = re.match(match,s).group(1)
			else:
				s = s.strip()
			def len_a(ι): return sum([len(ι) for ι in ι])
			if s == '':
				r = [ends,'',ends[::-1]]
				len_ = length - len(tabs)*2 - len_a(r)
				r[1] = fill * len_
			else:
				r = [ends,'',' ',s,' ','',ends[::-1]]
				len_ = length - len(tabs)*2 - len_a(r)
				while len_ < 6: len_ += 10
				r[1] = fill * ((len_+1)//2)
				r[5] = fill * (len_//2)
			q = region == line and region.empty()
			if q: view.sel().subtract(region)
			view.replace(edit,line,tabs+''.join(r))
			if q: view.sel().add(sublime.Region(view.line(region).end()))

def detect_syntax(view):
	data = {
		'ζ': 'Packages/JavaScript/JavaScript.sublime-syntax',
		'python': 'Packages/Python/Python.sublime-syntax',
		'bash': 'Packages/ShellScript/Shell-Unix-Generic.sublime-syntax',
		'.txt': 'Packages/Text/Plain text.sublime-syntax',
		}
	ι = None
	t = re.match(r"#!\s*(\S+)\s*(\S+)?" ,view.substr(view.full_line(1)))
	if t: a = t.group(1).split('/')[-1]; ι = t.group(2) if a == 'env' else a
	else: ι = os.path.splitext(view.file_name())[1]
	return data[ι] if ι in data else view.settings().get('syntax')
def _3_t(view): t = detect_syntax(view); t == view.settings().get('syntax') or view.set_syntax_file(t)
class _3(sublime_plugin.EventListener):
	def on_load(self, view): _3_t(view)
	def on_post_save(self, view): _3_t(view)
class get_syntax(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view
		print('[fyi]','syntax:',view.settings().get('syntax'))
