import sublime, sublime_plugin
import os
import re
import subprocess

def browser(v,raise_=True):
	if not re.match("^https?://",v): v = "https://www.google.com/search?q="+v
	print("OPEN browser",v)
	if raise_: subprocess.call(["open",v])
	else: os.system("'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' '"+v+"'")
def terminal(v,raise_=True):
	print("OPEN terminal",v)
	if raise_: os.system("osascript -e 'tell application \"terminal\"' -e 'do script \"cd "+v+"\"' -e 'end tell'; osascript -e 'tell application \"terminal\" to activate'" if v == "/tmp" else "open -a Terminal '"+v+"'")
	else: os.system("osascript -e 'tell application \"terminal\"' -e 'do script \"cd "+v+"\"' -e 'end tell'")

def github_url_of_file_in_repo(fl):
	if not fl: return None
	t = re.match("/Users/ali/ali/github/(\w+)/(.+)",fl)
	if not t: return None
	user = 'dreeves' if t.group(1) == 'beeminder' else 'alice0meta'
	return 'https://github.com/'+user+'/'+t.group(1)+'/blob/master/'+t.group(2)

class OpenContextCommand(sublime_plugin.TextCommand):
	def run(self,edit,type,autoraise=True):
		if type == "browser":
			t = [v for v in [self.view.substr(v) for v in self.view.sel()] if v != ""]
			if len(t) > 0:
				[browser(v,autoraise) for v in t]
			else:
				t = github_url_of_file_in_repo(self.view.file_name())
				if t: browser(t,autoraise)
		elif type == "terminal":
			fl = self.view.file_name()
			terminal(os.getenv("HOME") if fl is None else os.path.dirname(fl),autoraise)
		elif type == "link":
			sel = self.view.sel()[0]
			if sel.empty():
				begin = 0 if sel.a < 300 else sel.a - 300
				for v in re.finditer(r'\bhttps?://\S*([.)](?=.)|"(?!\s)|[^\s)."])',self.view.substr(sublime.Region(begin,sel.a+300))):
					if v.start() < sel.a - begin < v.end():
						browser(v.group(),autoraise)
						break
