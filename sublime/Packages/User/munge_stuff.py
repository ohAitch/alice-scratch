# make use of the fact that urls can't contain newlines

# “
# restructure link copying and manipulation (in sublime plugins, bashrc, ζ, possibly more (path finder? chrome url bar?)) to have a centralized normalization format and management for labelling text and usage of url formatters
# also to have a consistent way to interact with sublime and the pastebin
# could do this in a way that routes everything through ζ (except things where the flat 80ms cost is too much?) but should architect it in a way that doesn't tie you into ζ; like, if i define “p” in ζ but can export it to a self-contained bash function that would be amazing
# ”

# maybe require('wav') and npm('wav@ should be links to http://npmjs.com/package/wav

# `agentyduck.blogspot.com` really ought to be a valid link (both in parsing and in producing)

# would be great to have the eval zeta thing return a stream

import sublime, sublime_plugin
from sublime import Region
import os, subprocess, re, urllib, json

URL = r'\b(?:https?://|(?:file|mailto):)(?:[^\s“”"<>]*\([^\s“”"<>]*\))?(?:[^\s“”"<>]*[^\s“”"<>)\]}⟩?!,.:;])?'
IS_URL = r'^(?:https?://|(?:file|mailto):)'

def ζ(*a):
	# args = ['/usr/local/bin/ζ',*args]
	args = ['/usr/local/bin/node','/usr/local/lib/node_modules/zeta-lang/bin/index.js']+list(a)
	# if stdin:
	# 	t = subprocess.Popen(args, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
	# 	t = t.communicate(bytes(stdin,'UTF-8'))
	# 	# ignore stderr
	# 	return t[0].decode('utf-8')
	# else:
	return subprocess.check_output(args).decode('utf-8')

def sh_encode(ι): return re.escape(ι)
def osa_encode(ι): return '"'+re.sub(r'"',r'\\"',re.sub(r'\\',r'\\\\',ι))+'"'

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
	for t in re.finditer(URL,view.substr(l)):
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

def open(ι,app=None,focus=True,view=None):
	print("#OPEN",ι,'∈',app)
	if not focus: subprocess.call(['bash','-ci','sfx ack'])

	if app is None and re.match(r'^file:',ι):
		t = re.sub(r'^file:(//)?','',ι)
		t = urllib.parse.unquote(t)
		t = urllib.parse.quote(t.encode('utf-8'))
		ι = 'file:'+t

		t = re.sub(r'^file:(//)?','',ι)
		t = urllib.parse.unquote(t)

		if view and view.file_name() and t[0] != '/': t = os.path.normpath(os.path.join(os.path.dirname(view.file_name()),t)); ι = 'file:'+urllib.parse.quote(t.encode('utf-8'))
		if os.path.isdir(t): app = "Path Finder"
		elif os.path.splitext(t)[1] in ['.pdf','.m4a','.epub']: pass
		# elif os.path.splitext(t)[1] in ['.png','.jpg']: make app be ql
		else: app = "Sublime Text"

	if app is "Terminal":
		ζ("""focus ← """+json.dumps(focus)+"""; ι ← """+repr(ι)+"""; ids ← [2,3]._.indexBy()
		sfx`ack`
		var [dir,base] = φ(ι).is_dir? [ι] : [φ(ι).φ`..`+'', φ(ι).name]
		unbusy ← _.zip(...osaᵥ`terminal: {name,id} of (windows whose busy = false)`).find(λ([ι,]){t ← /⌘(\d+)$/.λ(ι); ↩ t && ids[t[1]]}); if (unbusy) unbusy = unbusy[1]
		φ`/tmp/__·`.ι = sh`cd ${ι}`+(!unbusy? '; clear' : '')
		osaᵥ`terminal: do script "·" …${unbusy? osa`in (window 1 whose id = ${unbusy})` : ''}; …${focus? 'activate' : ''}`
		;""")
	else:
		subprocess.call([ι for ι in ["open", app and "-a", app, not focus and "-g", ι] if ι])
	if focus and app in ["Path Finder"]: os.system("osascript -e 'tell app "+osa_encode(app)+" to activate'") # workaround for bugs in those apps

def omnibox(ι): return ι if re.match(IS_URL,ι) else "https://www.google.com/search?q="+urllib.parse.quote(ι.encode("utf-8")) # +"&btnI=I"

