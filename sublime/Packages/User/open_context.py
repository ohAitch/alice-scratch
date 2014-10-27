import sublime, sublime_plugin
import os
import re

def chrome(v): os.system("'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' '"+v+"'; osascript -e 'tell application \"Chrome\" to activate'")
def terminal(v): os.system("open -a Terminal '"+v+"'")

class OpenContextCommand(sublime_plugin.TextCommand):
	def run(self,edit,context):
		fl = self.view.file_name()
		while True:
			if context == "github":
				t = re.match("/Users/ali/ali/github/(\w+)/(.+)",fl)
				if not t: context = "terminal"; continue
				user = 'dreeves' if t.group(1) == 'beeminder' else 'alice0meta'
				chrome('https://github.com/'+user+'/'+t.group(1)+'/blob/master/'+t.group(2))
			elif context == "terminal":
				terminal(os.path.dirname(fl))
			break
