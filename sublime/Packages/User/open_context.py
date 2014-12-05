import sublime, sublime_plugin
import os
import re
import webbrowser

def browser(v): print("OPENCTX browser",v); webbrowser.open(v, autoraise=True)
def terminal(v): print("OPENCTX terminal",v); os.system("osascript -e 'tell application \"terminal\"' -e 'do script \"cd "+v+"\"' -e 'end tell'; osascript -e 'tell application \"terminal\" to activate'" if v == "/tmp" else "open -a Terminal '"+v+"'")

class OpenContextCommand(sublime_plugin.TextCommand):
	def run(self,edit,context):
		fl = self.view.file_name()
		while True:
			if context == "github":
				t = re.match("/Users/ali/ali/github/(\w+)/(.+)",fl)
				if not t: context = "terminal"; continue
				user = 'dreeves' if t.group(1) == 'beeminder' else 'alice0meta'
				browser('https://github.com/'+user+'/'+t.group(1)+'/blob/master/'+t.group(2))
			elif context == "terminal":
				terminal('/Users/ali' if fl is None else os.path.dirname(fl))
			break
