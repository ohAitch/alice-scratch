# make use of the fact that urls can't contain newlines

# “
# restructure link copying and manipulation (in sublime plugins, bashrc, ζ, possibly more (path finder? chrome url bar?)) to have a centralized normalization format and management for labelling text and usage of url formatters
# also to have a consistent way to interact with sublime and the pastebin
# could do this in a way that routes everything through ζ (except things where the flat 80ms cost is too much?) but should architect it in a way that doesn't tie you into ζ; like, if i define “p” in ζ but can export it to a self-contained bash function that would be amazing
# ”

import sublime, sublime_plugin
import os, subprocess, re, urllib, json

URL = r'\b(?:https?://|(?:file|mailto):)(?:[^\s“”"<>]*\([^\s“”"<>]*\))?(?:[^\s“”"<>]*[^\s“”"<>)\]}⟩?!,.:;])?'
IS_URL = r'^(?:https?://|(?:file|mailto):)'

def ζ(ι): return subprocess.check_output(['/usr/bin/env','/usr/local/bin/node','--harmony','/usr/local/bin/ζ','-e',ι]).decode('utf-8')

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
	a = max(ι.a-300, 0); b = min(ι.a+300, view.size())
	for t in re.finditer(URL,view.substr(sublime.Region(a,b))):
		s = a + t.start(); e = a + t.end()
		if (s < ι.a < e if mouse_mode else s <= ι.a <= e):
			return sublime.Region(s,e)
	return ι
def expand_empty_regions_to_urls_or_lines(view,ι): return merge_overlapping_regions([expand_empty_region_to_line(view,expand_empty_region_to_url(view,ι)) for ι in ι])
def expand_empty_regions_to_lines(view,regions): return merge_overlapping_regions([expand_empty_region_to_line(view,ι) for ι in regions])
def expand_empty_region_to_whole_buffer(view,regions): return [sublime.Region(0,view.size())] if len(view.sel()) == 1 and view.sel()[0].empty() else view.sel()

