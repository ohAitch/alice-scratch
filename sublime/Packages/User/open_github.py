import sublime, sublime_plugin
import os
import re

def chrome(v): os.system(""""/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" '"""+v+"""'; osascript -e 'tell application "Chrome" to activate'""")

class OpenGithubCommand(sublime_plugin.TextCommand):
	def run(self,edit):
		t = re.match("/Users/ali/ali/github/(\w+)/(.+)",self.view.file_name())
		user = 'dreeves' if t.group(1) == 'beeminder' else 'alice0meta'
		chrome('https://github.com/'+user+'/'+t.group(1)+'/blob/master/'+t.group(2))
