import sublime, sublime_plugin
import re

# oh god
# this file is mostly hacked together when we needed the functionality but also needed to get back to something else
# i guess it's a bit better now though :)

class DividerCommand(sublime_plugin.TextCommand):
	def run(self,edit,length):
		e_table_ = {'rb':'#', 'py':'#', 'sh':'#', 'js':'/'}
		def e_table(v): return e_table_[v] if v in e_table_ else '-'
		s_table = {
			'#': ["^#+.*#+$","^#+\s*(.+?)\s*#+$",['',''],'#'],
			'-': ["^-+.*-+$","^-+\s*(.+?)\s*-+$",['',''],'-'],
			'/': ["^//=+-+.*-+=+//$","^//=+-+=+//\s*(.+?)\s*//=+-+=+//$",['//===','===//'],'-']
			}
		ext = '' if self.view.file_name() is None else re.sub("^.*?(?:\.([^.]*))?$","\\1",self.view.file_name())
		data = s_table[e_table(ext)]
		for region in reversed([s for s in self.view.sel()]):
			line = self.view.line(region)
			s = self.view.substr(line)
			if re.match(data[0],s):
				s = re.match(data[1],s).group(1)
			else:
				s = s.strip()
			t = sum([len(v) for v in data[2]])
			begin =     data[2][0]      +(data[3]*((length-len(s)-2 + 1)//2 - t))+data[2][1]      +' '
			end   = ' '+data[2][1][::-1]+(data[3]*((length-len(s)-2    )//2 - t))+data[2][0][::-1]
			self.view.replace(edit,line,begin+s+end)