def echo_string_pipe_process__check_output(string,args):
	t = subprocess.Popen(args, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
	t = t.communicate(bytes(string,'UTF-8'))
	# ignore stderr
	return t[0].decode('utf-8')

def open(ι,app=None,focus=True,view=None):
	print("#OPEN",ι)
	if not focus: subprocess.call(['bash','-ci','ack'])

	if app is None and re.match(r'^file:',ι):
		t = urllib.parse.unquote(re.sub(r'^file:(//)?','',ι))
		if view and view.file_name() and t[0] != '/': t = os.path.normpath(os.path.join(os.path.dirname(view.file_name()),t)); ι = 'file:'+urllib.parse.quote(t.encode('utf-8'))
		if os.path.isdir(t): app = "Path Finder"
		elif os.path.splitext(t)[1] in ['.pdf','.m4a','.epub']: pass
		else: app = "Sublime Text"

	if app is "Terminal":
		dir,base = [ι,None] if os.path.isdir(ι) else [os.path.dirname(ι), os.path.basename(ι)]
		t = "cd "+sh_encode(dir)+"; clear"
		if base: t += "; set -- "+sh_encode(base)+'; ({ sleep 0.01; printf "\\b${green}/${purple}"'+sh_encode(base)+'" ${reset}"; } &)'
		os.system("osascript -e "+sh_encode('tell app "terminal" to do script '+osa_encode(t)))
	else:
		subprocess.call([ι for ι in ["open", app and "-a", app, not focus and "-g", ι] if ι])
	if focus and app in ["Path Finder","Terminal"]: os.system("osascript -e 'tell app \""+app+"\" to activate'") # workaround for a bug

def omnibox(ι): return ι if re.match(IS_URL,ι) else "https://www.google.com/search?q="+urllib.parse.quote(ι.encode("utf-8")) # +"&btnI=I"

class OpenContextCommand(sublime_plugin.TextCommand):
	def run(self,edit,type,focus=True,mouse=False):
		view = self.view
		if type == "github":
			t = ζ("""
				ι ← fs("""+repr(view.file_name() or '')+""").resolve()
				root ← ι; while (root !== '/' && !fs(root+'/.git').exists()) root = fs(root).parent()
				if (root !== '/') {
					ι = ι.slice((root+'/').length)
					t ← require('ini','1.3.4').parse(fs(root+'/.git/config').$)['remote "origin"'].url.match(/github\.com[:/](.+)\/(.+)\.git/)
					r ← 'http://github.com/'+t[1]+'/'+t[2]+'/blob/'+fs(root+'/.git/HEAD').$.match(/refs\/heads\/(.+)/)[1]+'/'+ι
					process.stdout.write(r) }
				""")
			if t:
				h = ['L'+str(view.rowcol(ι)[0] + 1) for ι in [view.sel()[0].begin(), view.sel()[-1].end()]]
				open(t+('' if h[0] == 'L1' else '#'+(h[0] if h[0] == h[1] else h[0]+'-'+h[1])),focus=focus)
		elif type == "terminal":
			open(view.file_name() or os.getenv("HOME"),focus=focus,app="Terminal")
		elif type == "link":
			if mouse: t = view.sel()[0]; ι = [] if not t.empty() else [ι for ι in [expand_empty_region_to_url(view, view.sel()[0], True)] if not ι.empty()]
			else: ι = expand_empty_regions_to_urls_or_lines(view, view.sel())
			if mouse and len(ι): view.sel().clear(); view.sel().add(sublime.Region(ι[0].end(),ι[0].end())) # workaround for a bug
			for ι in ι: open(omnibox(view.substr(ι)),focus=focus,view=view)

class InlineEvalZetaCommand(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view; sel = view.sel()
		append = len(sel) == 1 and sel[0].empty()
		sel = expand_empty_regions_to_lines(view, sel)
		ι = [view.substr(ι) for ι in sel]
		r = json.loads(subprocess.check_output(['/usr/local/bin/node','--harmony','/usr/local/bin/ζ','-pa',json.dumps(ι)]).decode('utf-8'))
		if append:
			P = '-> '
			last = sublime.Region(sel[0].end(),sel[0].end())
			sel_ = view.sel()[0]; view.sel().clear()
			while view.substr(sublime.Region(last.end(),last.end()+len('\n'+P))) == '\n'+P: last = sublime.Region(last.begin(), view.line(sublime.Region(last.end()+1,last.end()+1)).end())
			view.replace(edit, last, re.sub(r'\n','\n'+P,'\n'+re.sub(r'\n$','',r[0])))
			view.sel().add(sel_)
		else:
			for i in range(len(sel))[::-1]:
				view.replace(edit, sel[i], r[i])

def compile_stuff(self,edit,f):
	view = self.view; sel = view.sel()
	sel = expand_empty_region_to_whole_buffer(view, sel)
	sel = expand_empty_regions_to_lines(view, sel)
	for i in range(len(sel))[::-1]:
		r = echo_string_pipe_process__check_output(view.substr(sel[i]), ['/usr/local/bin/node','--harmony','/usr/local/bin/ζ','-p',f+'(ι)'])
		view.replace(edit, sel[i], r)

class InlineCompileZetaJsCommand(sublime_plugin.TextCommand):
	def run(self,edit): compile_stuff(self,edit,'ζ_compile')
class InlineCompileJsZetaCommand(sublime_plugin.TextCommand):
	def run(self,edit): compile_stuff(self,edit,'ζ_compile["⁻¹"]')

class NiceUrlCommand(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view
		sel = expand_empty_regions_to_urls_or_lines(view, view.sel())
		for region in sel:
			ι = o = view.substr(region)

			ι = re.sub(r'^https://','http://',ι)
			ι = re.sub(r'^(http://)www\.',r'\1',ι)
			ι = re.sub(r'^(http://)(?:mail\.)?(google\.com/mail/)u/0/\??#(?:(?:label|search)/[\w%+]+|\w+)/(\w+)',r'\1\2#all/\3',ι)
			ι = re.sub(r'^(http://)en\.(wikipedia\.org)/',r'\1\2',ι)
			ι = re.sub(r'^(http://)youtube\.com/watch\?ι=([^&]+)&',r'\1youtu.be/\2?',ι)
			ι = re.sub(r'^(http://)youtube\.com/watch\?ι=([^&]+)' ,r'\1youtu.be/\2' ,ι)
			ι = re.sub(r'^(http://)smile\.(amazon.com/)',r'\1\2',ι)
			ι = re.sub(r'^(http://amazon.com/.*)\?sa-no-redirect=1$',r'\1',ι)
			ι = re.sub(r'^(http://docs\.google\.com/document/d/[\w_-]+)/edit(?:\?ts=\w+)?$',r'\1',ι)
			ι = re.sub(r'^(http://docs\.google\.com/spreadsheets/d/[\w_-]+)/edit(?:#gid=0)?$',r'\1',ι)
			ι = re.sub(r'^(http://dropbox.com/.*)\?dl=0$',r'\1',ι)
			ι = re.sub(r'^(http://)facebook(\.com/)',r'\1\2',ι)
			ι = re.sub(r'^(http://fb\.com/[\w.]+)([?&]fref=\w+)?([?&]hc_location=[\w_]+)?',r'\1',ι)
			ι = re.sub(r'^"(.*)"$',r'“\1”',ι) #! not actually for urls

			if ι is not o: view.replace(edit, region, ι)

############ todo ############

# needs: parsing the query string
# http://amazon.com/Lower-Your-Taxes-Time-2013-2014/dp/0071803408/ref=sr_1_1?s=books&ie=UTF8&qid=1365921208&sr=1-1&keywords=Lower+Your+Taxes%3ABig+Time
# http://amazon.com/Lower-Your-Taxes-Time-2013-2014/dp/0071803408

# http://smile.amazon.com/Thinking-Pencil-Henning-Nelms/dp/0898150523?sa-no-redirect=1
# Thinking Pencil http://amzn.to/1jxKp9q

# https://docs.google.com/spreadsheets/d/1wfFMPo8n_mpcoBCFdsIUUIt7oSm7d__Duex51yejbBQ/edit#gid=0
# http://goo.gl/0nrUfP