class open_context(sublime_plugin.TextCommand):
	def run(self,edit,type,focus=True,mouse=False):
		view = self.view
		if type == "github":
			t = ζ("""
				ι ← φ("""+repr(view.file_name() or '')+""").root('/')
				root ← ι; while (root+'' !== '/' && !root.φ`.git`.BAD_exists()) root = root.φ`..`
				if (root+'' !== '/') {
					ι = (ι+'').slice((root+'/').length)
					t ← root.φ`.git/config`.ini['remote "origin"'].url.match(/github\.com[:/](.+)\/(.+)\.git/)
					r ← encodeURI('http://github.com/'+t[1]+'/'+t[2]+'/blob/'+root.φ`.git/HEAD`.text.match(/refs\/heads\/(.+)/)[1]+'/'+ι)
					process.stdout.write(r) }
				;""")
			if t:
				h = ['L'+str(view.rowcol(ι)[0] + 1) for ι in [view.sel()[0].begin(), view.sel()[-1].end()]]
				open(t+('' if h[0] == h[1] == 'L1' else '#'+(h[0] if h[0] == h[1] else h[0]+'-'+h[1])),focus=focus)
		elif type == "terminal":
			open(view.file_name() or os.getenv("HOME"),focus=focus,app="Terminal")
		elif type == "link":
			if mouse: t = view.sel()[0]; ι = [] if not t.empty() else [ι for ι in [expand_empty_region_to_url(view, view.sel()[0], True)] if not ι.empty()]
			else: ι = expand_empty_regions_to_urls_or_lines(view, view.sel())
			if mouse and len(ι): view.sel().clear(); view.sel().add(Region(ι[0].end(),ι[0].end())) # workaround for a bug
			for ι in ι: open(omnibox(view.substr(ι)),focus=focus,view=view)

class inline_eval_zeta(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view; sel = view.sel()
		# append = len(sel) == 1 and sel[0].empty()
		sel = expand_empty_regions_to_lines(view, sel)
		sel = left_trim_regions(view, sel)
		ι = [view.substr(ι) for ι in sel]
		r = json.loads(ζ("""
			global.i = 0
			ι ← JSON.parse(ι).map(λ(ι){
				r ← hook_stdouterr()
				t←; e←; (λ __special_es__u7h7zxgvi__(){try {global.code = ι; global.require = require; t = (0,eval)(ζ_compile(ι+''))} catch (e_) {e = e_}})()
				r = r(); r = [(r[0]? r[0]+'\\n' : '')+r[1]]
				t !== undefined && r.push(t+'')
				e !== undefined && r.push(typeof(e.stack)==='string'? e.stack.replace(/(?:\\n    at eval.*)?\\n    at eval.*\\n    at evalζ.*\\n    at __special_es__u7h7zxgvi__[^]*/,'\\n    at <eval>') : '<error> '+e)
				↩ r.join('')})
			JSON.stringify(ι)""",json.dumps(ι)))
		# if append:
		# 	P = '-> '
		# 	last = Region(sel[0].end(),sel[0].end())
		# 	sel_ = view.sel()[0]; view.sel().clear()
		# 	while view.substr(Region(last.end(),last.end()+len('\n'+P))) == '\n'+P: last = Region(last.begin(), view.line(Region(last.end()+1,last.end()+1)).end())
		# 	view.replace(edit, last, re.sub(r'\n','\n'+P,'\n'+re.sub(r'\n$','',r[0])))
		# 	view.sel().add(sel_)
		# else:
		for i in range(len(sel))[::-1]:
			view.replace(edit, sel[i], r[i])

class inline_compile_zeta_js(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view; sel = view.sel()
		sel = expand_empty_region_to_whole_buffer(view, sel)
		sel = expand_empty_regions_to_lines(view, sel)
		for reg in [ι for ι in sel][::-1]:
			ι = view.substr(reg)
			r = ζ('ζ_compile(ι)',ι)
			if r == ι: r = ζ('ζ_compile["⁻¹"](ι)',ι)
			view.replace(edit, reg, r)

class nice_url(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view
		sel = expand_empty_regions_to_urls_or_lines(view, view.sel())
		for reg in [ι for ι in sel][::-1]:
			ι = view.substr(reg)
			t = ζ('nice_url(ι)',ι)
			if t is not ι: view.replace(edit, reg, t)

class _(sublime_plugin.EventListener):
	def on_post_save(self,view): view.substr(Region(0,2)) == '#!' and subprocess.Popen(['chmod','+x',view.file_name()])
