import sublime, sublime_plugin
import os, subprocess
import re
import urllib

FIND_URL_REGEX = r'\b(https?|file)://(?:\\ |\S)+([.,)\]}](?=\.)|(?<![".,)\]}])(?<!"[".,)\]}]))'
IS_URL_REGEX = r'^(https?|file)://'

# the github/google search text combo is weird. work on improving that?
# should replace "\ " with " " (and "\\" with "\") in file urls

def open(v,app=None,focus=True):
	print("[OPEN]",v)

	# replace "\ " in filenames with " "
	fv = re.match(r'^file://(.*)',v)
	if fv: v = re.sub(r'\\ ',' ',v)
	
	subprocess.call([v for v in ["open", app and "-a", app, not focus and "-g", v] if v])
	
	# predict when path finder got used
	fv = re.match(r'^file://(.*)',v)
	if not app and fv and os.path.isdir(fv.group(1)):
		app = "Path Finder"

	if app is "Path Finder": os.system("osascript -e 'tell application \""+"Path Finder"+"\" to activate'")

def github_url_of_file_in_repo(fl):
	if not fl: return None
	t = re.match(r'/Users/ali/ali/github/([^/]+)/(.+)',fl)
	if not t: return None
	user = 'dreeves' if t.group(1) == 'beeminder' else 'machine-intelligence' if t.group(1) == 'research-forum' else 'alice0meta'
	return 'https://github.com/'+urllib.parse.quote(user+'/'+t.group(1)+'/blob/master/'+t.group(2))

def omnibox(v): return v if re.match(IS_URL_REGEX,v) else "https://www.google.com/search?q="+v

class OpenContextCommand(sublime_plugin.TextCommand):
	def run(self,edit,type,focus=True,edges=True):
		view = self.view
		if type == "browser":
			t = [view.substr(v) for v in view.sel() if not v.empty()]
			if len(t) > 0:
				[open(omnibox(v),focus=focus) for v in t]
			else:
				t = github_url_of_file_in_repo(view.file_name())
				line = view.rowcol(view.sel()[0].begin())[0] + 1
				hash = '' if line == 1 else '#L'+str(line)
				if t: open(t+hash,focus=focus)
		elif type == "terminal":
			fl = view.file_name()
			open(os.getenv("HOME") if fl is None else os.path.dirname(fl),focus=focus,app="Terminal")
		elif type == "link":
			if all([v.empty() for v in view.sel()]):
				for sel in view.sel():
					begin = 0 if sel.a < 300 else sel.a - 300
					for v in re.finditer(FIND_URL_REGEX,view.substr(sublime.Region(begin,sel.a+300))):
						s = v.start(); e = v.end()
						if not edges: s += 1
						if not edges: e -= 1
						if s <= sel.a - begin <= e:
							open(v.group(),focus=focus)
							break
