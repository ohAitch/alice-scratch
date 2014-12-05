import sublime, sublime_plugin
import re
import webbrowser

class OpenSelectionCommand(sublime_plugin.TextCommand):
	def run(self, edit):
		sel = self.view.sel()[0]
		if sel.empty():
			t = re.match("\\S*[^\\s)]",self.view.substr(sublime.Region(sel.a,sel.b+300)))
			if t:
				if not re.match("\\bhttps?://\\S*[^\\s)]",t.group()):
					t = re.match("[^\\s)]\\S*//:s?ptth\\b",(self.view.substr(sublime.Region(sel.a-300,sel.b))+t.group())[::-1])
					if t:
						t = t.group()[::-1]
						webbrowser.open(t, autoraise=True)
