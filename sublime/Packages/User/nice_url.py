import sublime, sublime_plugin
import subprocess
import re

# todo: understand urls magically like open_context.py does.
# actually parse the query string

class NiceUrlCommand(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view
		for reg in view.sel():
			o = view.substr(reg)
			v = o
			v = re.sub(r'^https?://(?:www\.)?youtube\.com/watch\?v=([^&]+)','http://youtu.be/\\1',v)
			v = re.sub(r'^https?://en\.wikipedia\.org/','http://wikipedia.org/',v)
			v = re.sub(r'^/Users/ali/','file:///~/',v)
			if re.match(r'^file:///',v): v = re.sub(r'(?<!\\) ','\\ ',v)
			v = re.sub(r'^file:///~/ali/books/papers/','file:///~/papers/',v)
			v = re.sub(r'^file:///~/ali/books/','file:///~/books/',v)
			if v is not o: view.replace(edit, reg, v)

# todo:
# https://www.youtube.com/watch?v=ylWORyToTo4&list=PLBDA2E52FB1EF80C9&index=7
# -> http://youtu.be/ylWORyToTo4?list=PLBDA2E52FB1EF80C9
