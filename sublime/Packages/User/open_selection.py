import sublime, sublime_plugin
import re
import webbrowser

class OpenSelectionCommand(sublime_plugin.TextCommand):
	def run(self, edit):
		sel = self.view.sel()[0]
		if sel.empty():
			begin = 0 if sel.a < 300 else sel.a - 300
			for v in re.finditer(r'\bhttps?://\S*([.)](?=.)|"(?!\s)|[^\s)."])',self.view.substr(sublime.Region(begin,sel.a+300))):
				if v.start() < sel.a - begin < v.end():
					webbrowser.open(v.group(), autoraise=True)
					break
