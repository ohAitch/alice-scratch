import sublime, sublime_plugin
import os, subprocess
import re

URL_REGEX = r'\b(https?|file)://\S+([.,)\]}](?=\.)|(?<![".,)\]}])(?<!"[".,)\]}]))'
IS_URL_REGEX = r'^(https?|file)://'

# the github/google search text combo is weird. work on improving that?

def open(v,app=None,focus=True):
	print("OPEN",v)
	# if app is "Path Finder" or (re.match(r'^file://(.*)',v) and blah blah then we should execute os.system("osascript -e 'tell application \""+"Path Finder"+"\" to activate'")
	subprocess.call([v for v in ["open", app and "-a", app, not focus and "-g", v] if v])

def github_url_of_file_in_repo(fl):
	if not fl: return None
	t = re.match("/Users/ali/ali/github/(\w+)/(.+)",fl)
	if not t: return None
	user = 'dreeves' if t.group(1) == 'beeminder' else 'alice0meta'
	return 'https://github.com/'+user+'/'+t.group(1)+'/blob/master/'+t.group(2)

def omnibox(v): return v if re.match(IS_URL_REGEX,v) else "https://www.google.com/search?q="+v

class OpenContextCommand(sublime_plugin.TextCommand):
	def run(self,edit,type,focus=True):
		view = self.view
		if type == "browser":
			t = [v for v in [view.substr(v) for v in view.sel()] if v != ""]
			if len(t) > 0:
				[open(omnibox(v),focus=focus) for v in t]
			else:
				t = github_url_of_file_in_repo(view.file_name())
				line = view.rowcol(view.sel()[0].begin())[0] + 1
				if t: open(t+'#L'+str(line),focus=focus)
		elif type == "terminal":
			fl = view.file_name()
			open(os.getenv("HOME") if fl is None else os.path.dirname(fl),focus=focus,app="Terminal")
		elif type == "link":
			sel = view.sel()[0]
			if sel.empty():
				begin = 0 if sel.a < 300 else sel.a - 300
				for v in re.finditer(URL_REGEX,view.substr(sublime.Region(begin,sel.a+300))):
					if v.start() < sel.a - begin < v.end():
						open(v.group(),focus=focus)
						break
